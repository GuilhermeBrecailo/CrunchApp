<template>
  <div class="auth-page flex items-center justify-center min-h-screen p-4">
    <v-card class="auth-card w-full max-w-md" elevation="0">
      <div class="auth-card-inner">
        <div class="flex flex-col items-center mb-8 text-center">
          <div class="auth-icon-circle mb-4">
            <v-icon size="40" :color="isDark ? 'accent-soft' : 'purple-darken-3'">mdi-lock-reset</v-icon>
          </div>
          <h1 class="auth-title">Recuperar senha</h1>
          <p class="auth-subtitle mt-2">
            Fale com a liderança da sua igreja para redefinir seu acesso.
          </p>
        </div>

        <v-alert type="info" variant="tonal" density="comfortable" class="mb-6">
          A recuperação automática de senha ainda não está disponível neste ambiente.
        </v-alert>

        <v-btn
          to="/login"
          block
          color="purple-darken-3"
          size="x-large"
          class="auth-btn text-none font-bold"
          rounded="xl"
          elevation="2"
        >
          Voltar para login
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "not-app-bottom",
});

const { isDark } = useThemeMode();
</script>

<style scoped>
.auth-page {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(150deg, #eef2ff 0%, #f5f3ff 60%, #fdf4ff 100%);
}

:global(.app-theme-dark) .auth-page {
  background: var(--app-color-background) !important;
  background-image: none !important;
}

.auth-card {
  border-radius: 28px !important;
  border: 1px solid rgba(229, 231, 235, 0.9) !important;
  box-shadow: 0 8px 40px rgba(88, 28, 135, 0.1), 0 2px 8px rgba(17, 24, 39, 0.06) !important;
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
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.app-theme-dark) .auth-icon-circle {
  background: rgba(129, 140, 248, 0.15) !important;
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #3730a3;
  margin: 0 0 4px;
}

:global(.app-theme-dark) .auth-title {
  color: var(--app-color-text);
}

.auth-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: #7c3aed;
  margin: 0;
}

:global(.app-theme-dark) .auth-subtitle {
  color: var(--app-color-accent-soft);
}

.auth-btn {
  height: 52px !important;
  font-size: 1rem !important;
  letter-spacing: 0.01em !important;
}

:global(.app-theme-dark) .auth-btn.bg-purple-darken-3 {
  background: #6366f1 !important;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35) !important;
}
</style>
