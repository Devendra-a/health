import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import LanguageDropdown from "./LanguageDropdown";

export default function Header({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["nav"];
}) {
  return (
    <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href={`/${lang}`}
          className="font-bold text-lg text-charcoal tracking-tight"
        >
          {dict.brand}
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a href="#calculator" className="hover:text-red transition-colors">
            {dict.calculator}
          </a>
          <a href="#how-it-works" className="hover:text-red transition-colors">
            {dict.howItWorks}
          </a>
          <a href="#faq" className="hover:text-red transition-colors">
            {dict.faq}
          </a>
        </nav>
        <LanguageDropdown lang={lang} label={dict.languageLabel} />
      </div>
    </header>
  );
}
