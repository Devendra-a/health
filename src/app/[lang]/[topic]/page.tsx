import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import ProteinCalculator from "@/components/ProteinCalculator";
import FaqAccordion from "@/components/FaqAccordion";
import { ArrowIcon } from "@/components/icons";
import { getDictionary } from "@/i18n/get-dictionary";
import { locales, defaultLocale, hasLocale, ogLocales } from "@/i18n/config";
import { topics, slugForTopic, topicForSlug, type TopicKey } from "@/lib/topics";
import type { Dictionary } from "@/i18n/get-dictionary";

const SITE_URL = "https://www.proteinintakecalculators.online";

// Only generated slugs exist; anything else 404s.
export const dynamicParams = false;

// Per-topic: which dictionary heading/lead to use for the H1 and meta, plus the
// FAQ items (by index — stable across every locale's dictionary) most relevant
// to the topic, and sibling topics to cross-link. All display text comes from
// the already-translated dictionaries, so no per-topic copy needs translating.
const TOPICS: Record<
  TopicKey,
  {
    heading: (d: Dictionary) => string;
    lead: (d: Dictionary) => string;
    faqIndices: number[];
    related: TopicKey[];
  }
> = {
  "protein-for-weight-loss": {
    heading: (d) => d.weightLoss.heading,
    lead: (d) => d.weightLoss.body,
    faqIndices: [2, 4, 8],
    related: ["protein-for-muscle-gain", "protein-on-ozempic-wegovy", "high-protein-foods"],
  },
  "protein-for-muscle-gain": {
    heading: (d) => d.muscleGain.heading,
    lead: (d) => d.muscleGain.body,
    faqIndices: [1, 8, 9],
    related: ["protein-for-weight-loss", "high-protein-foods", "protein-by-body-weight"],
  },
  "protein-for-women": {
    heading: (d) => d.women.heading,
    lead: (d) => d.women.intro,
    faqIndices: [0, 7, 4],
    related: ["protein-for-weight-loss", "protein-on-ozempic-wegovy", "protein-by-body-weight"],
  },
  "protein-on-ozempic-wegovy": {
    heading: (d) => d.glp1.heading,
    lead: (d) => d.glp1.intro,
    faqIndices: [3, 2, 8],
    related: ["protein-for-weight-loss", "high-protein-foods", "protein-for-women"],
  },
  "high-protein-foods": {
    heading: (d) => d.foods.heading,
    lead: (d) => d.foods.intro,
    faqIndices: [8, 4, 0],
    related: ["vegetarian-vegan-protein", "protein-for-muscle-gain", "protein-for-weight-loss"],
  },
  "protein-by-body-weight": {
    heading: (d) => d.byWeight.heading,
    lead: (d) => d.byWeight.intro,
    faqIndices: [0, 9, 8],
    related: ["protein-for-muscle-gain", "protein-for-weight-loss", "high-protein-foods"],
  },
  "vegetarian-vegan-protein": {
    heading: (d) => d.dietTypes.heading,
    lead: (d) => d.dietTypes.intro,
    faqIndices: [5, 6, 4],
    related: ["high-protein-foods", "protein-for-muscle-gain", "protein-for-weight-loss"],
  },
};

const TABLE_HEAD =
  "px-4 py-3 font-semibold text-charcoal text-xs uppercase tracking-wide";
const TABLE_WRAP =
  "mt-6 overflow-hidden rounded-2xl border border-stone-200 shadow-sm";

