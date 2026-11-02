import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Private areas are kept out of search with a noindex header (see next.config.ts), not by
// blocking them here: a crawler that is not allowed to fetch a page can never see its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
