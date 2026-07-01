import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n/get-dictionary";
import { hasLocale, defaultLocale } from "@/i18n/config";

export const alt = "Protein Intake Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : defaultLocale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1c1b19 0%, #2a2823 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#e0292f",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {dict.nav.brand}
        </div>
        <div
          style={{
            marginTop: 24,
            color: "#fbf8f3",
            fontSize: 64,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {dict.hero.title}
        </div>
        <div
          style={{
            marginTop: 28,
            color: "rgba(251,248,243,0.7)",
            fontSize: 28,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {dict.meta.description.slice(0, 110)}
        </div>
      </div>
    ),
    { ...size }
  );
}
