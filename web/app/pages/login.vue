<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <v-card
      class="w-full max-w-md p-8 rounded-3xl shadow-xl bg-white"
      elevation="0"
    >
      <div class="flex flex-col items-center mb-8">
        <div class="p-4 bg-purple-100 rounded-full mb-4">
          <v-icon size="48" color="purple-darken-3">mdi-account-lock</v-icon>
        </div>
        <h1 class="text-3xl font-extrabold text-purple-900 tracking-tight">
          Crunch
        </h1>
        <p class="text-purple-400 text-sm mt-1 font-medium">
          Acesse sua conta para continuar
        </p>
      </div>

      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email"
          placeholder="seu@email.com"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          color="purple-darken-3"
          class="mb-4"
          :disabled="loading"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="
            showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
          "
          @click:append-inner="showPassword = !showPassword"
          variant="outlined"
          color="purple-darken-3"
          class="mb-6"
          :disabled="loading"
        ></v-text-field>

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
          class="text-none font-bold tracking-wide"
          rounded="xl"
          elevation="2"
          :loading="loading"
          :disabled="loading"
        >
          Entrar
        </v-btn>
      </v-form>

      <div class="mt-6 flex flex-col items-center gap-3">
        <NuxtLink
          to="/forgot-password"
          class="text-sm text-purple-700 hover:text-purple-900 font-bold transition-colors duration-200"
        >
          Esqueceu sua senha?
        </NuxtLink>

        <div class="text-sm text-gray-500">
          Não tem uma conta?
          <NuxtLink
            to="/register"
            class="text-purple-700 hover:text-purple-900 font-bold transition-colors duration-200 ml-1"
          >
            Registre-se
          </NuxtLink>
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
const { login, session, setSessionFromToken, access_token } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  const { data, error } = await login({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error;
    loading.value = false;
    return;
  }

  if (data?.access_token) {
    setSessionFromToken(data.access_token);
  } else {
    await session();
  }

  loading.value = false;

  if (!access_token.value) {
    errorMessage.value = "Nao foi possivel iniciar a sessao.";
    return;
  }

  await router.push((route.query.redirect as string) || "/");
};
</script>

<style>
/* Corrige o fundo de preenchimento automático (autofill) do navegador para manter o fundo branco */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #333 !important;
}
</style>
