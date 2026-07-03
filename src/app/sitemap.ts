import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/config";
import { topicSlugs } from "@/lib/topics";

const SITE_URL = "https://www.proteinintakecalculators.online";

// Build the hreflang alternates map for a given path suffix (""  for the
// homepage, or "/slug" for a topic page), including an x-default fallback.
function languagesFor(suffix: string) {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}/${locale}${suffix}`])
    ),
    "x-default": `${SITE_URL}/${defaultLocale}${suffix}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homepages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages: languagesFor("") },
  }));

  const topicPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    topicSlugs.map((slug) => ({
      url: `${SITE_URL}/${locale}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: locale === defaultLocale ? 0.8 : 0.7,
      alternates: { languages: languagesFor(`/${slug}`) },
    }))
  );

  return [...homepages, ...topicPages];
}
