<template>
  <v-card
    :id="`schedule-${event.id}`"
    class="rounded-xl pa-4 mb-4 elevation-1 bg-white schedule-card"
    :class="{ 'schedule-card-selected': selected }"
    role="button"
    tabindex="0"
    @click="$emit('open-details', event)"
    @keydown.enter="$emit('open-details', event)"
    @keydown.space.prevent="$emit('open-details', event)"
  >
    <div class="schedule-card-header mb-4">
      <div class="min-w-0">
        <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-1 schedule-title">
          {{ event.title }}
        </h3>
        <p class="text-caption text-grey-darken-1 mb-0">
          {{ event.date }}
        </p>
      </div>

      <v-chip
        size="small"
        color="grey-lighten-3"
        text-color="grey-darken-3"
        class="schedule-time-chip"
      >
        <Clock size="14" class="mr-1" />
        <span>{{ event.time }}</span>
      </v-chip>
    </div>

    <div v-if="event.rehearsalLabel" class="schedule-rehearsal mb-4">
      <Clock size="15" />
      <span>Ensaio: {{ event.rehearsalLabel }}</span>
    </div>

    <div class="schedule-dashboard-strip mb-4">
      <div class="schedule-dashboard-metric">
        <span>{{ event.volunteerCount }}</span>
        <small>pessoas</small>
      </div>
      <div class="schedule-dashboard-metric">
        <span>{{ event.confirmedCount || 0 }}</span>
        <small>confirmados</small>
      </div>
      <div class="schedule-dashboard-metric">
        <span>{{ musicCount }}</span>
        <small>músicas</small>
      </div>
    </div>

    <div class="schedule-volunteers mb-4">
      <div v-if="event.volunteerCount > 0" class="avatar-stack">
        <v-avatar
          v-for="(volunteer, idx) in visibleVolunteers"
          :key="idx"
          size="34"
          :color="avatarColors[idx % avatarColors.length].bg"
          class="schedule-avatar"
          :style="{ color: avatarColors[idx % avatarColors.length].text }"
        >
          {{ volunteer.initials }}
        </v-avatar>

        <v-avatar
          v-if="extraVolunteerCount > 0"
          size="34"
          color="#F3F4F6"
          class="schedule-avatar schedule-avatar-extra"
        >
          +{{ extraVolunteerCount }}
        </v-avatar>
      </div>

      <div v-else class="empty-avatar">
        <UserPlus size="16" />
      </div>

      <div class="volunteer-copy">
        <span class="text-caption font-weight-bold text-grey-darken-3 volunteer-count">
          {{ volunteerLabel }}
        </span>
        <span class="text-caption text-grey-darken-1">
          {{ confirmationSummary }}
        </span>
      </div>
    </div>

    <div
      v-if="currentUserAssignment"
      class="assignment-confirmation mb-4"
      @click.stop
    >
      <div class="min-w-0">
        <p class="text-caption font-weight-bold text-grey-darken-4 mb-1">
          Sua resposta
        </p>
        <p class="text-caption text-grey-darken-1 mb-0">
          {{ userAssignmentStatusLabel }}
        </p>
      </div>
      <div class="assignment-confirmation-actions">
        <v-btn
          v-if="!hasViewed"
          variant="tonal"
          color="indigo-darken-2"
          size="small"
          class="text-none"
          @click.stop="$emit('mark-viewed', event)"
        >
          Vi a escala
        </v-btn>
        <v-btn
          v-if="!isConfirmed"
          color="purple-darken-3"
          size="small"
          class="text-none"
          @click.stop="$emit('confirm-presence', event)"
        >
          Confirmar presença
        </v-btn>
        <v-chip
          v-else
          size="small"
          color="teal-darken-2"
          variant="tonal"
        >
          Confirmado
        </v-chip>
        <v-btn
          v-if="!isDeclined"
          variant="tonal"
          color="red-darken-2"
          size="small"
          class="text-none"
          @click.stop="$emit('decline-presence', event)"
        >
          Não posso
        </v-btn>
        <v-btn
          v-if="!isMaybe"
          variant="tonal"
          color="amber-darken-3"
          size="small"
          class="text-none"
          @click.stop="$emit('maybe-presence', event)"
        >
          Talvez
        </v-btn>
        <v-btn
          v-if="!needsSwap"
          variant="tonal"
          color="indigo-darken-2"
          size="small"
          class="text-none"
          @click.stop="$emit('request-swap', event)"
        >
          Troca
        </v-btn>
      </div>
    </div>

    <div v-if="event.mediaItems?.length" class="schedule-media-list">
      <v-chip
        v-for="item in visibleMediaItems"
        :key="item.id"
        size="small"
        :color="item.category === 'MUSIC' ? 'purple-darken-3' : 'teal-darken-2'"
        variant="tonal"
      >
        {{ item.title }}
      </v-chip>
      <v-chip
        v-if="hiddenMediaCount > 0"
        size="small"
        color="grey-darken-1"
        variant="tonal"
      >
        +{{ hiddenMediaCount }}
      </v-chip>
    </div>
  </v-card>
