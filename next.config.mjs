import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",         // Sursa codului de fundal (Service Worker)
  swDest: "public/sw.js",     // Fișierul generat automat
  disable: process.env.NODE_ENV === "development", // Dezactivează în dev ca să nu te încurce la teste
});

export default withSerwist(nextConfig);
