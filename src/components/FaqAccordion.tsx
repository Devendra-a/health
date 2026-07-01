"use client";

import { useState } from "react";
import { ChevronDownIcon } from "./icons";

type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-8 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white overflow-hidden">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start hover:bg-cream-dark transition-colors"
            >
              <span className="font-semibold text-charcoal">{item.q}</span>
              <ChevronDownIcon
                className={`size-5 flex-none text-red transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-stone-600">{item.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
