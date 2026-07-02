// Flags module-scope (depth-0) browser-global access that would throw when the
// SSR bundle is imported, poisoning prerender for every route. Access inside
// any { ... } block (function/effect bodies) is allowed; so is a typeof guard.
// Brace-depth heuristic, intentionally conservative: it errs toward NOT flagging
// guarded/nested code, so it never blocks a safe build.
const GLOBALS = ["window", "document", "localStorage"];

/**
 * @param {string} source
 * @returns {string[]}
 */
export function findSsrUnsafe(source) {
  if (!source) return [];
  // Strip block AND line comments to avoid false hits (a module-scope block
  // comment mentioning `document` would otherwise be flagged and exit non-zero,
  // contrary to this scanner's err-toward-not-flagging contract).
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

  // Note: braces inside strings/regex/template literals are not excluded, so a
  // `{` in a string could skew depth. The heuristic stays conservative (errs
  // toward NOT flagging), so a skew only ever risks a missed warning, never a
  // false block of a safe build. This scanner is advisory, not in the build path.
  // Precompute brace depth at each character index so an access on the SAME
  // line as its opening brace (e.g. inline `useEffect(() => { document... })`)
  // is correctly seen as nested, not module-scope.
  const depthAt = new Array(stripped.length);
  let depth = 0;
  for (let i = 0; i < stripped.length; i++) {
    depthAt[i] = depth;
    const ch = stripped[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth = Math.max(0, depth - 1);
  }

  const found = new Set();
  const re = new RegExp(`\\b(${GLOBALS.join("|")})\\b`, "g");
  let m;
  while ((m = re.exec(stripped)) !== null) {
    if (depthAt[m.index] !== 0) continue; // inside a function/effect body
    // `typeof window` style guards are safe even at module scope.
    if (/typeof\s+$/.test(stripped.slice(Math.max(0, m.index - 8), m.index))) continue;
    found.add(m[1]);
  }
  return [...found];
}

// CLI entry: scan src/modules/**/*.{ts,tsx} and exit non-zero on any hit.
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync, readdirSync, existsSync } = await import("node:fs");
  const path = await import("node:path");
  const root = path.join(process.cwd(), "src", "modules");

  // Recursive walk instead of fs.globSync: globSync was only stabilized in
  // Node 22, so on an older publish/CI image it would throw and silently scan
  // nothing (a false "lint:ssr OK"). readdirSync works on every supported Node.
  function walk(dir) {
    const out = [];
    if (!existsSync(dir)) return out;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...walk(full));
      else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
    }
    return out;
  }
  const files = walk(root);
  const violations = [];
  for (const file of files) {
    const hits = findSsrUnsafe(readFileSync(file, "utf8"));
    if (hits.length) violations.push(`${file}: ${hits.join(", ")}`);
  }
  if (violations.length) {
    console.error("SSR-unsafe module-scope access:\n" + violations.join("\n"));
    process.exit(1);
  }
  console.log("lint:ssr OK");
}
