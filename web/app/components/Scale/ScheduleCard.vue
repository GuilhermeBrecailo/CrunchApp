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
          @click="$emit('mark-viewed', event)"
        >
          Vi a escala
        </v-btn>
        <v-btn
          v-if="!isConfirmed"
          color="purple-darken-3"
          size="small"
          class="text-none"
          @click="$emit('confirm-presence', event)"
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
          @click="$emit('decline-presence', event)"
        >
          Não posso
        </v-btn>
        <v-btn
          v-if="!isMaybe"
          variant="tonal"
          color="amber-darken-3"
          size="small"
          class="text-none"
          @click="$emit('maybe-presence', event)"
        >
          Talvez
        </v-btn>
        <v-btn
          v-if="!needsSwap"
          variant="tonal"
          color="indigo-darken-2"
          size="small"
          class="text-none"
          @click="$emit('request-swap', event)"
        >
          Troca
        </v-btn>
      </div>
    </div>

    <div v-if="event.mediaItems?.length" class="schedule-media-list mb-4">
      <v-chip
        v-for="item in event.mediaItems"
        :key="item.id"
        size="small"
        :color="item.category === 'MUSIC' ? 'purple-darken-3' : 'teal-darken-2'"
        variant="tonal"
        :class="{ 'schedule-media-chip-clickable': item.category === 'MUSIC' }"
        @click="item.category === 'MUSIC' ? openSongViewer(item) : undefined"
      >
        {{ item.title }}
      </v-chip>
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

    <v-dialog v-model="isSongViewerOpen" max-width="760" scrollable>
      <v-card v-if="selectedSong" class="rounded-xl bg-white song-viewer" elevation="0">
        <div class="song-viewer-header">
          <div class="min-w-0">
            <p class="text-caption text-purple-darken-3 font-weight-bold mb-1">
              {{ selectedSong.metadata?.songCategory || "Louvor" }}
            </p>
            <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-0 text-truncate">
              {{ selectedSong.title }}
            </h2>
            <p class="text-body-2 text-grey-darken-1 mb-0 text-truncate">
              {{ selectedSong.metadata?.artist || "Artista não informado" }}
            </p>
          </div>
          <v-btn icon variant="text" color="grey-darken-1" @click="closeSongViewer">
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </div>

        <v-divider />

        <div class="song-viewer-body">
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip v-if="selectedSong.metadata?.key" size="small" variant="tonal">
              Tom {{ selectedSong.metadata.key }}
            </v-chip>
            <v-chip v-if="selectedSong.metadata?.bpm" size="small" variant="tonal">
              {{ selectedSong.metadata.bpm }} BPM
            </v-chip>
            <v-btn
              v-if="selectedSong.url"
              :href="selectedSong.url"
              target="_blank"
              rel="noopener noreferrer"
              color="purple-darken-3"
              variant="tonal"
              size="small"
              class="text-none"
              @click.stop
            >
              Abrir link
            </v-btn>
          </div>

          <v-tabs v-model="songViewerTab" color="purple-darken-3" class="mb-4">
            <v-tab value="lyrics" class="text-none">Letra</v-tab>
            <v-tab value="chords" class="text-none">Cifra</v-tab>
            <v-tab value="notes" class="text-none">Notas</v-tab>
          </v-tabs>

          <pre v-if="songViewerTab === 'lyrics'" class="song-text-block">{{ selectedSong.metadata?.lyrics || "Letra não cadastrada." }}</pre>
          <div v-else-if="songViewerTab === 'chords'" class="personal-chords-panel">
            <div class="personal-chords-heading">
              <div>
                <h3 class="text-subtitle-2 font-weight-bold text-grey-darken-4 mb-1">
                  Minha cifra
                </h3>
                <p class="text-caption text-grey-darken-1 mb-0">
                  Esta versão aparece somente para você.
                </p>
              </div>
              <v-chip v-if="personalSongForm.personalKey" size="small" variant="tonal">
                Meu tom {{ personalSongForm.personalKey }}
              </v-chip>
            </div>

            <v-text-field
              v-model="personalSongForm.personalKey"
              label="Meu tom"
              placeholder="ex: C, Dm, F#"
              variant="outlined"
              density="comfortable"
              color="purple-darken-3"
              bg-color="white"
              class="schedule-input mb-3"
              hide-details="auto"
              :disabled="isLoadingSongPreference || isSavingSongPreference"
            />

            <v-textarea
              v-model="personalSongForm.chords"
              label="Minha cifra"
              variant="outlined"
              density="comfortable"
              color="purple-darken-3"
              bg-color="white"
              class="schedule-input song-chords-input mb-3"
              hide-details="auto"
              rows="9"
              auto-grow
              :disabled="isLoadingSongPreference || isSavingSongPreference"
            />

            <div class="personal-chords-actions">
              <div class="d-flex ga-2">
                <v-btn
                  variant="tonal"
                  color="grey-darken-1"
                  size="small"
                  class="text-none"
                  @click="transposePersonalChords(-1)"
                >
                  -1 tom
                </v-btn>
                <v-btn
                  variant="tonal"
                  color="grey-darken-1"
                  size="small"
                  class="text-none"
                  @click="transposePersonalChords(1)"
                >
                  +1 tom
                </v-btn>
              </div>
              <v-btn
                variant="text"
                color="grey-darken-1"
                class="text-none"
                :disabled="isLoadingSongPreference || isSavingSongPreference"
                @click="useOfficialChords"
              >
                Usar cifra da escala
              </v-btn>
              <v-btn
                color="purple-darken-3"
                class="text-none"
                :loading="isSavingSongPreference"
                :disabled="isLoadingSongPreference"
                @click="saveSongPreference"
              >
                Salvar minha cifra
              </v-btn>
            </div>

            <v-alert
              v-if="songPreferenceError"
              type="error"
              variant="tonal"
              density="compact"
              class="mt-3"
            >
              {{ songPreferenceError }}
            </v-alert>
          </div>
          <pre v-else class="song-text-block">{{ selectedSong.metadata?.notes || "Sem observações." }}</pre>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { Clock, Pencil, Trash2, UserPlus } from "lucide-vue-next";
