import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export default function Footer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["footer"];
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        <p className="text-xs text-stone-500">{dict.disclaimer}</p>
        <p className="mt-3 text-xs">
          <Link
            href={`/${lang}/privacy`}
            className="text-stone-500 underline underline-offset-2 hover:text-charcoal"
          >
            {dict.privacyLink}
          </Link>
        </p>
        <p className="mt-3 text-xs text-stone-400">
          {dict.copyright.replace("{year}", String(year))}
        </p>
      </div>
    </footer>
  );
}
