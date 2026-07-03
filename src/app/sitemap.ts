import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/config";
import { topics, slugForTopic, type TopicKey } from "@/lib/topics";

const SITE_URL = "https://www.proteinintakecalculators.online";

// hreflang alternates for a path: every locale points at its own URL, plus an
// en-IN entry (English page targeted at India) and an x-default fallback.
// `suffixFor` maps a locale to its path suffix ("" for homepages, "/slug" for
// topics), so localized slugs stay consistent across languages.
function languagesFor(suffixFor: (locale: (typeof locales)[number]) => string) {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}/${locale}${suffixFor(locale)}`])
    ),
    "en-IN": `${SITE_URL}/en${suffixFor("en")}`,
    "x-default": `${SITE_URL}/${defaultLocale}${suffixFor(defaultLocale)}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homepages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages: languagesFor(() => "") },
  }));

  const topicPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    topics.map((topic: TopicKey) => ({
      url: `${SITE_URL}/${locale}/${slugForTopic(locale, topic)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: locale === defaultLocale ? 0.8 : 0.7,
      alternates: {
        languages: languagesFor((l) => `/${slugForTopic(l, topic)}`),
      },
    }))
  );

  return [...homepages, ...topicPages];
}