import { computed, reactive, ref } from "vue";
import { useDepartments } from "../../../composables/useDepartments";

defineEmits([
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

const selectedSong = ref(null);
const isSongViewerOpen = ref(false);
const songViewerTab = ref("lyrics");
const isLoadingSongPreference = ref(false);
const isSavingSongPreference = ref(false);
const songPreferenceError = ref("");
const personalSongForm = reactive({
  personalKey: "",
  chords: "",
});
const { getSongPreference, updateSongPreference } = useDepartments();

const openSongViewer = (song) => {
  selectedSong.value = song;
  songViewerTab.value = song.metadata?.lyrics
    ? "lyrics"
    : song.metadata?.chords
      ? "chords"
      : "notes";
  isSongViewerOpen.value = true;
  void loadSongPreference(song);
};

const closeSongViewer = () => {
  selectedSong.value = null;
  isSongViewerOpen.value = false;
  songPreferenceError.value = "";
  personalSongForm.personalKey = "";
  personalSongForm.chords = "";
};

const loadSongPreference = async (song) => {
  songPreferenceError.value = "";
  isLoadingSongPreference.value = true;
  personalSongForm.personalKey = "";
  personalSongForm.chords = song.metadata?.chords || "";

  const { data, error } = await getSongPreference(song.id);

  isLoadingSongPreference.value = false;

  if (error) {
    songPreferenceError.value = error;
    return;
  }

  personalSongForm.personalKey = data?.personalKey || "";
  personalSongForm.chords = data?.chords || song.metadata?.chords || "";
};

const useOfficialChords = () => {
  personalSongForm.personalKey = selectedSong.value?.metadata?.key || "";
  personalSongForm.chords = selectedSong.value?.metadata?.chords || "";
};

const saveSongPreference = async () => {
  if (!selectedSong.value) return;

  songPreferenceError.value = "";
  isSavingSongPreference.value = true;

  const { data, error } = await updateSongPreference(selectedSong.value.id, {
    personalKey: personalSongForm.personalKey,
    chords: personalSongForm.chords,
  });

  isSavingSongPreference.value = false;

  if (error || !data) {
    songPreferenceError.value = error || "Não foi possível salvar sua cifra.";
    return;
  }

  personalSongForm.personalKey = data.personalKey || "";
  personalSongForm.chords = data.chords || "";
};

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatToSharp = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

const transposeNote = (note, steps) => {
  const normalized = flatToSharp[note] || note;
  const index = noteNames.indexOf(normalized);

  if (index === -1) return note;

  return noteNames[(index + steps + noteNames.length) % noteNames.length];
};

const transposePersonalChords = (steps) => {
  const chordRegex = /\b([A-G](?:#|b)?)(m|maj|min|dim|aug|sus|add)?([0-9]*)?(\/([A-G](?:#|b)?))?/g;

  personalSongForm.chords = personalSongForm.chords.replace(
    chordRegex,
    (match, root, quality = "", extension = "", slash = "", bass = "") => {
      const nextRoot = transposeNote(root, steps);
      const nextBass = bass ? `/${transposeNote(bass, steps)}` : "";
      return `${nextRoot}${quality || ""}${extension || ""}${nextBass}`;
    },
  );

  if (personalSongForm.personalKey) {
    personalSongForm.personalKey = transposeNote(personalSongForm.personalKey, steps);
  }
};

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