// Meta descriptions want to stay short; trim the (translated) lead at a word
// boundary rather than mid-word so it reads cleanly in any language.
function clamp(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

// hreflang alternates for a topic: every locale points at its own localized
// slug, plus an en-IN entry so Google serves the English page to India and an
// x-default fallback.
function topicLanguages(topic: TopicKey): Record<string, string> {
  return {
    ...Object.fromEntries(
      locales.map((l) => [l, `/${l}/${slugForTopic(l, topic)}`])
    ),
    "en-IN": `/en/${slugForTopic("en", topic)}`,
    "x-default": `/${defaultLocale}/${slugForTopic(defaultLocale, topic)}`,
  };
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    topics.map((topic) => ({ lang, topic: slugForTopic(lang, topic) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; topic: string }>;
}): Promise<Metadata> {
  const { lang, topic: slug } = await params;
  if (!hasLocale(lang)) notFound();
  const topic = topicForSlug(lang, slug);
  if (!topic) notFound();

  const dict = await getDictionary(lang);
  const cfg = TOPICS[topic];
  const title = `${cfg.heading(dict)} | ${dict.nav.brand}`;
  const description = clamp(cfg.lead(dict));
  const otherLocales = locales.filter((l) => l !== lang).map((l) => ogLocales[l]);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages: topicLanguages(topic),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/${slug}`,
      siteName: dict.nav.brand,
      type: "article",
      locale: ogLocales[lang],
      alternateLocale: otherLocales,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function TopicBody({ topic, dict }: { topic: TopicKey; dict: Dictionary }) {
  switch (topic) {
    case "protein-for-weight-loss":
      return (
        <p className="text-stone-600 leading-relaxed">{dict.weightLoss.body}</p>
      );
    case "protein-for-muscle-gain":
      return (
        <p className="text-stone-600 leading-relaxed">{dict.muscleGain.body}</p>
      );
    case "vegetarian-vegan-protein":
      return (
        <p className="text-stone-600 leading-relaxed">{dict.dietTypes.intro}</p>
      );
    case "protein-for-women":
      return (
        <>
          <p className="text-stone-600 leading-relaxed">{dict.women.intro}</p>
          <div className={TABLE_WRAP}>
            <table className="w-full text-start text-sm">
              <thead className="bg-red-soft/50">
                <tr>
                  <th className={TABLE_HEAD}>{dict.women.tableStage}</th>
                  <th className={TABLE_HEAD}>{dict.women.tableRange}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {dict.women.rows.map((row) => (
                  <tr key={row.stage} className="even:bg-cream-dark/60">
                    <td className="px-4 py-3 text-stone-700">{row.stage}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {row.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-500">{dict.women.note}</p>
        </>
      );
    case "protein-on-ozempic-wegovy":
      return (
        <>
          <p className="text-stone-600 leading-relaxed">{dict.glp1.intro}</p>
          <ul className="mt-4 space-y-2 text-stone-600 list-disc list-inside">
            {dict.glp1.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-stone-500">{dict.glp1.disclaimer}</p>
        </>
      );
    case "high-protein-foods":
      return (
        <>
          <p className="text-stone-600 leading-relaxed">{dict.foods.intro}</p>
          <div className={TABLE_WRAP}>
            <table className="w-full text-start text-sm">
              <thead className="bg-red-soft/50">
                <tr>
                  <th className={TABLE_HEAD}>{dict.foods.tableFood}</th>
                  <th className={TABLE_HEAD}>{dict.foods.tableProtein}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {dict.foods.rows.map((row) => (
                  <tr key={row.food} className="even:bg-cream-dark/60">
                    <td className="px-4 py-3 text-stone-700">{row.food}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {row.protein}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    case "protein-by-body-weight":
      return (
        <>
          <p className="text-stone-600 leading-relaxed">{dict.byWeight.intro}</p>
          <div className={TABLE_WRAP}>
            <table className="w-full text-start text-sm">
              <thead className="bg-red-soft/50">
                <tr>
                  <th className={TABLE_HEAD}>{dict.byWeight.tableWeight}</th>
                  <th className={TABLE_HEAD}>{dict.byWeight.tableGeneral}</th>
                  <th className={TABLE_HEAD}>{dict.byWeight.tableActive}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {dict.byWeight.rows.map((row) => (
                  <tr key={row.weight} className="even:bg-cream-dark/60">
                    <td className="px-4 py-3 text-stone-700">{row.weight}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {row.general}
                    </td>
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {row.active}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-500">{dict.byWeight.note}</p>
        </>
      );
  }
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ lang: string; topic: string }>;
}) {
  const { lang, topic: slug } = await params;
  if (!hasLocale(lang)) notFound();
  const topic = topicForSlug(lang, slug);
  if (!topic) notFound();

  const dict = await getDictionary(lang);
  const cfg = TOPICS[topic];
  const heading = cfg.heading(dict);
  const lead = clamp(cfg.lead(dict), 180);
  const faqItems = cfg.faqIndices
    .map((i) => dict.faq.items[i])
    .filter(Boolean);

  return (
    <main className="flex-1 bg-cream">
      {/* AdSense loads on content pages only (same policy note as the homepage). */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1300842618865363"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <section className="bg-gradient-to-br from-charcoal via-charcoal to-charcoal-soft text-white">
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
          <nav className="text-xs text-white/60" aria-label="Breadcrumb">
            <Link href={`/${lang}`} className="hover:text-white">
              {dict.nav.brand}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{heading}</span>
          </nav>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
            {heading}
          </h1>
          <p className="mt-5 text-white/80 text-lg leading-relaxed">{lead}</p>
          <a
            href="#calculator"
            className="group inline-flex items-center gap-2 mt-8 rounded-full bg-red text-white font-semibold px-7 py-3.5 shadow-lg shadow-black/30 hover:bg-red-deep hover:-translate-y-0.5 transition-all"
          >
            {dict.hero.cta}
            <ArrowIcon className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </a>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <TopicBody topic={topic} dict={dict} />
        </div>
      </section>

      <section
        id="calculator"
        className="max-w-5xl mx-auto px-6 pt-4 sm:pt-8 pb-16"
      >
        <ProteinCalculator dict={dict.calculator} />
      </section>

      {faqItems.length > 0 && (
        <section className="bg-white px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center">
              {dict.faq.heading}
            </h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      )}

      <section className="bg-cream-dark px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal">
            {dict.nav.brand}
          </h2>
          <ul className="mt-5 grid sm:grid-cols-2 gap-3">
            {cfg.related.map((relatedTopic) => (
              <li key={relatedTopic}>
                <Link
                  href={`/${lang}/${slugForTopic(lang, relatedTopic)}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span className="font-medium text-charcoal">
                    {TOPICS[relatedTopic].heading(dict)}
                  </span>
                  <ArrowIcon className="size-4 flex-none text-red rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: dict.nav.brand,
                item: `${SITE_URL}/${lang}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: heading,
                item: `${SITE_URL}/${lang}/${slug}`,
              },
            ],
          }),
        }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      )}
    </main>
  );
}
