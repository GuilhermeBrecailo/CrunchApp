<template>
  <div class="auth-page flex items-center justify-center min-h-screen p-4">
    <v-card class="auth-card w-full max-w-md my-8" elevation="0">
      <div class="auth-card-inner">
        <div class="flex flex-col items-center mb-8">
          <div class="auth-icon-circle mb-4">
            <v-icon size="40" :color="isDark ? 'accent-soft' : 'purple-darken-3'">
              mdi-account-plus-outline
            </v-icon>
          </div>
          <h1 class="auth-title">Cadastrar igreja</h1>
          <p class="auth-subtitle text-center">
            Crie sua conta de pastor titular para iniciar sua igreja.
          </p>
        </div>

        <v-form autocomplete="off" @submit.prevent="handleRegister">
          <v-text-field
            v-model="form.name"
            label="Nome completo"
            autocomplete="off"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            density="comfortable"
            :bg-color="isDark ? 'transparent' : 'white'"
            color="purple-darken-3"
            class="auth-input mb-4"
            hide-details="auto"
            :disabled="loading"
          />

          <v-text-field
            v-model="form.email"
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
            v-model="form.phone"
            label="Telefone"
            type="tel"
            autocomplete="off"
            prepend-inner-icon="mdi-phone-outline"
            variant="outlined"
            density="comfortable"
            :bg-color="isDark ? 'transparent' : 'white'"
            color="purple-darken-3"
            class="auth-input mb-4"
            hide-details="auto"
            :disabled="loading"
          />

          <v-text-field
            v-model="form.password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="off"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            variant="outlined"
            density="comfortable"
            :bg-color="isDark ? 'transparent' : 'white'"
            color="purple-darken-3"
            class="auth-input mb-4"
            hide-details="auto"
            :disabled="loading"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-text-field
            v-model="form.confirmPassword"
            label="Confirmar senha"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="off"
            prepend-inner-icon="mdi-lock-check-outline"
            variant="outlined"
            density="comfortable"
            :bg-color="isDark ? 'transparent' : 'white'"
            color="purple-darken-3"
            class="auth-input mb-8"
            hide-details="auto"
            :disabled="loading"
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
            Cadastrar
          </v-btn>
        </v-form>

        <div class="mt-6 text-center">
          <p class="auth-hint mb-3">
            Se você é membro, peça para sua igreja criar seu acesso.
          </p>
          <span class="auth-meta">Já tem uma conta? </span>
          <NuxtLink to="/login" class="auth-link font-bold">Faça login</NuxtLink>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth";

definePageMeta({
  layout: "not-app-bottom",
});

const router = useRouter();
const { registerPastor } = useAuth();
const { isDark } = useThemeMode();

const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const handleRegister = async () => {
  errorMessage.value = "";

  const normalizedName = form.name.trim();
  const normalizedEmail = form.email.trim().toLowerCase();
  const normalizedPhone = form.phone.trim();

  if (!normalizedName || !normalizedEmail || !normalizedPhone || !form.password) {
    errorMessage.value = "Preencha todos os campos obrigatórios.";
    return;
  }

  if (form.password.length < 6) {
    errorMessage.value = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = "As senhas não coincidem.";
    return;
  }

  loading.value = true;

  const { error } = await registerPastor({
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    role: "PASTOR",
    password: form.password,
  });

  loading.value = false;

  if (error) {
    errorMessage.value = error;
    return;
  }

  await router.push("/login");
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
}

:global(.app-theme-dark) .auth-meta {
  color: var(--app-color-text-muted);
}

.auth-hint {
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
}

:global(.app-theme-dark) .auth-hint {
  color: var(--app-color-text-muted);
}
</style>
