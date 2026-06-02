<template>
  <v-card
    :id="`schedule-${event.id}`"
    class="rounded-xl pa-4 mb-4 elevation-1 bg-white schedule-card"
    :class="{ 'schedule-card-selected': selected }"
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
        class="font-weight-medium px-3"
      >
        <Clock size="14" class="mr-1" />
        {{ event.time }}
      </v-chip>
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
          {{ event.volunteerCount > 0 ? "Equipe confirmada" : "Equipe ainda vazia" }}
        </span>
      </div>
    </div>

    <v-divider class="mb-3"></v-divider>
    <div class="schedule-actions">
      <v-btn
        v-if="canManage"
        variant="text"
        color="primary"
        class="text-none font-weight-medium add-volunteer-btn"
        size="small"
        @click="$emit('add-volunteer', event)"
      >
        <UserPlus size="16" class="mr-2" />
        Adicionar Voluntário
      </v-btn>
      <v-btn
        v-if="canManage"
        icon
        variant="text"
        color="grey-darken-1"
        size="small"
        @click="$emit('edit', event)"
      >
        <Pencil size="16" />
      </v-btn>
      <v-btn
        v-if="canManage"
        icon
        variant="text"
        color="red-darken-2"
        size="small"
        @click="$emit('delete', event)"
      >
        <Trash2 size="16" />
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { Clock, Pencil, Trash2, UserPlus } from "lucide-vue-next";
import { computed } from "vue";

defineEmits(["add-volunteer", "edit", "delete"]);

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
const extraVolunteerCount = computed(() =>
  Math.max((props.event.volunteerCount || 0) - visibleVolunteers.value.length, 0),
);
const volunteerLabel = computed(() => {
  const count = props.event.volunteerCount || 0;
  return count === 1 ? "1 voluntário" : `${count} voluntários`;
});
</script>

<style scoped>
.schedule-card {
  border: 1px solid transparent;
  overflow: hidden;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease;
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

@media (max-width: 420px) {
  .schedule-card-header {
    grid-template-columns: 1fr;
  }

  .schedule-card-header :deep(.v-chip) {
    width: fit-content;
  }

  .schedule-actions {
    justify-content: flex-start;
  }

  .add-volunteer-btn {
    flex: 1 1 100%;
  }
}
</style>
