// Type declarations for the pure _redirects helpers in redirects.mjs so the CLI
// tests typecheck without enabling allowJs.
export interface RedirectRule {
  from: string;
  to: string;
}
export function buildRedirects(routes: string[]): string;
export function parseRedirects(body: string): RedirectRule[];
export function matchRedirect(reqPath: string, rules: RedirectRule[]): string | null;
export function realRoutes(rules: RedirectRule[]): string[];
export function toServeRel(p: string): string | null;
export function resolveServePath(
  reqPath: string,
  rules: RedirectRule[],
  fileExists: (relPath: string) => boolean,
): string | null;
