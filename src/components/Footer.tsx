import type { Dictionary } from "@/i18n/get-dictionary";

export default function Footer({ dict }: { dict: Dictionary["footer"] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        <p className="text-xs text-stone-500">{dict.disclaimer}</p>
        <p className="mt-3 text-xs text-stone-400">
          {dict.copyright.replace("{year}", String(year))}
        </p>
      </div>
    </footer>
  );
}
