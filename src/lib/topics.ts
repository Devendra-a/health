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
  "protein-for-men",
  "protein-for-seniors",
  "protein-for-teenagers",
  "protein-during-pregnancy",
  "best-time-to-eat-protein",
  "protein-shakes-per-day",
  "protein-for-diabetics",
  "protein-deficiency-signs",
] as const;

export type TopicKey = (typeof topics)[number];

// Topics whose page copy lives in the dictionaries' `topicPages.items` section
// (rendered by a generic paragraphs + bullets layout) rather than in a
// hand-built section of the topic page.
export const contentTopics = [
  "protein-for-men",
  "protein-for-seniors",
  "protein-for-teenagers",
  "protein-during-pregnancy",
  "best-time-to-eat-protein",
  "protein-shakes-per-day",
  "protein-for-diabetics",
  "protein-deficiency-signs",
] as const;

export type ContentTopicKey = (typeof contentTopics)[number];

export function isContentTopic(topic: TopicKey): topic is ContentTopicKey {
  return (contentTopics as readonly string[]).includes(topic);
}

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
    "protein-for-men": "protein-for-men",
    "protein-for-seniors": "protein-for-seniors",
    "protein-for-teenagers": "protein-for-teenagers",
    "protein-during-pregnancy": "protein-during-pregnancy",
    "best-time-to-eat-protein": "best-time-to-eat-protein",
    "protein-shakes-per-day": "protein-shakes-per-day",
    "protein-for-diabetics": "protein-for-diabetics",
    "protein-deficiency-signs": "protein-deficiency-signs",
  },
  es: {
    "protein-for-weight-loss": "proteina-para-perder-peso",
    "protein-for-muscle-gain": "proteina-para-ganar-musculo",
    "protein-for-women": "proteina-para-mujeres",
    "protein-on-ozempic-wegovy": "proteina-con-ozempic-wegovy",
    "high-protein-foods": "alimentos-ricos-en-proteinas",
    "protein-by-body-weight": "proteina-por-peso-corporal",
    "vegetarian-vegan-protein": "proteina-vegetariana-vegana",
    "protein-for-men": "proteina-para-hombres",
    "protein-for-seniors": "proteina-para-adultos-mayores",
    "protein-for-teenagers": "proteina-para-adolescentes",
    "protein-during-pregnancy": "proteina-en-el-embarazo",
    "best-time-to-eat-protein": "mejor-momento-para-tomar-proteina",
    "protein-shakes-per-day": "batidos-de-proteina-al-dia",
    "protein-for-diabetics": "proteina-para-diabeticos",
    "protein-deficiency-signs": "sintomas-de-falta-de-proteina",
  },
  fr: {
    "protein-for-weight-loss": "proteines-pour-perdre-du-poids",
    "protein-for-muscle-gain": "proteines-pour-prendre-du-muscle",
    "protein-for-women": "proteines-pour-les-femmes",
    "protein-on-ozempic-wegovy": "proteines-avec-ozempic-wegovy",
    "high-protein-foods": "aliments-riches-en-proteines",
    "protein-by-body-weight": "proteines-par-poids-corporel",
    "vegetarian-vegan-protein": "proteines-vegetariennes-veganes",
    "protein-for-men": "proteines-pour-les-hommes",
    "protein-for-seniors": "proteines-pour-les-seniors",
    "protein-for-teenagers": "proteines-pour-les-adolescents",
    "protein-during-pregnancy": "proteines-pendant-la-grossesse",
    "best-time-to-eat-protein": "meilleur-moment-pour-manger-des-proteines",
    "protein-shakes-per-day": "shakes-proteines-par-jour",
    "protein-for-diabetics": "proteines-pour-les-diabetiques",
    "protein-deficiency-signs": "symptomes-carence-en-proteines",
  },
  de: {
    "protein-for-weight-loss": "protein-zum-abnehmen",
    "protein-for-muscle-gain": "protein-zum-muskelaufbau",
    "protein-for-women": "protein-fuer-frauen",
    "protein-on-ozempic-wegovy": "protein-bei-ozempic-wegovy",
    "high-protein-foods": "proteinreiche-lebensmittel",
    "protein-by-body-weight": "protein-nach-koerpergewicht",
    "vegetarian-vegan-protein": "vegetarisches-veganes-protein",
    "protein-for-men": "protein-fuer-maenner",
    "protein-for-seniors": "protein-fuer-senioren",
    "protein-for-teenagers": "protein-fuer-jugendliche",
    "protein-during-pregnancy": "protein-in-der-schwangerschaft",
    "best-time-to-eat-protein": "beste-zeit-fuer-protein",
    "protein-shakes-per-day": "proteinshakes-pro-tag",
    "protein-for-diabetics": "protein-fuer-diabetiker",
    "protein-deficiency-signs": "anzeichen-von-proteinmangel",
  },
  pt: {
    "protein-for-weight-loss": "proteina-para-perder-peso",
    "protein-for-muscle-gain": "proteina-para-ganhar-massa-muscular",
    "protein-for-women": "proteina-para-mulheres",
    "protein-on-ozempic-wegovy": "proteina-com-ozempic-wegovy",
    "high-protein-foods": "alimentos-ricos-em-proteina",
    "protein-by-body-weight": "proteina-por-peso-corporal",
    "vegetarian-vegan-protein": "proteina-vegetariana-vegana",
    "protein-for-men": "proteina-para-homens",
    "protein-for-seniors": "proteina-para-idosos",
    "protein-for-teenagers": "proteina-para-adolescentes",
    "protein-during-pregnancy": "proteina-na-gravidez",
    "best-time-to-eat-protein": "melhor-horario-para-comer-proteina",
    "protein-shakes-per-day": "shakes-de-proteina-por-dia",
    "protein-for-diabetics": "proteina-para-diabeticos",
    "protein-deficiency-signs": "sinais-de-falta-de-proteina",
  },
  it: {
    "protein-for-weight-loss": "proteine-per-dimagrire",
    "protein-for-muscle-gain": "proteine-per-la-massa-muscolare",
    "protein-for-women": "proteine-per-le-donne",
    "protein-on-ozempic-wegovy": "proteine-con-ozempic-wegovy",
    "high-protein-foods": "alimenti-ricchi-di-proteine",
    "protein-by-body-weight": "proteine-per-peso-corporeo",
    "vegetarian-vegan-protein": "proteine-vegetariane-vegane",
    "protein-for-men": "proteine-per-gli-uomini",
    "protein-for-seniors": "proteine-per-anziani",
    "protein-for-teenagers": "proteine-per-adolescenti",
    "protein-during-pregnancy": "proteine-in-gravidanza",
    "best-time-to-eat-protein": "momento-migliore-per-assumere-proteine",
    "protein-shakes-per-day": "frullati-proteici-al-giorno",
    "protein-for-diabetics": "proteine-per-diabetici",
    "protein-deficiency-signs": "sintomi-di-carenza-di-proteine",
  },
  nl: {
    "protein-for-weight-loss": "eiwit-voor-gewichtsverlies",
    "protein-for-muscle-gain": "eiwit-voor-spieropbouw",
    "protein-for-women": "eiwit-voor-vrouwen",
    "protein-on-ozempic-wegovy": "eiwit-bij-ozempic-wegovy",
    "high-protein-foods": "eiwitrijke-voeding",
    "protein-by-body-weight": "eiwit-per-lichaamsgewicht",
    "vegetarian-vegan-protein": "vegetarisch-veganistisch-eiwit",
    "protein-for-men": "eiwit-voor-mannen",
    "protein-for-seniors": "eiwit-voor-ouderen",
    "protein-for-teenagers": "eiwit-voor-tieners",
    "protein-during-pregnancy": "eiwit-tijdens-zwangerschap",
    "best-time-to-eat-protein": "beste-moment-voor-eiwitten",
    "protein-shakes-per-day": "eiwitshakes-per-dag",
    "protein-for-diabetics": "eiwit-voor-diabetici",
    "protein-deficiency-signs": "symptomen-eiwittekort",
  },
  ar: {
    "protein-for-weight-loss": "protein-for-weight-loss",
    "protein-for-muscle-gain": "protein-for-muscle-gain",
    "protein-for-women": "protein-for-women",
    "protein-on-ozempic-wegovy": "protein-on-ozempic-wegovy",
    "high-protein-foods": "high-protein-foods",
    "protein-by-body-weight": "protein-by-body-weight",
    "vegetarian-vegan-protein": "vegetarian-vegan-protein",
    "protein-for-men": "protein-for-men",
    "protein-for-seniors": "protein-for-seniors",
    "protein-for-teenagers": "protein-for-teenagers",
    "protein-during-pregnancy": "protein-during-pregnancy",
    "best-time-to-eat-protein": "best-time-to-eat-protein",
    "protein-shakes-per-day": "protein-shakes-per-day",
    "protein-for-diabetics": "protein-for-diabetics",
    "protein-deficiency-signs": "protein-deficiency-signs",
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
