// Type declarations for the pure, unit-tested helpers in prerender.mjs so the
// CLI tests typecheck without enabling allowJs. (The async `prerender` export
// is intentionally omitted: it touches the filesystem and the SSR bundle, so it
// is exercised by the build/E2E path, not the fast unit suite.)
export function injectAppHtml(template: string, appHtml: string): string;
export function injectHeadTags(template: string, headTags: string): string;
export function outFileForRoute(route: string): string;
