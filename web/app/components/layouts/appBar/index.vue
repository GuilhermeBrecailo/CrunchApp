<template>
  <v-app-bar app class="appbar" elevation="1">
    <div class="d-flex align-center">
      <v-btn icon variant="text">
        <v-avatar color="#E6E6FA" size="44">
          <span class="avatar-text">GB</span>
        </v-avatar>
      </v-btn>

      <div class="ml-3 d-flex flex-column justify-center">
        <span class="greeting-text">Olá, {{ firstName }}</span>
        <div class="d-flex align-center mt-n1">
          <Church size="16" class="church-icon mr-1" />
          <span class="church-text">{{ churchName }}</span>
        </div>
      </div>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <v-tooltip location="bottom" :text="themeToggleLabel">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            variant="text"
            class="theme-toggle-btn mr-1"
            :aria-label="themeToggleLabel"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" size="22" />
            <Moon v-else size="22" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-menu location="bottom end" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            variant="text"
            :color="notificationColor"
            :loading="loading"
            aria-label="Notificações"
          >
            <v-badge
              :content="unreadCount"
              :model-value="hasUnreadNotifications"
              color="error"
              max="9"
            >
              <BellRing v-if="isEnabled" size="24" />
              <BellOff v-else-if="status === 'denied' || status === 'unsupported'" size="24" />
              <Bell v-else size="24" />
            </v-badge>
          </v-btn>
        </template>

        <v-card class="notification-card" elevation="8">
          <v-card-text class="notification-content">
            <div class="notification-header">
              <div>
                <p class="notification-title mb-0">Notificações</p>
                <p class="notification-description mb-0">
                  {{ unreadCount }} não lidas
                </p>
              </div>
              <v-btn
                v-if="notifications.length"
                variant="text"
                color="primary"
                size="small"
                class="text-none"
                :disabled="inboxLoading || unreadCount === 0"
                @click="markAllNotificationsRead"
              >
                Marcar lidas
              </v-btn>
            </div>

            <div v-if="notifications.length" class="notification-list">
              <button
                v-for="notification in notifications"
                :key="notification.id"
                type="button"
                class="notification-item"
                :class="{ 'notification-item-unread': !notification.readAt }"
                @click="openNotification(notification)"
              >
                <span class="notification-item-dot" />
                <span class="notification-item-copy">
                  <span class="notification-item-title">
                    {{ notification.title }}
                  </span>
                  <span class="notification-item-body">
                    {{ notification.body }}
                  </span>
                  <span class="notification-item-date">
                    {{ formatNotificationDate(notification.createdAt) }}
                  </span>
                </span>
              </button>
            </div>

            <div v-else class="notification-list-empty">
              <Bell size="22" />
              <div>
                <p class="notification-title">Sem notificações</p>
                <p class="notification-description">Quando algo acontecer, aparece aqui.</p>
              </div>
            </div>

            <div class="notification-settings">
              <p class="notification-settings-title">{{ notificationTitle }}</p>
              <p class="notification-description">{{ notificationDescription }}</p>
            </div>

            <v-btn
              v-if="isEnabled"
              block
              variant="tonal"
              color="grey-darken-3"
              :loading="loading"
              @click="disable"
            >
              Desativar notificações
            </v-btn>

            <v-btn
              v-else
              block
              color="primary"
              :disabled="!canAskPermission"
              :loading="loading"
              @click="enable"
            >
              Ativar notificações
            </v-btn>

            <p v-if="message" class="notification-message">{{ message }}</p>
          </v-card-text>
        </v-card>
      </v-menu>

      <v-snackbar v-model="showNotificationMessage" timeout="3500" location="top right">
        {{ message }}
      </v-snackbar>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { Bell, BellOff, BellRing, Church } from "lucide-vue-next";
import { Moon, Sun } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useAuth } from "../../../../composables/useAuth";
import {
  usePushNotifications,
  type AppNotification,
} from "../../../../composables/usePushNotifications";

const { user } = useAuth();
const { isDark, toggleTheme } = useThemeMode();
const {
  status,
  message,
  loading,
  inboxLoading,
  notifications,
  unreadCount,
  isEnabled,
  hasUnread,
  canAskPermission,
  refreshStatus,
  startInboxSync,
  markNotificationRead,
  markAllNotificationsRead,
  enable,
  disable,
} = usePushNotifications();
const router = useRouter();

const firstName = computed(() => {
  const name = user.value?.name?.trim();

  return name ? name.split(" ")[0] : "usuário";
});

const churchName = computed(() => user.value?.church?.name || "Sem igreja");
const hasUnreadNotifications = computed(() => hasUnread.value);
const themeToggleLabel = computed(() =>
  isDark.value ? "Ativar tema claro" : "Ativar tema escuro",
);

