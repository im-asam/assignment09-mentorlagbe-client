import type { MetadataRoute } from "next";

const BASE_URL = "https://assignment09-mentorlagbe-client.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/tuitions", "/pricing", "/sign-in", "/sign-up"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
