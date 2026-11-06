import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Said Dellioua — DS EXPORT | Accompagnement export & import",
  description:
    "Your Gateway to International Trade. Said Dellioua (DS EXPORT) accompagne les entreprises algériennes à l’export et à l’import : assistant IA, outils, réseau d’affaires et consultations.",
  keywords: ["export Algérie", "import Algérie", "commerce extérieur", "DS EXPORT", "Said Dellioua", "Incoterms", "التصدير", "الاستيراد"],
  openGraph: {
    title: "Said Dellioua — DS EXPORT",
    description: "From Algeria to the World. Guidance. Connections. Opportunities.",
    images: ["/brand/logo-stacked-dark.svg"],
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#0b1f3a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
