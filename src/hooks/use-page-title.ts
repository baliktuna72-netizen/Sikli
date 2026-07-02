import { useEffect } from "react";
import constants from "@/constants/constants.json";
import { isSsrPass, collectSsrMeta } from "@/lib/ssr-meta";
interface UsePageTitleOptions {
  title?: string;
  description?: string;
  appendSiteName?: boolean;
}

// Pure: the same title/description the effect applies to the live document.
// Shared so the build-time SSR pass emits identical values into the prerendered
// <head> (effects do not run during renderToString).
function computePageMeta(options: UsePageTitleOptions) {
  const { title, description, appendSiteName = true } = options;
  let pageTitle = title || constants.site.name;
  if (title && appendSiteName) {
    pageTitle = `${title} | ${constants.site.name}`;
  }
  return { pageTitle, description: description || constants.site.description };
}

export const usePageTitle = (options: UsePageTitleOptions = {}) => {
  // During the build-time prerender pass there is no document and effects never
  // run, so feed the collector synchronously while this component renders.
  // entry-server.tsx reads it back to write real per-route <head> tags.
  if (constants && isSsrPass()) {
    const meta = computePageMeta(options);
    collectSsrMeta({ title: meta.pageTitle, description: meta.description });
  }

  useEffect(() => {
    if (!constants) return;

    // Single source of truth shared with the SSR pass so prerendered <head> and
    // the live document.title can never drift.
    const { pageTitle, description: metaDescription } = computePageMeta(options);
    document.title = pageTitle;

    // Set meta description
    let descriptionElement = document.querySelector('meta[name="description"]');

    if (!descriptionElement) {
      descriptionElement = document.createElement("meta");
      descriptionElement.setAttribute("name", "description");
      document.head.appendChild(descriptionElement);
    }

    descriptionElement.setAttribute("content", metaDescription);

    // Set favicon and apple-touch-icon if provided
    if (constants.site.favicon) {
      const faviconElement = document.querySelector(
        "#favicon",
      ) as HTMLLinkElement;
      if (faviconElement) {
        faviconElement.href = constants.site.favicon;
      }
      const appleTouchIcon = document.querySelector(
        "#apple-touch-icon",
      ) as HTMLLinkElement;
      if (appleTouchIcon) {
        appleTouchIcon.href = constants.site.favicon;
      }
    }
  }, [options]);

  return {
    siteName: constants?.site?.name || "",
    siteDescription: constants?.site?.description || "",
  };
};
