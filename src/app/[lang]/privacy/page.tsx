import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { locales, defaultLocale, hasLocale, ogLocales } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

const SITE_URL = "https://www.proteinintakecalculators.online";

// The privacy slug is /privacy in every locale (like Arabic topic slugs, this
// keeps the URL ASCII and identical across languages).
function privacyLanguages(): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l) => [l, `/${l}/privacy`])),
    "en-IN": "/en/privacy",
    "x-default": `/${defaultLocale}/privacy`,
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

  const title = `${dict.privacy.title} | ${dict.nav.brand}`;
  const description = dict.privacy.metaDescription;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: privacyLanguages(),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/privacy`,
      siteName: dict.nav.brand,
      type: "article",
      locale: ogLocales[lang],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Google's opt-out and disclosure pages localize themselves, so the hrefs are
// shared across locales; only the link labels come from the dictionary.
const ADS_LINKS: { key: keyof Dictionary["privacy"]["advertising"]["links"]; href: string }[] = [
  { key: "adsSettings", href: "https://www.google.com/settings/ads" },
  { key: "partnerSites", href: "https://policies.google.com/technologies/partner-sites" },
  { key: "aboutAds", href: "https://www.aboutads.info/choices/" },
];

function Section({
  section,
  children,
}: {
  section: { heading: string; paragraphs: string[] };
  children?: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-charcoal">{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-stone-600 leading-relaxed">
          {paragraph}
        </p>
      ))}
      {children}
    </section>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const privacy = dict.privacy;

  return (
    <main className="flex-1 bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-charcoal">{privacy.title}</h1>
        <p className="mt-2 text-sm text-stone-400">{privacy.updated}</p>
        <p className="mt-6 text-stone-600 leading-relaxed">{privacy.intro}</p>

        <Section section={privacy.dataCollection} />
        <Section section={privacy.advertising}>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            {ADS_LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 underline underline-offset-2 hover:text-charcoal"
                >
                  {privacy.advertising.links[key]}
                </a>
              </li>
            ))}
          </ul>
        </Section>
        <Section section={privacy.cookies} />
        <Section section={privacy.hosting} />
        <Section section={privacy.children} />
        <Section section={privacy.changes} />
        <Section section={privacy.contact} />
      </div>
    </main>
  );
}
