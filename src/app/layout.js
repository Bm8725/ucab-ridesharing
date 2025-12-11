// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./header/page";
import Footer from "./footer/page";
import CookiesBanner from "./cookies/cookies";
import OracleChat from "./chat/chat";
import SEO from "./seo/seo";

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
    default:
      "UCAB.ro – Ridesharing local. Livrare locală și transport urban la comisioane mici",
    template: "%s | UCAB",
  },

  description:
    "UCAB – ride-sharing local modern, sigur și cu comision minim. Construit pentru comunitate și afaceri locale.",

  keywords: [
    "ucab.ro",
    "ride sharing romania",
    "transport local",
    "ride-sharing",
    "livrari locale",
    "aplicatie transport",
  ],

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

  icons: {
    icon: [
      { rel: "icon", url: "/ucabro.svg", type: "image/svg+xml" },
      { rel: "icon", url: "/ucabapp.png", sizes: "32x32" },
      { rel: "icon", url: "/ucabapp.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },

openGraph: {
  title: "UCAB – Ride-sharing local",
  description:
    "Transport modern, sigur și cu comision minim. Platformă pentru comunitatea locală.",
  url: "https://ucab.ro",
  siteName: "UCAB",
  images: [
    {
      url: "https://ucab.ro/ucabapp.png",   // ← URL ABSOLUT
      width: 1200,
      height: 630,
      alt: "UCAB Ride-sharing",
    },
  ],
  type: "website",
  locale: "ro_RO",
},


  twitter: {
    card: "summary_large_image",
    title: "UCAB – Ride-sharing local",
    description: "Transport local modern, sigur și accesibil.",
    images: ["/share-ucab.png"],
    creator: "@ucab",
  },

  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preload" as="image" href="/ucabro.svg" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* SEO global */}
        <SEO />

        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
        <CookiesBanner />
        <OracleChat />
      </body>
    </html>
  );
}
