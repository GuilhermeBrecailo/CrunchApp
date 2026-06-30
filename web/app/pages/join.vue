<template>
  <div class="join-page pa-4">
    <div class="join-card-wrap">
      <div class="join-icon-wrap mb-5">
        <Church size="32" :color="isDark ? '#818cf8' : '#4f46e5'" />
      </div>

      <h1 class="join-title mb-1">Entrar em uma igreja</h1>
      <p class="join-subtitle mb-6">Digite o código de convite que você recebeu</p>

      <v-text-field
        v-model="code"
        label="Código de convite"
        variant="outlined"
        color="indigo-darken-2"
        density="comfortable"
        class="mb-4"
        placeholder="Ex: A1B2C3D4"
        hide-details="auto"
        :error-messages="error ? [error] : []"
        @keyup.enter="submit"
      />

      <v-alert v-if="success" type="success" variant="tonal" density="compact" class="mb-4">
        Você entrou em <strong>{{ churchName }}</strong>! Redirecionando…
      </v-alert>

      <v-btn
        color="indigo-darken-2"
        block
        size="large"
        class="text-none font-weight-bold rounded-xl"
        :loading="loading"
        :disabled="!code.trim() || loading"
        @click="submit"
      >
        Entrar na igreja
      </v-btn>

      <v-btn
        variant="text"
        block
        class="text-none mt-3"
        color="grey-darken-1"
        to="/"
      >
        Voltar ao início
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Church } from "lucide-vue-next";
import { useChurchInvite } from "../../composables/useChurchInvite";
import { useAuth } from "../../composables/useAuth";

const router = useRouter();
const route = useRoute();
const { isDark } = useThemeMode();
const { joinByCode } = useChurchInvite();
const { user, access_token, fetchMe } = useAuth();

const code = ref((route.query.code as string) ?? "");
const loading = ref(false);
const error = ref("");
const success = ref(false);
const churchName = ref("");

onMounted(() => {
  if (!access_token.value) {
    const redirect = encodeURIComponent(route.fullPath);
    router.replace(`/login?redirect=${redirect}`);
  }
  if (user.value?.hasChurch) {
    router.replace("/");
  }
});

async function submit() {
  if (!code.value.trim()) return;
  error.value = "";
  loading.value = true;

  const { data, error: err } = await joinByCode(code.value.trim().toUpperCase());
  loading.value = false;

  if (err) {
    error.value = err;
    return;
  }

  churchName.value = data?.churchName ?? "sua nova igreja";
  success.value = true;
  await fetchMe();
  setTimeout(() => router.replace("/"), 2000);
}
</script>

<style scoped>
.join-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--app-color-background);
}

.join-card-wrap {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.join-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: var(--app-color-surface-muted, #eef2ff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.join-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--app-color-text);
  text-align: center;
  margin: 0;
}

.join-subtitle {
  font-size: 0.9rem;
  color: var(--app-color-text-muted);
  text-align: center;
  margin: 0;
}

.join-card-wrap .v-text-field,
.join-card-wrap .v-btn,
.join-card-wrap .v-alert {
  width: 100%;
}
</style>
