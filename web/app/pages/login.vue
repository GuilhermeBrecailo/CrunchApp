<template>
  <div class="auth-page flex items-center justify-center min-h-screen p-4">
    <v-card class="auth-card w-full max-w-md" elevation="0">
      <div class="auth-card-inner">
        <div class="flex flex-col items-center mb-8">
          <div class="auth-icon-circle mb-4">
            <v-icon size="40" color="purple-darken-3">mdi-account-lock</v-icon>
          </div>
          <h1 class="auth-title">AppChurch</h1>
          <p class="auth-subtitle">Acesse sua conta para continuar</p>
        </div>

        <v-form autocomplete="off" @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            autocomplete="off"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            :bg-color="isDark ? 'transparent' : 'white'"
            color="purple-darken-3"
            class="auth-input mb-4"
            hide-details="auto"
            :disabled="loading"
          />

          <v-text-field
            v-model="password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="off"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            variant="outlined"
            density="comfortable"
            :bg-color="isDark ? 'transparent' : 'white'"
            color="purple-darken-3"
            class="auth-input mb-6"
            hide-details="auto"
            :disabled="loading"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ errorMessage }}
          </v-alert>

          <v-btn
            type="submit"
            block
            color="purple-darken-3"
            size="x-large"
            class="auth-btn text-none font-bold"
            rounded="xl"
            elevation="2"
            :loading="loading"
            :disabled="loading"
          >
            Entrar
          </v-btn>
        </v-form>

        <div class="mt-6 flex flex-col items-center gap-3">
          <NuxtLink to="/forgot-password" class="auth-link font-bold">
            Esqueceu sua senha?
          </NuxtLink>

          <p class="auth-meta">
            Pastor titular?
            <NuxtLink to="/register" class="auth-link font-bold ml-1">
              Cadastre sua igreja
            </NuxtLink>
          </p>

          <p class="auth-hint">
            Se você é membro, peça para sua igreja criar seu acesso.
          </p>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../../composables/useAuth";

definePageMeta({
  layout: "not-app-bottom",
});

const route = useRoute();
const router = useRouter();
const { login, session, setSessionFromToken, fetchMe, access_token } = useAuth();
const { isDark } = useThemeMode();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  const normalizedEmail = email.value.trim();

  if (!normalizedEmail || !password.value) {
    errorMessage.value = "Informe e-mail e senha para entrar.";
    return;
  }

  loading.value = true;

  try {
    const { data, error } = await login({
      email: normalizedEmail,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error;
      return;
    }

    if (data?.access_token) {
      setSessionFromToken(data.access_token);
      await fetchMe();
    } else {
      await session();
    }

    if (!access_token.value) {
      errorMessage.value = "Não foi possível iniciar a sessão.";
      return;
    }

    const redirect =
      typeof route.query.redirect === "string" &&
      route.query.redirect.startsWith("/") &&
      !route.query.redirect.startsWith("//")
        ? route.query.redirect
        : "/";

    await router.push(redirect);
  } catch {
    errorMessage.value = "Não foi possível iniciar a sessão.";
  } finally {
    loading.value = false;
  }
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
  padding: 40px 32px 32px;
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
  font-size: 2.125rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #7c2d12;
  margin: 0 0 6px;
}

:global(.app-theme-dark) .auth-title {
  color: var(--app-color-text);
}

.auth-subtitle {
  font-size: 1rem;
  font-weight: 500;
  color: var(--app-color-accent);
  margin: 0;
}

:global(.app-theme-dark) .auth-subtitle {
  color: var(--app-color-accent-soft);
}

.auth-input :deep(.v-field) {
  border-radius: 14px;
}

.auth-input :deep(.v-field__input) {
  min-height: 52px;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 1rem;
}

.auth-input :deep(.v-label) {
  font-size: 0.95rem;
}

:global(.app-theme-dark) .auth-input :deep(input:-webkit-autofill),
:global(.app-theme-dark) .auth-input :deep(input:-webkit-autofill:hover),
:global(.app-theme-dark) .auth-input :deep(input:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 1000px var(--app-color-surface-soft) inset !important;
  -webkit-text-fill-color: var(--app-color-text) !important;
  caret-color: var(--app-color-text);
}

.auth-btn {
  height: 54px !important;
  font-size: 1.05rem !important;
  letter-spacing: 0.01em !important;
}

:global(.app-theme-dark) .auth-btn.bg-purple-darken-3 {
  box-shadow: 0 4px 16px rgba(240, 151, 90, 0.3) !important;
}

.auth-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--app-color-accent);
  text-decoration: none;
  transition: color 0.15s ease;
}

.auth-link:hover {
  color: #7c2d12;
}

:global(.app-theme-dark) .auth-link {
  color: var(--app-color-accent);
}

:global(.app-theme-dark) .auth-link:hover {
  color: var(--app-color-accent-soft);
}

.auth-meta {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

:global(.app-theme-dark) .auth-meta {
  color: var(--app-color-text-muted);
}

.auth-hint {
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

:global(.app-theme-dark) .auth-hint {
  color: var(--app-color-text-muted);
}
</style>
