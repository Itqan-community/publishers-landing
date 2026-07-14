import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Fustat, Kufam } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
});

const fustat = Fustat({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-fustat",
});

/** Kufam: all static weights (400–900) + italic for qiraat tenant */
const kufam = Kufam({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-kufam",
});

export const metadata: Metadata = {
  title: "Multi-Tenant Landing Platform",
  description: "Dynamic multi-tenant landing pages for publishers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexSansArabic.variable} ${fustat.variable} ${kufam.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
