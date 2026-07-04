import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { locales, defaultLocale, hasLocale, ogLocales } from "@/i18n/config";

const SITE_URL = "https://www.proteinintakecalculators.online";

// Like /privacy, the about slug stays /about in every locale to keep the URL
// ASCII and identical across languages.
function aboutLanguages(): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l) => [l, `/${l}/about`])),
    "en-IN": "/en/about",
    "x-default": `/${defaultLocale}/about`,
  };
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const title = `${dict.about.title} | ${dict.nav.brand}`;
  const description = dict.about.metaDescription;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${lang}/about`,
      languages: aboutLanguages(),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/about`,
      siteName: dict.nav.brand,
      type: "article",
      locale: ogLocales[lang],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function Section({ section }: { section: { heading: string; paragraphs: string[] } }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-charcoal">{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-stone-600 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const about = dict.about;

  return (
    <main className="flex-1 bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-charcoal">{about.title}</h1>
        <p className="mt-6 text-stone-600 leading-relaxed">{about.intro}</p>

        <Section section={about.mission} />
        <Section section={about.methodology} />
        <Section section={about.funding} />
        <Section section={about.medical} />
        <Section section={about.contact} />
      </div>
    </main>
  );
}
