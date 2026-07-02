// Renders each STATIC route to dist/<route>/index.html using the SSR bundle.
// Runs only inside `npm run build` when the prerender flag is on. A route that
// throws is skipped (no file written); the build still succeeds.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { enumerateStaticRoutes } from "./routes.mjs";
import { buildRedirects } from "./redirects.mjs";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SSR_ENTRY = path.join(ROOT, "dist-ssr", "entry-server.js");
const ROUTER_SRC = path.join(ROOT, "src", "router.tsx");

export function injectAppHtml(template, appHtml) {
  // Vite emits <div id="root"></div>; replace the empty root with rendered markup.
  // Replacer-FUNCTION form so `$`/`$&` sequences in appHtml are inserted
  // literally, never interpreted as replacement patterns.
  return template.replace(
    /(<div id="root">)(<\/div>)/,
    (_full, open, close) => `${open}${appHtml}${close}`,
  );
}

export function injectHeadTags(template, headTags) {
  // Overwrite the static <title>/description/og:* that `promake seo` wrote into
  // index.html with the per-route values the SSR render produced. Each tag is
  // REPLACED in place (not appended) so crawlers never see duplicate, conflicting
  // og:title/og:description. A tag that has no static counterpart is injected
  // before </head>. No-op when headTags is empty (route set no meta), so the
  // static site-level head is preserved untouched.
  if (!headTags) return template;
  let out = template;
  const inject = []; // tags with no static counterpart to replace

  const titleMatch = headTags.match(/<title data-ssr-meta>([\s\S]*?)<\/title>/);
  if (titleMatch) {
    const titleTag = `<title>${titleMatch[1]}</title>`;
    // Replace an existing <title>, else inject it (symmetric with the meta path
    // below) so a route title is never silently dropped if index.html lacks one.
    if (/<title>[\s\S]*?<\/title>/.test(out)) {
      out = out.replace(/<title>[\s\S]*?<\/title>/, () => titleTag);
    } else {
      inject.push(titleTag);
    }
  }

  // name="..." and property="..." meta tags: replace the existing one by key,
  // else queue for injection. Replacer-function form keeps `$`/`&` literal.
  const metaRe = /<meta (name|property)="([^"]+)" content="([^"]*)" data-ssr-meta \/>/g;
  let m;
  while ((m = metaRe.exec(headTags)) !== null) {
    const [, attr, key, content] = m;
    const tag = `<meta ${attr}="${key}" content="${content}" />`;
    // Escape the key before embedding in a RegExp (keys like og:title are safe
    // today, but a future key with regex metachars must not break the matcher).
    const keyRe = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existing = new RegExp(`<meta ${attr}="${keyRe}" content="[^"]*"\\s*/>`);
    if (existing.test(out)) {
      out = out.replace(existing, () => tag);
    } else {
      inject.push(tag);
    }
  }

  if (inject.length) {
    out = out.replace(/<\/head>/, () => `    ${inject.join("\n    ")}\n  </head>`);
  }
  return out;
}

export function outFileForRoute(route) {
  // Path-traversal is not reachable here: `route` only ever comes from
  // enumerateStaticRoutes() parsing our OWN router.tsx, which drops `*` and
  // `:param` segments, so a route is a plain literal path with no `..`. The
  // serve-time harness (check-hydration.mjs) additionally asserts every read
  // stays within DIST, which would catch a future router shape that broadened
  // where route paths come from.
  if (route === "/") return path.join(DIST, "index.html");
  return path.join(DIST, route.replace(/^\//, ""), "index.html");
}

export async function prerender(opts = {}) {
  const { deadline } = opts; // absolute Date.now() ms; undefined = no limit
  if (!existsSync(SSR_ENTRY)) {
    // Surfaced to build.mjs's phase-level catch; never written individually.
    throw new Error(`prerender: SSR bundle missing at ${SSR_ENTRY}`);
  }
  const template = await readFile(path.join(DIST, "index.html"), "utf8");
  const routerSource = existsSync(ROUTER_SRC) ? await readFile(ROUTER_SRC, "utf8") : "";
  const routes = enumerateStaticRoutes(routerSource);
  if (!routes.includes("/")) routes.unshift("/");

  // Importing the SSR bundle can itself throw (a module touching window/etc. at
  // top level). That rejection propagates to build.mjs's phase-level catch,
  // which keeps the already-built client dist/ and exits 0.
  const { render } = await import(pathToFileURL(SSR_ENTRY).href);

  const rendered = [];
  const skipped = [];
  let deadlineHit = false;
  for (const route of routes) {
    if (deadline && Date.now() > deadline) {
      // Internal deadline guard: stop before the external 120s SIGKILL lands.
      // Keep the client dist/ and routes done so far.
      deadlineHit = true;
      console.warn(`prerender: deadline reached, stopping with ${rendered.length} route(s) done`);
      break;
    }
    try {
      const { appHtml, headTags } = await render(route);
      const html = injectHeadTags(injectAppHtml(template, appHtml), headTags);
      const outFile = outFileForRoute(route);
      await mkdir(path.dirname(outFile), { recursive: true });
      await writeFile(outFile, html, "utf8");
      rendered.push(route);
    } catch (err) {
      // Per-route fallback: leave this route to the client-side SPA shell.
      console.warn(`prerender: skipped ${route}: ${err?.message ?? err}`);
      skipped.push(route);
    }
  }

  // Write _redirects (Netlify-style) from the routes ACTUALLY prerendered, so
  // each resolves to its own directory index and only genuinely unknown /
  // :param paths fall back to the SPA shell. Overwrites the static catch-all
  // `_redirects` that Vite copied from public/. Best-effort: a failure here is
  // logged and swallowed, never failing the build (prerender is enrichment).
  try {
    await writeFile(path.join(DIST, "_redirects"), buildRedirects(rendered), "utf8");
  } catch (err) {
    console.warn(`prerender: _redirects write failed: ${err?.message ?? err}`);
  }

  console.log(
    `prerender: rendered ${rendered.length} route(s), skipped ${skipped.length}, deadlineHit=${deadlineHit}`,
  );
  return { rendered, skipped, deadlineHit };
}
