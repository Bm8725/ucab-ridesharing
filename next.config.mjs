import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // FORȚĂM DEZACTIVAREA TURBOPACK
  experimental: {
    turbo: {
      rules: {},
    },
  },
  // Această linie este critică pentru a opri eroarea de Webpack config
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
