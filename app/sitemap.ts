import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://quiz.shvnk.in/", lastModified: new Date() }];
}
