import type { Metadata } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { THEME_SCRIPT } from "@/lib/useTheme";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { Grain } from "@/components/chrome/Grain";
import { InlineScript } from "@/components/chrome/InlineScript";
import "./globals.css";

/* Two voices, one system (§4.4). Both self-hosted by next/font, so no
   request ever leaves for Google and there is no swap-in flash. */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
  adjustFontFallback: true,
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Orderly · The conversational ordering layer for restaurants",
  description:
    "Guests scan a QR code and order by speaking naturally. Orders land in the point of sale you already run.",
  metadataBase: new URL("https://orderly.sh"),
  openGraph: {
    title: "Orderly · The conversational ordering layer for restaurants",
    description:
      "Guests scan a QR code and order by speaking naturally. Orders land in the point of sale you already run.",
    siteName: "Orderly",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-phase="act1"
      className={`${hanken.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs during HTML parsing, before first paint. This is what makes
            the theme swap flash-free on reload (§4.3). */}
        <InlineScript html={THEME_SCRIPT} />
      </head>
      <body>
        {children}
        <Grain />
        <SmoothScroll />
      </body>
    </html>
  );
}
