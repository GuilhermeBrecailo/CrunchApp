import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  if (!("serviceWorker" in navigator)) return;

  const register = () => {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .catch(() => {
        // PWA registration is best-effort, especially outside HTTPS/localhost.
      });
  };

  if (document.readyState === "complete") {
    register();
    return;
  }

  window.addEventListener("load", register, { once: true });
});
