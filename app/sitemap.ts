import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://quizx-5z2.pages.dev/", lastModified: new Date() }];
}
