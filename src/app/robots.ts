import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/payment/", "/api/"],
    },
    sitemap: "https://assignment09-mentorlagbe-client.vercel.app/sitemap.xml",
  };
}
