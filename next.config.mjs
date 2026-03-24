import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",  // <--- Verifică dacă ai "src/" în cale!
  swDest: "public/sw.js",  // Fișierul generat care va merge la utilizator
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist({
  // Configurația ta existentă (trailingSlash, etc.)
});
