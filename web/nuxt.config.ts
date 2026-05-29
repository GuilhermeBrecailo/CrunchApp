// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "vuetify-nuxt-module"],
  runtimeConfig: {
    public: {
      URL_BACKEND: process.env.NUXT_PUBLIC_URL_BACKEND || "http://localhost:8000",
    },
  },
});
