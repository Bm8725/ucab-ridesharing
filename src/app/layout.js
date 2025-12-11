// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./header/page";
import Footer from "./footer/page";
import CookiesBanner from "./cookies/cookies";
import OracleChat from "./chat/chat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://ucab.ro"),

  title: {
    default: "UCAB.ro – Ride-sharing local. Livrare locala si transport urban la comisioane mici de pana la 10%",
    template: "%s | UCAB",
  },

  description:
    "UCAB – platformă de ride-sharing local, modernă, sigură și cu comision minim. Construită pentru comunitate și afaceri locale.",

  keywords: [
    "ucab.ro",
    "ride sharing romania",
    "transport local",
    "ride-sharing",
    "livrari locale ",
    "aplicatie transport",
    "uber local, bolt local",
  ],

  authors: [{ name: "UCAB Team" }],
  creator: "UCAB",
  publisher: "UCAB.ro",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },

  themeColor: "#000000",

  // ⭐ FAVICON
  icons: {
    icon: [
      { rel: "icon", url: "/ucabro.svg", type: "image/svg+xml" },
      { rel: "icon", url: "/ucabro-32.png", sizes: "32x32" },
      { rel: "icon", url: "/ucabro-16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },

  // ⭐ OPEN GRAPH (Facebook, WhatsApp, etc.)
  openGraph: {
    title: "UCAB – Ride-sharing local",
    description:
      "Transport modern, sigur și cu comision minim. Platformă pentru comunitatea locală.",
    url: "https://ucab.ro",
    siteName: "UCAB",
    images: [
      {
        url: "/share-ucab.png",
        width: 1200,
        height: 630,
        alt: "UCAB Ride-sharing",
      },
    ],
    type: "website",
    locale: "ro_RO",
  },

  // ⭐ TWITTER
  twitter: {
    card: "summary_large_image",
    title: "UCAB – Ride-sharing local",
    description: "Transport local modern, sigur și accesibil.",
    images: ["/share-ucab.png"],
    creator: "@ucab",
  },

  // ⭐ PWA (optional)
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        {/* Preload SVG pentru favicon instant */}
        <link rel="preload" as="image" href="/ucabro.svg" />
        
        {/* JSON-LD — SEO ULTRA (Google Knowledge Graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "UCAB",
              url: "https://ucab.ro",
              logo: "https://ucab.ro/ucabro.png",
              description:
                "UCAB – ride-sharing local modern și accesibil, construit pentru comunitate.",
              areaServed: "Romania",
              sameAs: [
                "https://facebook.com/ucab",
                "https://instagram.com/ucab",
              ],
            }),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1">{children}</main>
  
        <Footer />
        <CookiesBanner />
       <OracleChat />
      </body>
    </html>
  );
}
