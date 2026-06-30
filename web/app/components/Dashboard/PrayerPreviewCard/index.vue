<template>
  <div v-if="hasChurch" class="mb-6">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center gap-2">
        <Heart size="16" :color="isDark ? '#818cf8' : '#4f46e5'" />
        <span class="preview-title">Pedidos de Oração</span>
      </div>
      <v-btn
        variant="text"
        size="x-small"
        color="indigo-darken-2"
        class="text-none"
        to="/prayer"
      >
        Ver todos
      </v-btn>
    </div>

    <div v-if="loading">
      <v-skeleton-loader type="list-item-two-line" class="mb-2 rounded-xl" />
      <v-skeleton-loader type="list-item-two-line" class="rounded-xl" />
    </div>

    <div v-else-if="items.length === 0" class="prayer-empty">
      <Heart size="18" class="prayer-empty-icon" />
      <p class="prayer-empty-text mb-0">Nenhum pedido ainda</p>
    </div>

    <div v-else>
      <v-card
        v-for="item in items"
        :key="item.id"
        class="prayer-preview-card rounded-xl pa-3 mb-2 elevation-0 cursor-pointer"
        to="/prayer"
      >
        <div class="d-flex align-center gap-3">
          <v-avatar size="32" :color="isDark ? 'rgba(129,140,248,0.14)' : '#eef2ff'">
            <Heart size="14" :color="isDark ? '#818cf8' : '#4f46e5'" />
          </v-avatar>
          <div class="flex-1 min-w-0">
            <p class="prayer-item-title mb-0 text-truncate">{{ item.title }}</p>
            <p class="prayer-item-meta mb-0">{{ item.authorName }}</p>
          </div>
          <v-chip
            v-if="item.isAnswered"
            size="x-small"
            color="success"
            variant="tonal"
            class="text-none"
          >
            Respondido
          </v-chip>
        </div>
      </v-card>

      <v-btn
        variant="tonal"
        color="indigo-darken-2"
        size="small"
        block
        class="text-none mt-1 rounded-xl"
        to="/prayer"
      >
        <Heart size="14" class="mr-1" /> Ir para orações
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Heart } from "lucide-vue-next";
import { useAuth } from "../../../../composables/useAuth";
import { usePrayerRequests } from "../../../../composables/usePrayerRequests";
import type { PrayerRequest } from "../../../../composables/usePrayerRequests";

const { user } = useAuth();
const { isDark } = useThemeMode();
const { getPrayerRequests } = usePrayerRequests();

const hasChurch = ref(user.value?.hasChurch === true);
const items = ref<PrayerRequest[]>([]);
const loading = ref(false);

onMounted(async () => {
  if (!hasChurch.value) return;
  loading.value = true;
  const { data } = await getPrayerRequests(1);
  items.value = (data?.items ?? []).slice(0, 3);
  loading.value = false;
});
</script>

<style scoped>
.preview-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--app-color-text);
}

.prayer-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--app-color-surface);
  border: 1px solid var(--app-color-border);
}

.prayer-empty-icon {
  color: var(--app-color-text-muted);
}

.prayer-empty-text {
  font-size: 0.84rem;
  color: var(--app-color-text-muted);
}

.prayer-preview-card {
  background: var(--app-color-surface) !important;
  border: 1px solid var(--app-color-border);
}

.prayer-item-title {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--app-color-text);
}

.prayer-item-meta {
  font-size: 0.74rem;
  color: var(--app-color-text-muted);
}

.flex-1 { flex: 1 1 0; }
.min-w-0 { min-width: 0; }
</style>
