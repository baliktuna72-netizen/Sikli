// Single entry for `npm run build`.
//   Flag OFF -> exactly `vite build` (today's behavior, bit-identical).
//   Flag ON  -> client build (the deliverable) FIRST, then a best-effort
//               SSR+prerender enrichment phase that can never regress the site:
//               any failure leaves the built dist/ untouched and exits 0.
// The prerender render behavior is gated in app code on
// import.meta.env.VITE_PRERENDER, defined here ONLY when the flag is on.
import { build } from "vite";
import { readFileSync } from "node:fs";
import path from "node:path";
import { prerender } from "./prerender.mjs";

// Captured at module load, BEFORE the client build runs, so the prerender
// deadline accounts for TOTAL wall time (client build + SSR build + per-route
// render), not just the SSR phase. A slow client build then shrinks the SSR
// budget instead of stacking on top of it and pushing total wall time past the
// external SIGKILL.
const PROCESS_START = Date.now();

function prerenderEnabled() {
  try {
    const cfg = JSON.parse(readFileSync(path.join(process.cwd(), "promake.json"), "utf8"));
    return cfg?.prerender === true;
  } catch {
    return false;
  }
}

// One-line, machine-greppable fallback signal so the publish pipeline / log
// analysis can detect sites that shipped WITHOUT the SEO enrichment.
function reportFallback(reason, detail) {
  console.warn(`PRERENDER_FALLBACK reason=${reason} detail=${JSON.stringify(detail ?? "")}`);
}

const PRERENDER_DEFINE = { "import.meta.env.VITE_PRERENDER": "true" };
// Hard ceiling = the publish pipeline's external SIGKILL. The whole prerender
// effort must finish before HARD_LIMIT_MS - MARGIN, measured from PROCESS_START,
// so we stop ourselves (graceful, exit 0) before the SIGKILL lands. The margin
// covers the gap between a deadline check and the kill (one in-flight route
// render can overshoot the check). Both overridable via env.
const HARD_LIMIT_MS = Number(process.env.PRERENDER_HARD_LIMIT_MS ?? 120_000);
const SAFETY_MARGIN_MS = Number(process.env.PRERENDER_MARGIN_MS ?? 15_000);

if (!prerenderEnabled()) {
  // Backward compatible path: identical to the previous `vite build`.
  await build();
} else {
  console.log("prerender: enabled");

  // 1) Client build FIRST and it is the deliverable. If this throws, it is a
  //    real build failure (same as today's `vite build`) and must fail the
  //    publish -> let it propagate (no try/catch here).
  await build({ define: PRERENDER_DEFINE });

  // 2) SSR + prerender = one best-effort phase. ANY failure (SSR compile error,
  //    server-bundle import-time throw, or prerender error) leaves the client
  //    dist/ untouched and exits 0. This is the structural guarantee: worst
  //    case the site ships exactly what it ships today, minus the SEO bonus.
  // Deadline is anchored to PROCESS_START (before the client build), so whatever
  // the client build already consumed is subtracted from the SSR+prerender budget
  // rather than added on top of it. If the client build alone already ate the
  // budget, the timer below fires immediately and we ship the client dist/ as-is.
  const deadline = PROCESS_START + Math.max(0, HARD_LIMIT_MS - SAFETY_MARGIN_MS);
  // Race a timer against the WHOLE phase, not just the per-route loop: the SSR
  // `vite build` below runs before prerender's internal deadline check, so an
  // un-raced slow SSR compile could blow past the SIGKILL and turn graceful
  // client-only fallback into a hard publish failure. On timeout we resolve (not
  // reject) so the client dist/ ships exactly as it is today.
  let timer;
  const phaseDeadline = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ __deadline: true }), Math.max(0, deadline - Date.now()));
  });
  try {
    const ssrBuild = build({
      define: PRERENDER_DEFINE,
      // Bundle the @promakeai/* packages into the SSR output. Externalized,
      // their internal extensionless ESM imports (e.g. dbreact's
      // ./providers/DbProvider) fail Node's ESM resolution at import time.
      ssr: { noExternal: [/@promakeai\//] },
      build: {
        ssr: "src/entry-server.tsx",
        outDir: "dist-ssr",
        emptyOutDir: true,
        rollupOptions: { output: { entryFileNames: "entry-server.js" } },
      },
    });
    const ssrOutcome = await Promise.race([ssrBuild.then(() => ({})), phaseDeadline]);
    if (ssrOutcome?.__deadline) {
      reportFallback("ssr_build_deadline", { elapsedMs: Date.now() - PROCESS_START });
      clearTimeout(timer);
      process.exit(0);
    }

    const result = await prerender({ deadline });
    clearTimeout(timer);
    if (result.deadlineHit) {
      reportFallback("deadline", { rendered: result.rendered.length });
    } else if (result.rendered.length === 0) {
      reportFallback("no_routes_rendered", { skipped: result.skipped });
    }
  } catch (err) {
    // SSR compile failure or import-time throw: keep the client dist/ as-is.
    clearTimeout(timer);
    reportFallback("ssr_phase_error", String(err?.message ?? err));
  }
  // Always succeed: prerender is enrichment, never a publish blocker.
  process.exit(0);
}
