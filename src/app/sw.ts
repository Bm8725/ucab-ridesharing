// @ts-nocheck
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "@serwist/sw"; 

// Această parte este critică pentru ca Serwist să găsească fișierele de precache
declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (any | string)[] | undefined;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST, // Next.js va injecta aici lista de fișiere
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
