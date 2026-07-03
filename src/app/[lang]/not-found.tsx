import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 bg-cream">
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red">
          404
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-charcoal">
          Page not found
        </h1>
        <p className="mt-4 text-stone-600 leading-relaxed">
          The page you are looking for doesn&apos;t exist or may have moved.
          Head back to the protein intake calculator to work out your daily
          protein target.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 rounded-full bg-red text-white font-semibold px-7 py-3.5 shadow-lg shadow-red/30 hover:bg-red-deep hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          Go to the calculator
        </Link>
      </section>
    </main>
  );
}
