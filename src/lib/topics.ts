import type { Locale } from "@/i18n/config";

// Canonical topic keys. The English key doubles as the English URL slug, so
// existing /en/... URLs stay unchanged.
export const topics = [
  "protein-for-weight-loss",
  "protein-for-muscle-gain",
  "protein-for-women",
  "protein-on-ozempic-wegovy",
  "high-protein-foods",
  "protein-by-body-weight",
  "vegetarian-vegan-protein",
] as const;

export type TopicKey = (typeof topics)[number];

// URL slug for each topic in each locale, so every language ranks on its own
// keyword. Latin-script slugs are ASCII-folded (no accents/umlauts) to keep
// URLs clean. Arabic reuses the English slug to avoid percent-encoded URLs.
export const topicSlugs: Record<Locale, Record<TopicKey, string>> = {
  en: {
    "protein-for-weight-loss": "protein-for-weight-loss",
    "protein-for-muscle-gain": "protein-for-muscle-gain",
    "protein-for-women": "protein-for-women",
    "protein-on-ozempic-wegovy": "protein-on-ozempic-wegovy",
    "high-protein-foods": "high-protein-foods",
    "protein-by-body-weight": "protein-by-body-weight",
    "vegetarian-vegan-protein": "vegetarian-vegan-protein",
  },
  es: {
    "protein-for-weight-loss": "proteina-para-perder-peso",
    "protein-for-muscle-gain": "proteina-para-ganar-musculo",
    "protein-for-women": "proteina-para-mujeres",
    "protein-on-ozempic-wegovy": "proteina-con-ozempic-wegovy",
    "high-protein-foods": "alimentos-ricos-en-proteinas",
    "protein-by-body-weight": "proteina-por-peso-corporal",
    "vegetarian-vegan-protein": "proteina-vegetariana-vegana",
  },
  fr: {
    "protein-for-weight-loss": "proteines-pour-perdre-du-poids",
    "protein-for-muscle-gain": "proteines-pour-prendre-du-muscle",
    "protein-for-women": "proteines-pour-les-femmes",
    "protein-on-ozempic-wegovy": "proteines-avec-ozempic-wegovy",
    "high-protein-foods": "aliments-riches-en-proteines",
    "protein-by-body-weight": "proteines-par-poids-corporel",
    "vegetarian-vegan-protein": "proteines-vegetariennes-veganes",
  },
  de: {
    "protein-for-weight-loss": "protein-zum-abnehmen",
    "protein-for-muscle-gain": "protein-zum-muskelaufbau",
    "protein-for-women": "protein-fuer-frauen",
    "protein-on-ozempic-wegovy": "protein-bei-ozempic-wegovy",
    "high-protein-foods": "proteinreiche-lebensmittel",
    "protein-by-body-weight": "protein-nach-koerpergewicht",
    "vegetarian-vegan-protein": "vegetarisches-veganes-protein",
  },
  pt: {
    "protein-for-weight-loss": "proteina-para-perder-peso",
    "protein-for-muscle-gain": "proteina-para-ganhar-massa-muscular",
    "protein-for-women": "proteina-para-mulheres",
    "protein-on-ozempic-wegovy": "proteina-com-ozempic-wegovy",
    "high-protein-foods": "alimentos-ricos-em-proteina",
    "protein-by-body-weight": "proteina-por-peso-corporal",
    "vegetarian-vegan-protein": "proteina-vegetariana-vegana",
  },
  it: {
    "protein-for-weight-loss": "proteine-per-dimagrire",
    "protein-for-muscle-gain": "proteine-per-la-massa-muscolare",
    "protein-for-women": "proteine-per-le-donne",
    "protein-on-ozempic-wegovy": "proteine-con-ozempic-wegovy",
    "high-protein-foods": "alimenti-ricchi-di-proteine",
    "protein-by-body-weight": "proteine-per-peso-corporeo",
    "vegetarian-vegan-protein": "proteine-vegetariane-vegane",
  },
  nl: {
    "protein-for-weight-loss": "eiwit-voor-gewichtsverlies",
    "protein-for-muscle-gain": "eiwit-voor-spieropbouw",
    "protein-for-women": "eiwit-voor-vrouwen",
    "protein-on-ozempic-wegovy": "eiwit-bij-ozempic-wegovy",
    "high-protein-foods": "eiwitrijke-voeding",
    "protein-by-body-weight": "eiwit-per-lichaamsgewicht",
    "vegetarian-vegan-protein": "vegetarisch-veganistisch-eiwit",
  },
  ar: {
    "protein-for-weight-loss": "protein-for-weight-loss",
    "protein-for-muscle-gain": "protein-for-muscle-gain",
    "protein-for-women": "protein-for-women",
    "protein-on-ozempic-wegovy": "protein-on-ozempic-wegovy",
    "high-protein-foods": "high-protein-foods",
    "protein-by-body-weight": "protein-by-body-weight",
    "vegetarian-vegan-protein": "vegetarian-vegan-protein",
  },
};

export function slugForTopic(locale: Locale, topic: TopicKey): string {
  return topicSlugs[locale][topic];
}

// Reverse lookup: which topic (if any) does this locale's URL slug map to?
export function topicForSlug(
  locale: Locale,
  slug: string
): TopicKey | undefined {
  const map = topicSlugs[locale];
  return topics.find((topic) => map[topic] === slug);
}
