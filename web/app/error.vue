<template>
  <div class="auth-page flex items-center justify-center min-h-screen p-4">
    <v-card class="auth-card w-full max-w-md" elevation="0">
      <div class="auth-card-inner text-center">
        <div class="auth-icon-circle mb-4 mx-auto">
          <v-icon size="40" :color="isDark ? 'accent-soft' : 'purple-darken-3'">
            {{ isNotFound ? "mdi-map-marker-question-outline" : "mdi-alert-circle-outline" }}
          </v-icon>
        </div>

        <h1 class="auth-title">{{ title }}</h1>
        <p class="auth-subtitle mt-2 mb-6">{{ description }}</p>

        <div class="d-flex flex-column ga-3">
          <v-btn
            block
            color="purple-darken-3"
            size="large"
            class="auth-btn text-none font-bold"
            rounded="xl"
            elevation="2"
            @click="goHome"
          >
            Voltar para o início
          </v-btn>

          <v-btn
            block
            variant="text"
            color="grey-darken-1"
            class="text-none"
            @click="reset"
          >
            Tentar novamente
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const { isDark } = useThemeMode();

const isNotFound = computed(() => props.error?.statusCode === 404);

const title = computed(() =>
  isNotFound.value ? "Página não encontrada" : "Algo deu errado",
);

const description = computed(() =>
  isNotFound.value
    ? "O endereço que você tentou acessar não existe ou foi removido."
    : "Não foi possível carregar esta página. Tente novamente em instantes.",
);

const goHome = () => {
  clearError({ redirect: "/" });
};

const reset = () => {
  clearError();
};
</script>

<style scoped>
.auth-page {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(150deg, #fdf3ec 0%, #fbe8da 55%, #f7e2d3 100%);
}

:global(.app-theme-dark) .auth-page {
  background: var(--app-color-background) !important;
  background-image: none !important;
}

.auth-card {
  border-radius: 28px !important;
  border: 1px solid rgba(229, 231, 235, 0.9) !important;
  box-shadow: 0 8px 40px rgba(181, 71, 42, 0.12), 0 2px 8px rgba(17, 24, 39, 0.06) !important;
  background: #ffffff;
  overflow: hidden;
}

:global(.app-theme-dark) .auth-card {
  background: var(--app-color-surface) !important;
  border-color: var(--app-color-border) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3) !important;
}

.auth-card-inner {
  padding: 36px 32px 32px;
}

.auth-icon-circle {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fdf3ec 0%, #f7e2d3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.app-theme-dark) .auth-icon-circle {
  background: rgba(240, 151, 90, 0.16) !important;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #7c2d12;
  margin: 0;
}

:global(.app-theme-dark) .auth-title {
  color: var(--app-color-text);
}

.auth-subtitle {
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

:global(.app-theme-dark) .auth-subtitle {
  color: var(--app-color-text-muted);
}

.auth-btn {
  height: 54px !important;
  font-size: 1.05rem !important;
  letter-spacing: 0.01em !important;
}

:global(.app-theme-dark) .auth-btn.bg-purple-darken-3 {
  box-shadow: 0 4px 16px rgba(240, 151, 90, 0.3) !important;
}
</style>
