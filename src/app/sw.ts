import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "@serwist/sw"; 
import type { PrecacheEntry } from "@serwist/precaching";

// Dacă eroarea persistă cu importul de sus, încearcă:
// import { Serwist } from "@serwist/core"; 
// DAR asigură-te că ai ambele pachete instalate.

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