</template>

<script setup>
import { Clock, UserPlus } from "lucide-vue-next";
import { computed } from "vue";

defineEmits([
  "open-details",
  "add-volunteer",
  "edit",
  "delete",
  "mark-viewed",
  "confirm-presence",
  "decline-presence",
  "maybe-presence",
  "request-swap",
]);

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  canManage: {
    type: Boolean,
    default: false,
  },
});

const avatarColors = [
  { bg: "#EEF2FF", text: "#4F46E5" },
  { bg: "#F0FDFA", text: "#0F766E" },
  { bg: "#FAF5FF", text: "#9333EA" },
  { bg: "#FEFCE8", text: "#A16207" },
];

const visibleVolunteers = computed(() => props.event.volunteers?.slice(0, 4) || []);
const visibleMediaItems = computed(() => props.event.mediaItems?.slice(0, 3) || []);
const extraVolunteerCount = computed(() =>
  Math.max((props.event.volunteerCount || 0) - visibleVolunteers.value.length, 0),
);
const hiddenMediaCount = computed(() =>
  Math.max((props.event.mediaItems?.length || 0) - visibleMediaItems.value.length, 0),
);
const musicCount = computed(
  () => props.event.mediaItems?.filter((item) => item.category === "MUSIC").length || 0,
);
const volunteerLabel = computed(() => {
  const count = props.event.volunteerCount || 0;
  return count === 1 ? "1 voluntário" : `${count} voluntários`;
});
const currentUserAssignment = computed(() => props.event.currentUserAssignment);
const hasViewed = computed(() => Boolean(currentUserAssignment.value?.viewedAt));
const isConfirmed = computed(
  () => currentUserAssignment.value?.confirmationStatus === "CONFIRMED",
);
const isDeclined = computed(
  () => currentUserAssignment.value?.confirmationStatus === "DECLINED",
);
const isMaybe = computed(
  () => currentUserAssignment.value?.confirmationStatus === "MAYBE",
);
const needsSwap = computed(
  () => currentUserAssignment.value?.confirmationStatus === "SWAP_REQUESTED",
);
const confirmationSummary = computed(() => {
  if (!props.event.volunteerCount) return "Equipe ainda vazia";

  return `${props.event.confirmedCount || 0} confirmados · ${props.event.viewedCount || 0} viram`;
});
const userAssignmentStatusLabel = computed(() => {
  if (isConfirmed.value) return "Você confirmou presença nesta escala.";
  if (isDeclined.value) return "Você marcou que não pode ir.";
  if (isMaybe.value) return "Você marcou talvez.";
  if (needsSwap.value) return "Você pediu troca nesta escala.";
  if (hasViewed.value) return "Você já marcou que viu esta escala.";
  return "Marque que viu e confirme se você vai.";
});
</script>

<style scoped>
.schedule-card {
  border: 1px solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.schedule-card:hover {
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.08) !important;
  transform: translateY(-1px);
}

