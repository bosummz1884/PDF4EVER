// public/service-worker.js

self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
});

self.addEventListener("fetch", (event) => {
  // Default: just let the request go through
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    console.log("Service Worker skipping waiting state.");
  }
});
