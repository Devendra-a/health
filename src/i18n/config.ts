export const locales = ["en", "es", "fr", "de", "pt", "it", "nl", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const rtlLocales: Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  nl: "Nederlands",
  ar: "العربية",
};

// ISO 3166-1 alpha-2 country codes for the flag-icons library.
export const localeFlagCodes: Record<Locale, string> = {
  en: "us",
  es: "es",
  fr: "fr",
  de: "de",
  pt: "pt",
  it: "it",
  nl: "nl",
  ar: "sa",
};

export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_PT",
  it: "it_IT",
  nl: "nl_NL",
  ar: "ar_SA",
};

export function hasLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}
