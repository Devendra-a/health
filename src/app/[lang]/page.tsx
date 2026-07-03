import { notFound } from "next/navigation";
import Script from "next/script";
import ProteinCalculator from "@/components/ProteinCalculator";
import FaqAccordion from "@/components/FaqAccordion";
import { ShieldIcon, LockIcon, ClipboardIcon, ArrowIcon } from "@/components/icons";
import { getDictionary } from "@/i18n/get-dictionary";
import { hasLocale } from "@/i18n/config";
import {
  ACTIVITY_DICT_KEY,
  GOAL_DICT_KEY,
  calculateBMR,
  calculateProteinRange,
  calculateTDEE,
  type Activity,
  type Gender,
  type Goal,
} from "@/lib/protein";
import type { Dictionary } from "@/i18n/get-dictionary";

const SITE_URL = "https://www.proteinintakecalculators.online";

type Persona = {
  name: string;
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  activity: Activity;
  goal: Goal;
};

const PERSONAS: Persona[] = [
  { name: "james_35", gender: "male", age: 35, weightKg: 85, heightCm: 178, activity: "active", goal: "gain" },
  { name: "maria_28", gender: "female", age: 28, weightKg: 60, heightCm: 165, activity: "moderate", goal: "lose" },
  { name: "priya_42", gender: "female", age: 42, weightKg: 70, heightCm: 160, activity: "light", goal: "maintain" },
  { name: "robert_60", gender: "male", age: 60, weightKg: 90, heightCm: 175, activity: "sedentary", goal: "maintain" },
  { name: "arjun_19", gender: "male", age: 19, weightKg: 65, heightCm: 172, activity: "athlete", goal: "gain" },
  { name: "sofia_50", gender: "female", age: 50, weightKg: 68, heightCm: 163, activity: "moderate", goal: "lose" },
];

const TRUST_ICONS = [ShieldIcon, LockIcon, ClipboardIcon];

function buildPersonaResult(p: Persona) {
  const { low, high } = calculateProteinRange(p.weightKg, p.activity, p.goal);
  const bmr = calculateBMR(p.gender, p.weightKg, p.heightCm, p.age);
  const tdee = calculateTDEE(bmr, p.activity);
  return { low, high, tdee };
}

function label(dict: Dictionary["calculator"], key: string): string {
  return dict[key as keyof Dictionary["calculator"]] as string;
}

const TABLE_HEAD =
  "px-4 py-3 font-semibold text-charcoal text-xs uppercase tracking-wide";
