import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "@serwist/sw";
import type { PrecacheEntry } from "@serwist/precaching"; // <--- S-a mutat aici

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
