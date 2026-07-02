// Hydration harness. Serves dist/ the way the real host does (existing files
// win, otherwise the _redirects rules apply), loads each route in jsdom,
// executes the built client bundle against it, and FAILS if React logs a
// hydration-mismatch warning. This asserts the real invariant (SSR HTML ==
// client first render), which a "does not throw" test does not.
//
// Coverage (more than just `/`):
//   - `/` and EVERY prerendered route listed in dist/_redirects are loaded the
//     way a cold visit / refresh / deep-link would resolve them (served from
//     their OWN directory index). A mismatch on any of these FAILS the run.
//   - One unknown path is probed to exercise the SPA catch-all fallback. With
//     prerender on, the fallback shell is the prerendered HOMEPAGE, so a
//     non-home path mismatches on hydration (the known ":param / unknown route
//     flash"). That is reported as a DIAGNOSTIC, not a failure: the real fix is
//     host-side (serve a neutral shell for the fallback), tracked separately.
//
// Requires a prior flag-on `npm run build`.
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import http from "node:http";
import { JSDOM, ResourceLoader, VirtualConsole } from "jsdom";
import { parseRedirects, realRoutes, resolveServePath } from "./redirects.mjs";

const DIST = path.join(process.cwd(), "dist");
const HYDRATE_WAIT_MS = 2500;
const FALLBACK_PROBE = "/__hydration_fallback_probe__";

// Minimal content-type map so assets a route pulls in (fonts, images, json)
// are served with a sane type rather than text/html. Unknown -> text/html
// (every served file ultimately resolves to .html or a listed asset).
const CONTENT_TYPES = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

// dist-relative file-existence predicate. `rel` is already traversal-checked by
// toServeRel (no `..`), so path.join stays within DIST.
function fileExists(rel) {
  try {
    return statSync(path.join(DIST, rel)).isFile();
  } catch {
    return false;
  }
}

const redirectsPath = path.join(DIST, "_redirects");
const rules = existsSync(redirectsPath) ? parseRedirects(readFileSync(redirectsPath, "utf8")) : [];

// Resolve a request to an absolute file the way the host would (existing-file-
// wins shadowing, then rules, then SPA shell). The pure logic lives in
// resolveServePath; here we only add the filesystem read and a defense-in-depth
// containment check.
function resolveRequest(reqPath) {
  const rel = resolveServePath(reqPath, rules, fileExists);
  if (!rel) return null;
  const abs = path.join(DIST, rel);
  if (abs !== DIST && !abs.startsWith(DIST + path.sep)) return null;
  return abs;
}

function serveDist() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const file = resolveRequest(req.url);
      if (!file) {
        res.writeHead(404);
        res.end();
        return;
      }
      const type = CONTENT_TYPES[path.extname(file)] ?? "text/html";
      res.writeHead(200, { "content-type": type });
      res.end(readFileSync(file));
    });
    server.listen(0, () => resolve(server));
  });
}

// Load one URL in jsdom, run the client bundle, and return any hydration
// warnings React logged while hydrating it.
async function hydrationWarningsFor(port, urlPath) {
  const warnings = [];
  const vc = new VirtualConsole();
  const capture = (msg) => {
    const s = String(msg);
    if (/hydrat|did not match|server.rendered/i.test(s)) warnings.push(s);
  };
  vc.on("error", capture);
  vc.on("warn", capture);
  vc.on("jsdomError", capture);

  const dom = await JSDOM.fromURL(`http://localhost:${port}${urlPath}`, {
    runScripts: "dangerously",
    resources: new ResourceLoader(),
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  await new Promise((r) => setTimeout(r, HYDRATE_WAIT_MS));
  dom.window.close();
  return warnings;
}

const server = await serveDist();
const port = server.address().port;

// Real routes to assert: `/` plus every prerendered route in _redirects.
const routesToCheck = realRoutes(rules);

let failed = false;
try {
  for (const route of routesToCheck) {
    const warnings = await hydrationWarningsFor(port, route);
    if (warnings.length) {
      failed = true;
      console.error(`Hydration mismatch on ${route}:\n${warnings.join("\n")}`);
    } else {
      console.log(`check:hydration OK ${route}`);
    }
  }

  // Diagnostic only: exercise the SPA catch-all with an unknown path.
  const fallbackWarnings = await hydrationWarningsFor(port, FALLBACK_PROBE);
  if (fallbackWarnings.length) {
    console.warn(
      `check:hydration NOTE: the SPA fallback shell hydration-mismatches on an ` +
        `unknown path (${FALLBACK_PROBE}). Expected while the fallback serves the ` +
        `prerendered homepage; the fix is a host-side neutral shell. Not a failure.`,
    );
  }
} finally {
  server.close();
}

if (failed) {
  process.exit(1);
}
console.log(`check:hydration OK (${routesToCheck.length} route(s), no hydration warnings)`);
