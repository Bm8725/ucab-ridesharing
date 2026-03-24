import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Această linie „păcălește” eroarea din Next.js 16
  turbopack: {}, 
  
  trailingSlash: true,
  // restul setărilor tale...
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts", 
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
