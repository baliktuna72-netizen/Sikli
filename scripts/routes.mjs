// Pure parser: extract prerenderable (parameterless) route paths from a
// router.tsx source string. No DOM, no build, no IO so it stays unit-testable.

/**
 * @param {string} routerSource
 * @returns {string[]}
 */
export function enumerateStaticRoutes(routerSource) {
  if (!routerSource) return [];
  // Assumes `path` appears before `element` on each <Route>: `[^>]*` stops at the
  // first `>`, and `element={<Foo />}` contains a `>`. The generator always emits
  // path first, so generated routers are covered. A hand-authored route that puts
  // element before path would be skipped here and fall back to the SPA shell at
  // serve time (a conservative miss, not a crash, since the route still works
  // client-side).
  const re = /<Route\s+[^>]*\bpath\s*=\s*"([^"]*)"/g;
  const seen = new Set();
  const out = [];
  let m;
  while ((m = re.exec(routerSource)) !== null) {
    const path = m[1];
    if (path === "*" || path.includes(":")) continue;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(path);
  }
  return out;
}