const notificationColor = computed(() => {
  if (isEnabled.value) return "primary";
  if (status.value === "denied" || status.value === "unsupported") return "error";

  return "grey-darken-3";
});

const notificationTitle = computed(() => {
  if (isEnabled.value) return "Notificações do celular ativas";
  if (status.value === "denied") return "Permissão bloqueada";
  if (status.value === "unsupported") return "PWA indisponível";

  return "Notificações do celular desligadas";
});

const notificationDescription = computed(() => {
  if (isEnabled.value) return "Você será avisado sobre escalas, alterações e lembretes.";
  if (status.value === "denied") return "Libere a permissão nas configurações do navegador.";
  if (status.value === "unsupported") return "No celular, abra o app por HTTPS para receber push.";

  return "Receba avisos de escala, alteração e ensaio neste aparelho.";
});

const showNotificationMessage = computed({
  get: () => Boolean(message.value),
  set: (value: boolean) => {
    if (!value) {
      message.value = null;
    }
  },
});

const formatNotificationDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const openNotification = async (notification: AppNotification) => {
  await markNotificationRead(notification.id);
  await router.push(notification.url || "/user");
};

onMounted(async () => {
  await refreshStatus();
  await startInboxSync();
});
</script>

<style scoped>
.appbar {
  background-color: white;
  padding: 5px 20px;
  border-bottom: 1px solid #eef2ff;
}

:global(.app-theme-dark) .appbar {
  background-color: rgba(27, 29, 34, 0.96) !important;
  border-bottom-color: var(--app-color-border);
}

.avatar-text {
  color: #6366f1; /* Tom de roxo/índigo */
  font-weight: 700;
  font-size: 1.1rem;
}

:global(.app-theme-dark) .avatar-text {
  color: var(--app-color-accent);
}

.greeting-text {
  padding-bottom: 5px;
  font-size: 0.95rem;
  color: #6b7280; /* Cinza médio */
  line-height: 1.2;
}

:global(.app-theme-dark) .greeting-text {
  color: var(--app-color-text-muted);
}

.church-icon {
  color: #6366f1; /* Mesmo tom de roxo do avatar */
}

:global(.app-theme-dark) .church-icon {
  color: var(--app-color-accent);
}

.church-text {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937; /* Cinza quase preto */
  line-height: 1.2;
}

:global(.app-theme-dark) .church-text {
  color: var(--app-color-text);
}

.notification-card {
  width: min(320px, calc(100vw - 32px));
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
}

:global(.app-theme-dark) .notification-card {
  background: var(--app-color-surface);
  color: var(--app-color-text);
  border: 1px solid var(--app-color-border);
}

.notification-content {
  display: grid;
  gap: 14px;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.notification-list {
  display: grid;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 2px;
}

.notification-item {
  appearance: none;
  width: 100%;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  cursor: pointer;
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr);
  gap: 10px;
  padding: 10px;
  text-align: left;
}

.notification-item-unread {
  border-color: #c7d2fe;
  background: #eef2ff;
}

.notification-item-dot {
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 999px;
  background: transparent;
}

.notification-item-unread .notification-item-dot {
  background: #4f46e5;
}

.notification-item-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.notification-item-title {
  color: #111827;
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.25;
}

.notification-item-body,
.notification-item-date {
  color: #4b5563;
  font-size: 0.78rem;
  line-height: 1.3;
}

.notification-item-body {
  overflow-wrap: anywhere;
}

.notification-list-empty {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
}

:global(.app-theme-dark) .notification-list-empty {
  border-bottom-color: var(--app-color-border);
  color: var(--app-color-text-muted);
}

:global(.app-theme-dark) .notification-item {
  background: var(--app-color-surface);
  border-color: var(--app-color-border);
  color: var(--app-color-text);
}

:global(.app-theme-dark) .notification-item-unread {
  background: rgba(99, 102, 241, 0.16);
  border-color: rgba(129, 140, 248, 0.5);
}

:global(.app-theme-dark) .notification-item-title {
  color: var(--app-color-text);
}

:global(.app-theme-dark) .notification-item-body,
:global(.app-theme-dark) .notification-item-date {
  color: var(--app-color-text-muted);
}

.notification-settings {
  display: grid;
  gap: 4px;
}

.notification-title {
  margin: 0 0 4px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827 !important;
}

:global(.app-theme-dark) .notification-title {
  color: var(--app-color-text) !important;
}

.notification-settings-title {
  margin: 0;
  font-size: 0.86rem;
  font-weight: 700;
  color: #111827 !important;
}

:global(.app-theme-dark) .notification-settings-title {
  color: var(--app-color-text) !important;
}

.notification-description,
.notification-message {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.35;
  color: #4b5563 !important;
}

:global(.app-theme-dark) .notification-description,
:global(.app-theme-dark) .notification-message {
  color: var(--app-color-text-muted) !important;
}
</style>
