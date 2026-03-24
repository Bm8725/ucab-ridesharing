import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Această linie forțează dezactivarea Turbopack în Next.js 16
  turbopack: {}, 
  // Forțăm configurarea Webpack pentru Serwist
  webpack: (config) => {
    return config;
  },
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