.schedule-card:focus-visible {
  outline: 3px solid rgba(168, 85, 247, 0.32);
  outline-offset: 3px;
}

.schedule-card-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
}

.schedule-title {
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.schedule-volunteers {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 42px;
  border-radius: 14px;
  background: #fafafa;
  border: 1px solid #f3f4f6;
  padding: 10px 12px;
}

.schedule-dashboard-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.schedule-dashboard-metric {
  display: grid;
  gap: 2px;
  min-height: 58px;
  align-content: center;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px 10px;
}

.schedule-dashboard-metric span {
  color: #1f2937;
  font-size: 1.05rem;
  font-weight: 850;
  line-height: 1;
}

.schedule-dashboard-metric small {
  color: #6b7280;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.15;
}

.schedule-role-list {
  display: grid;
  gap: 8px;
}

.schedule-role-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  background: #ffffff;
}

.schedule-role-name,
.schedule-role-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.schedule-role-name {
  color: #1f2937;
  font-size: 0.82rem;
  font-weight: 700;
}

.schedule-role-value {
  color: #6d28d9;
  font-size: 0.78rem;
  font-weight: 800;
}

.schedule-role-more {
  color: #6b7280;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
}

.schedule-rehearsal {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #fef3c7;
  border-radius: 12px;
  background: #fffbeb;
  color: #92400e;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 9px 11px;
}

.schedule-media-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.assignment-confirmation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #ede9fe;
  border-radius: 14px;
  background: #faf5ff;
  padding: 12px;
}

.assignment-confirmation-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  flex: 0 0 auto;
}

.schedule-media-chip-clickable {
  cursor: pointer;
}

.song-viewer {
  overflow: hidden;
}

.song-viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
}

.song-viewer-body {
  max-height: min(680px, 75vh);
  overflow-y: auto;
  padding: 20px;
}

.song-text-block {
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  background: #fafafa;
  color: #1f2937;
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.65;
  margin: 0;
  min-height: 180px;
  overflow-x: auto;
  padding: 16px;
  white-space: pre-wrap;
}

.song-chords-block {
  font-family: "Courier New", monospace;
}

.song-chords-input :deep(textarea) {
  font-family: "Courier New", monospace;
}

.schedule-input :deep(.v-field) {
  border-radius: 14px;
}

.personal-chords-panel {
  display: grid;
  gap: 12px;
}

.personal-chords-heading,
.personal-chords-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.avatar-stack {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  min-width: 34px;
}

.schedule-avatar {
  border: 2px solid white;
  box-shadow: 0 4px 10px rgba(17, 24, 39, 0.08);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0;
}

.schedule-avatar + .schedule-avatar {
  margin-left: -9px;
}

.schedule-avatar-extra {
  color: #4b5563 !important;
}

.empty-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #9ca3af;
  background: #ffffff;
  border: 1px dashed #d1d5db;
}

.volunteer-count {
  min-width: 0;
}

.volunteer-copy {
  display: grid;
  min-width: 0;
  line-height: 1.2;
}

.schedule-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.add-volunteer-btn {
  min-width: 0;
}

.schedule-card-selected {
  border-color: #a855f7;
  box-shadow: 0 10px 26px rgba(168, 85, 247, 0.18) !important;
}

.schedule-time-chip {
  flex: 0 0 auto;
  max-width: 100%;
  padding-inline: 10px !important;
  font-weight: 700;
}

.schedule-time-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 420px) {
  .schedule-card-header {
    grid-template-columns: 1fr;
  }

  .schedule-card-header :deep(.v-chip) {
    width: fit-content;
    max-width: 100%;
  }

  .schedule-actions {
    justify-content: flex-start;
  }

  .assignment-confirmation {
    align-items: stretch;
    flex-direction: column;
  }

  .assignment-confirmation-actions {
    justify-content: flex-start;
  }

  .add-volunteer-btn {
    flex: 1 1 100%;
  }
}
</style>