const TABLE_WRAP =
  "mt-6 overflow-hidden rounded-2xl border border-stone-200 shadow-sm";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main className="flex-1 bg-cream">
      {/* Loaded here rather than in the layout so ads are only served on the
          content page — never on 404s or other contentless screens, which
          violates AdSense policy ("ads on screens without publisher-content"). */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1300842618865363"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-charcoal via-charcoal to-charcoal-soft text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -end-24 size-96 rounded-full bg-red/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -start-16 size-96 rounded-full bg-red/10 blur-3xl"
        />
        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-red/25 px-4 py-1.5 text-xs font-medium tracking-wide uppercase text-red-light">
            {dict.trust.heading}
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight">
            {dict.hero.title}
          </h1>
          <p className="mt-5 text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            {dict.hero.subtitle}
          </p>
          <a
            href="#calculator"
            className="group inline-flex items-center gap-2 mt-9 rounded-full bg-red text-white font-semibold px-7 py-3.5 shadow-lg shadow-black/30 hover:bg-red-deep hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {dict.hero.cta}
            <ArrowIcon className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </a>
        </div>
      </section>

      <section
        id="calculator"
        className="max-w-5xl mx-auto px-6 pt-12 sm:pt-16 pb-20"
      >
        <ProteinCalculator dict={dict.calculator} />
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center">
            {dict.trust.heading}
          </h2>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {dict.trust.points.map((point, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <div
                  key={point.title}
                  className="rounded-2xl border border-stone-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-center size-11 rounded-xl bg-red-soft text-red">
                    <Icon className="size-6" />
                  </div>
                  <p className="mt-4 font-semibold text-charcoal">
                    {point.title}
                  </p>
                  <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-cream-dark px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.howTo.heading}
          </h2>
          <ol className="mt-8 space-y-8">
            {dict.howTo.steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-5">
                {i < dict.howTo.steps.length - 1 && (
                  <span className="absolute start-4 top-9 bottom-[-2rem] w-px bg-red/25" />
                )}
                <span className="relative flex-none size-8 rounded-full bg-red text-white font-semibold flex items-center justify-center shadow-md shadow-red/30">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-charcoal">
                    {step.title}
                  </p>
                  <p className="text-stone-600 mt-0.5">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.howMuch.heading}
          </h2>
          <p className="mt-4 text-stone-600">{dict.howMuch.intro}</p>
          <div className={TABLE_WRAP}>
            <table className="w-full text-start text-sm">
              <thead className="bg-red-soft/50">
                <tr>
                  <th className={TABLE_HEAD}>{dict.howMuch.tableGoal}</th>
                  <th className={TABLE_HEAD}>{dict.howMuch.tableRange}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {dict.howMuch.rows.map((row) => (
                  <tr key={row.goal} className="even:bg-cream-dark/60">
                    <td className="px-4 py-3 text-stone-700">{row.goal}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {row.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-cream-dark px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.byWeight.heading}
          </h2>
          <p className="mt-4 text-stone-600">{dict.byWeight.intro}</p>
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
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.weightLoss.heading}
          </h2>
          <p className="mt-4 text-stone-600 leading-relaxed">
            {dict.weightLoss.body}
          </p>
        </div>
      </section>

      <section className="bg-cream-dark px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.muscleGain.heading}
          </h2>
          <p className="mt-4 text-stone-600 leading-relaxed">
            {dict.muscleGain.body}
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.women.heading}
          </h2>
          <p className="mt-4 text-stone-600 leading-relaxed">
            {dict.women.intro}
          </p>
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
        </div>
      </section>

      <section className="bg-cream-dark px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.glp1.heading}
          </h2>
          <p className="mt-4 text-stone-600 leading-relaxed">
            {dict.glp1.intro}
          </p>
          <ul className="mt-4 space-y-2 text-stone-600 list-disc list-inside">
            {dict.glp1.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-stone-500">{dict.glp1.disclaimer}</p>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center">
            {dict.examples.heading}
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERSONAS.map((p) => {
              const { low, high, tdee } = buildPersonaResult(p);
              const activityLabel = label(
                dict.calculator,
                ACTIVITY_DICT_KEY[p.activity]
              );
              const goalLabel = label(dict.calculator, GOAL_DICT_KEY[p.goal]);
              return (
                <div
                  key={p.name}
                  className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-none flex items-center justify-center size-10 rounded-full bg-red-soft text-red font-bold uppercase">
                      {p.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-mono text-sm text-charcoal">
                        {p.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {p.age} {dict.examples.yearsShort} · {p.weightKg} kg ·{" "}
                        {p.heightCm} cm
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 mt-3">
                    {activityLabel} · {goalLabel}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-charcoal">
                    {low}–{high} g
                  </p>
                  <p className="text-xs text-stone-500">
                    {dict.examples.proteinPerDay}
                  </p>
                  <p className="text-sm text-stone-600 mt-2">
                    ~{tdee.toLocaleString()} {dict.examples.maintenanceCalories}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.foods.heading}
          </h2>
          <p className="mt-4 text-stone-600">{dict.foods.intro}</p>
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
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {dict.dietTypes.heading}
          </h2>
          <p className="mt-4 text-stone-600 leading-relaxed">
            {dict.dietTypes.intro}
          </p>
        </div>
      </section>

      <section id="faq" className="bg-white px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center">
            {dict.faq.heading}
          </h2>
          <FaqAccordion items={dict.faq.items} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: dict.faq.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: dict.nav.brand,
            url: `${SITE_URL}/${lang}`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: dict.meta.description,
          }),
        }}
      />
    </main>
  );
}
