"use client";

import { useState } from "react";
import Link from "next/link";
import {
  locales,
  localeNames,
  localeFlagCodes,
  type Locale,
} from "@/i18n/config";
import { ChevronDownIcon } from "./icons";

function Flag({ code }: { code: string }) {
  return (
    <span
      className={`fi fi-${code} rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]`}
    />
  );
}

export default function LanguageDropdown({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={label}
        className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-charcoal hover:bg-cream-dark transition-colors"
      >
        <Flag code={localeFlagCodes[lang]} />
        <span>{localeNames[lang]}</span>
        <ChevronDownIcon
          className={`size-4 text-stone-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute end-0 z-20 mt-2 w-48 max-h-72 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg py-1">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  l === lang
                    ? "bg-red-soft text-red font-medium"
                    : "text-charcoal hover:bg-cream-dark"
                }`}
              >
                <Flag code={localeFlagCodes[l]} />
                <span>{localeNames[l]}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
