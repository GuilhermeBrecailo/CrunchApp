<template>
  <div class="pa-4 bg-grey-lighten-4 min-vh-100">
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-4">Escalas</h1>
        <p class="text-body-2 text-grey-darken-1 mb-0">
          Confira os próximos cultos e eventos
        </p>
      </div>
      <v-btn
        v-if="canCreateChurchSchedule"
        color="#A855F7"
        class="rounded-lg text-none px-4"
        elevation="2"
        @click="isScheduleDialogOpen = true"
      >
        <Plus size="18" class="mr-1" /> Novo
      </v-btn>
    </div>

    <div class="filter-strip mb-8">
      <div class="filter-scroll hide-scrollbar">
        <v-chip
          v-for="filter in filters"
          :key="filter"
          :variant="activeFilter === filter ? 'flat' : 'outlined'"
          :color="activeFilter === filter ? '#A855F7' : 'grey-darken-1'"
          class="filter-chip cursor-pointer"
          @click="activeFilter = filter"
        >
          <span class="filter-chip-label">{{ filter }}</span>
        </v-chip>
      </div>
    </div>

    <div v-if="canCreateChurchSchedule" class="leader-summary-grid mb-6">
      <v-card class="leader-summary-card pa-4 elevation-1 bg-white">
        <p class="text-caption text-grey-darken-1 mb-1">Pendentes</p>
        <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-0">
          {{ leaderSummary.pending }}
        </h2>
      </v-card>
      <v-card class="leader-summary-card pa-4 elevation-1 bg-white">
        <p class="text-caption text-grey-darken-1 mb-1">Não viram</p>
        <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-0">
          {{ leaderSummary.notViewed }}
        </h2>
      </v-card>
      <v-card class="leader-summary-card pa-4 elevation-1 bg-white">
        <p class="text-caption text-grey-darken-1 mb-1">Trocas</p>
        <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-0">
          {{ leaderSummary.swapRequests }}
        </h2>
      </v-card>
    </div>

    <div>
      <ScaleScheduleSection
        v-for="(section, index) in filteredSchedules"
        :key="index"
        :title="section.category"
        :events="section.events"
        :selected-event-id="focusedScheduleId"
        @add-volunteer="openAssignmentsDialog"
        @edit="openScheduleEditDialog"
        @delete="handleDeleteSchedule"
        @mark-viewed="handleMarkScheduleViewed"
        @confirm-presence="handleConfirmSchedule"
        @decline-presence="handleDeclineSchedule"
        @maybe-presence="handleMaybeSchedule"
        @request-swap="handleRequestSwap"
      />

      <v-card
        v-if="filteredSchedules.length === 0 && !schedulesError"
        class="rounded-xl pa-8 elevation-1 bg-white d-flex flex-column align-center justify-center"
      >
        <Calendar size="32" color="#9CA3AF" class="mb-3" />
        <p class="text-caption text-grey-darken-1 font-weight-medium mb-0">
          Nenhuma escala encontrada
        </p>
      </v-card>

      <v-alert
        v-if="schedulesError"
        type="error"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        {{ schedulesError }}
      </v-alert>
    </div>

    <v-dialog v-model="isScheduleDialogOpen" max-width="520">
      <v-card class="rounded-xl pa-6 bg-white" elevation="0">
        <div class="d-flex align-center mb-5">
          <v-avatar color="#FAF5FF" size="44" class="mr-3">
            <Calendar size="20" color="#A855F7" />
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-0">
              {{ editingScheduleId ? "Editar escala" : "Nova escala" }}
            </h2>
            <p class="text-body-2 text-grey-darken-1 mb-0">
              Cadastre uma escala para um ministério.
            </p>
          </div>
        </div>

        <v-form autocomplete="off" @submit.prevent="handleSaveSchedule">
          <v-text-field
            v-model="scheduleForm.title"
            label="Título"
            prepend-inner-icon="mdi-calendar-text-outline"
            variant="outlined"
            density="comfortable"
            color="purple-darken-3"
            bg-color="white"
            class="scale-input mb-4"
            hide-details="auto"
            :disabled="isCreatingSchedule"
          />

          <div class="scale-field-grid mb-4">
            <v-text-field
              v-model="scheduleForm.date"
              label="Data"
              type="date"
              variant="outlined"
              density="comfortable"
              color="purple-darken-3"
              bg-color="white"
              class="scale-input"
              hide-details="auto"
              :disabled="isCreatingSchedule"
            />
            <v-text-field
              v-model="scheduleForm.time"
              label="Horário"
              type="time"
              variant="outlined"
              density="comfortable"
              color="purple-darken-3"
              bg-color="white"
              class="scale-input"
              hide-details="auto"
              :disabled="isCreatingSchedule"
            />
          </div>

          <v-select
            v-model="scheduleForm.departmentId"
            label="Ministério"
            :items="departmentOptions"
            item-title="label"
            item-value="value"
            prepend-inner-icon="mdi-account-group-outline"
            variant="outlined"
            density="comfortable"
            color="purple-darken-3"
            bg-color="white"
            class="scale-input mb-4"
            hide-details="auto"
            :disabled="isCreatingSchedule"
          />

          <div class="scale-field-grid mb-4">
            <v-text-field
              v-model="scheduleForm.rehearsalDate"
              label="Data do ensaio"
              type="date"
              variant="outlined"
              density="comfortable"
              color="purple-darken-3"
              bg-color="white"
              class="scale-input"
              hide-details="auto"
              :disabled="isCreatingSchedule"
            />
            <v-text-field
              v-model="scheduleForm.rehearsalTime"
              label="Hora do ensaio"
              type="time"
              variant="outlined"
              density="comfortable"
              color="purple-darken-3"
              bg-color="white"
              class="scale-input"
              hide-details="auto"
              :disabled="isCreatingSchedule"
            />
          </div>

          <v-text-field
            v-model="scheduleForm.rehearsalNotes"
            label="Observações do ensaio"
            prepend-inner-icon="mdi-text"
            variant="outlined"
            density="comfortable"
            color="purple-darken-3"
            bg-color="white"
            class="scale-input mb-4"
            hide-details="auto"
            :disabled="isCreatingSchedule"
          />

          <v-select
            v-if="songOptions.length"
            v-model="scheduleForm.songIds"
            label="Músicas"
            :items="songOptions"
            item-title="label"
            item-value="value"
            prepend-inner-icon="mdi-music-note-outline"
            variant="outlined"
            density="comfortable"
            color="purple-darken-3"
            bg-color="white"
            class="scale-input mb-4"
            hide-details="auto"
            multiple
            chips
            closable-chips
            :disabled="isCreatingSchedule"
          />

          <v-select
            v-if="resourceOptions.length"
            v-model="scheduleForm.resourceIds"
            label="Recursos"
            :items="resourceOptions"
            item-title="label"
            item-value="value"
            prepend-inner-icon="mdi-file-document-outline"
            variant="outlined"
            density="comfortable"
            color="purple-darken-3"
            bg-color="white"
            class="scale-input mb-4"
            hide-details="auto"
            multiple
            chips
            closable-chips
            :disabled="isCreatingSchedule"
          />

          <v-alert
            v-if="createScheduleError"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ createScheduleError }}
          </v-alert>

          <div class="dialog-actions">
            <v-btn
              variant="text"
              color="grey-darken-1"
              class="text-none"
              :disabled="isCreatingSchedule"
              @click="closeScheduleDialog"
            >
              Cancelar
            </v-btn>
            <v-btn
              type="submit"
              color="purple-darken-3"
              class="text-none font-weight-bold"
              :loading="isCreatingSchedule"
              :disabled="isCreatingSchedule"
            >
              {{ editingScheduleId ? "Salvar escala" : "Criar escala" }}
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isAssignmentsDialogOpen" max-width="560">
      <v-card class="rounded-xl pa-6 bg-white" elevation="0">
        <div class="d-flex align-center mb-5">
          <v-avatar color="#FAF5FF" size="44" class="mr-3">
            <UserPlus size="20" color="#A855F7" />
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-0">
              Voluntários da escala
            </h2>
            <p class="text-body-2 text-grey-darken-1 mb-0">
              {{ selectedSchedule?.description || "Monte a equipe da escala." }}
            </p>
          </div>
        </div>

        <div class="scale-field-grid mb-4">
          <v-select
            v-model="assignmentForm.userId"
            label="Voluntário"
            :items="memberOptions"
            item-title="label"
            item-value="value"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            density="comfortable"
            color="purple-darken-3"
            bg-color="white"
            class="scale-input"
            hide-details="auto"
            :disabled="isSavingAssignments"
          />
          <v-text-field
            v-model="assignmentForm.role"
            label="Função"
            placeholder="ex: Vocal"
            variant="outlined"
            density="comfortable"
            color="purple-darken-3"
            bg-color="white"
            class="scale-input"
            hide-details="auto"
            :disabled="isSavingAssignments"
          />
        </div>

        <v-btn
          color="#A855F7"
          variant="tonal"
          class="text-none mb-4"
          :disabled="isSavingAssignments"
          @click="addDraftAssignment"
        >
          <Plus size="18" class="mr-1" /> Adicionar voluntário
        </v-btn>

        <div v-if="draftAssignments.length" class="d-flex flex-column gap-2 mb-4">
          <v-card
            v-for="assignment in draftAssignments"
            :key="assignment.userId"
            class="rounded-lg pa-3 bg-grey-lighten-5"
            elevation="0"
          >
            <div class="d-flex justify-space-between align-center gap-3">
              <div class="min-w-0">
                <p class="text-body-2 font-weight-bold text-grey-darken-4 mb-0">
                  {{ assignment.name }}
                </p>
                <p class="text-caption text-grey-darken-1 mb-0">
                  {{ assignment.role }}
                </p>
                <div class="d-flex flex-wrap ga-2 mt-2">
                  <v-chip
                    size="x-small"
                    :color="assignment.viewedAt ? 'indigo-darken-2' : 'grey'"
                    variant="tonal"
                  >
                    {{ assignment.viewedAt ? "Viu" : "Não viu" }}
                  </v-chip>
                  <v-chip
                    size="x-small"
                    :color="responseStatusColor(assignment.confirmationStatus)"
                    variant="tonal"
                  >
                    {{ responseStatusLabel(assignment.confirmationStatus) }}
                  </v-chip>
                  <v-chip
                    size="x-small"
                    :color="assignment.attendanceStatus === 'PRESENT' ? 'teal-darken-2' : assignment.attendanceStatus === 'ABSENT' ? 'red-darken-2' : 'grey'"
                    variant="tonal"
                  >
                    {{ attendanceStatusLabel(assignment.attendanceStatus) }}
                  </v-chip>
                  <v-chip
                    v-if="assignment.warning"
                    size="x-small"
                    color="amber-darken-3"
                    variant="tonal"
                  >
                    {{ assignment.warning }}
                  </v-chip>
                </div>
              </div>
              <div class="d-flex align-center ga-1">
                <v-btn
                  icon
                  variant="text"
                  color="teal-darken-2"
                  size="small"
                  :disabled="isSavingAssignments"
                  @click="markAttendance(assignment, 'PRESENT')"
                >
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  color="red-darken-2"
                  size="small"
                  :disabled="isSavingAssignments"
                  @click="markAttendance(assignment, 'ABSENT')"
                >
                  <v-icon size="18">mdi-close-circle-outline</v-icon>
                </v-btn>
              </div>
              <v-btn
                icon
                variant="text"
                color="grey-darken-1"
                size="small"
                :disabled="isSavingAssignments"
                @click="removeDraftAssignment(assignment.userId)"
              >
                <v-icon size="18">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card>
        </div>

        <v-card
          v-else
          class="rounded-lg pa-5 bg-grey-lighten-5 text-center mb-4"
          elevation="0"
        >
          <p class="text-caption text-grey-darken-1 mb-0">
            Nenhum voluntário adicionado nesta escala.
          </p>
        </v-card>

        <v-alert
          v-if="assignmentsError"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          {{ assignmentsError }}
        </v-alert>

        <div class="dialog-actions">
          <v-btn
            variant="text"
            color="grey-darken-1"
            class="text-none"
            :disabled="isSavingAssignments"
            @click="closeAssignmentsDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="purple-darken-3"
            class="text-none font-weight-bold"
            :loading="isSavingAssignments"
            :disabled="isSavingAssignments"
            @click="saveAssignments"
          >
            Salvar voluntários
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <UtilsConfirmDialog
      v-model="isDeleteScheduleDialogOpen"
      title="Remover escala"
      message="Esta escala e seus voluntários serão removidos."
      :loading="isDeletingSchedule"
      @cancel="closeDeleteScheduleDialog"
      @confirm="confirmDeleteSchedule"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { Calendar, Plus, UserPlus } from "lucide-vue-next";
import { useAuth } from "../../composables/useAuth";
import {
  useDepartments,
  type ChurchDepartment,
  type DepartmentResource,
  type DepartmentSchedule,
  type DepartmentSong,
} from "../../composables/useDepartments";
import { useMembers, type ChurchMember } from "../../composables/useMembers";

const {
  getDepartments,
  getChurchSchedules,
  createChurchSchedule,
  updateChurchSchedule,
  deleteChurchSchedule,
  updateScheduleAssignments,
  updateMyScheduleAssignment,
  updateScheduleAssignmentAttendance,
  getDepartmentResources,
  getDepartmentSongs,
} = useDepartments();
const { getMembers } = useMembers();
const { user } = useAuth();
const route = useRoute();

const activeFilter = ref("Todos");
const departments = ref<ChurchDepartment[]>([]);
const schedules = ref<DepartmentSchedule[]>([]);
const members = ref<ChurchMember[]>([]);
const resourcesByDepartment = ref<Record<string, DepartmentResource[]>>({});
const songsByDepartment = ref<Record<string, DepartmentSong[]>>({});
const schedulesError = ref("");
const createScheduleError = ref("");
const assignmentsError = ref("");
const isScheduleDialogOpen = ref(false);
const isAssignmentsDialogOpen = ref(false);
const isCreatingSchedule = ref(false);
const isSavingAssignments = ref(false);
const isDeletingSchedule = ref(false);
const selectedScheduleId = ref("");
const focusedScheduleId = ref("");
const editingScheduleId = ref("");
const isPrefillingScheduleForm = ref(false);
const pendingDeleteSchedule = ref<ScheduleEvent | null>(null);

const scheduleForm = reactive({
  title: "",
  date: "",
  time: "",
  departmentId: "",
  rehearsalDate: "",
  rehearsalTime: "",
  rehearsalNotes: "",
  songIds: [] as string[],
  resourceIds: [] as string[],
});

const assignmentForm = reactive({
  userId: "",
  role: "",
});

const draftAssignments = ref<
  {
    userId: string;
    assignmentId?: string;
    name: string;
    role: string;
    viewedAt?: string | null;
    confirmationStatus?: string;
    attendanceStatus?: string;
    warning?: string;
  }[]
>([]);

const filters = computed(() => [
  "Todos",
  ...departments.value.map((department) => department.name),
]);

const isChurchWideManager = computed(
  () =>
    user.value?.role === "PASTOR" ||
    user.value?.role === "ADMIN" ||
    user.value?.role === "SUPER_ADMIN" ||
    user.value?.is_admin === true,
);
const manageableDepartments = computed(() => {
  if (isChurchWideManager.value) {
    return departments.value;
  }

  return departments.value.filter((department) => department.leaderId === user.value?.id);
});

const departmentOptions = computed(() =>
  manageableDepartments.value.map((department) => ({
    label: department.name,
    value: department.id,
  })),
);

const memberOptions = computed(() =>
  members.value.map((member) => ({
    label: `${member.name} (${member.email})`,
    value: member.id,
  })),
);

const selectedDepartmentResources = computed(
  () => resourcesByDepartment.value[scheduleForm.departmentId] || [],
);

const selectedDepartmentSongs = computed(
  () => songsByDepartment.value[scheduleForm.departmentId] || [],
);

const songOptions = computed(() =>
  selectedDepartmentSongs.value.map((song) => ({
    label: song.metadata?.artist ? `${song.title} - ${song.metadata.artist}` : song.title,
    value: song.id,
  })),
);

const resourceOptions = computed(() =>
  selectedDepartmentResources.value.map((resource) => ({
    label: `${resource.title} (${resource.category})`,
    value: resource.id,
  })),
);

const responseStatusLabel = (status?: string) => {
  const labels: Record<string, string> = {
    CONFIRMED: "Confirmou",
    DECLINED: "Não pode",
    MAYBE: "Talvez",
    SWAP_REQUESTED: "Troca",
    PENDING: "Pendente",
  };

  return labels[status || "PENDING"] || "Pendente";
};

const responseStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    CONFIRMED: "teal-darken-2",
    DECLINED: "red-darken-2",
    MAYBE: "amber-darken-3",
    SWAP_REQUESTED: "indigo-darken-2",
    PENDING: "grey",
  };

  return colors[status || "PENDING"] || "grey";
};

const attendanceStatusLabel = (status?: string) => {
  if (status === "PRESENT") return "Presente";
  if (status === "ABSENT") return "Faltou";
  return "Presença pendente";
};

const selectedSchedule = computed(() =>
  schedules.value.find((schedule) => schedule.id === selectedScheduleId.value),
);

const leaderSummary = computed(() => {
  const assignments = schedules.value.flatMap((schedule) => schedule.assignments || []);

  return {
    pending: assignments.filter(
      (assignment) =>
        !assignment.confirmationStatus ||
        assignment.confirmationStatus === "PENDING",
    ).length,
    notViewed: assignments.filter((assignment) => !assignment.viewedAt).length,
    swapRequests: assignments.filter(
      (assignment) => assignment.confirmationStatus === "SWAP_REQUESTED",
    ).length,
  };
});

const isDeleteScheduleDialogOpen = computed({
  get: () => Boolean(pendingDeleteSchedule.value),
  set: (value: boolean) => {
    if (!value && !isDeletingSchedule.value) {
      pendingDeleteSchedule.value = null;
    }
  },
});

type ScheduleEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  rehearsalLabel?: string;
  rehearsalNotes?: string | null;
  volunteerCount: number;
  viewedCount: number;
  confirmedCount: number;
  volunteers: { initials: string }[];
  currentUserAssignment?: {
    id: string;
    viewedAt?: string | null;
    confirmationStatus?: string;
    confirmedAt?: string | null;
  } | null;
  mediaItems: {
    id: string;
    title: string;
    category: string;
    url?: string;
    metadata?: DepartmentSong["metadata"] | DepartmentResource["metadata"];
  }[];
  canManage: boolean;
};

const canCreateChurchSchedule = computed(
  () => manageableDepartments.value.length > 0,
);

const canManageSchedule = (schedule: DepartmentSchedule) =>
  isChurchWideManager.value ||
  schedule.department?.leaderId === user.value?.id;

const filteredSchedules = computed(() => {
  const visibleSchedules =
    activeFilter.value === "Todos"
      ? schedules.value
      : schedules.value.filter(
          (schedule) => schedule.department?.name === activeFilter.value,
        );

  const groups = visibleSchedules.reduce<Record<string, ScheduleEvent[]>>(
    (acc, schedule) => {
      const category = schedule.department?.name || "Sem ministério";
      acc[category] ||= [];
      acc[category].push(toScheduleEvent(schedule));
      return acc;
    },
    {},
  );

  return Object.entries(groups).map(([category, events]) => ({
    category,
    events,
  }));
});

const toScheduleEvent = (schedule: DepartmentSchedule): ScheduleEvent => {
  const date = new Date(schedule.date);
  const rehearsalDate = schedule.rehearsalAt ? new Date(schedule.rehearsalAt) : null;
  const currentUserAssignment = schedule.assignments?.find(
    (assignment) => assignment.userId === user.value?.id,
  );

  return {
    id: schedule.id,
    title: schedule.description,
    date: new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
    }).format(date),
    time: new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
    rehearsalLabel:
      rehearsalDate && !Number.isNaN(rehearsalDate.getTime())
        ? new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(rehearsalDate)
        : "",
    rehearsalNotes: schedule.rehearsalNotes,
    volunteerCount: schedule.assignments?.length || 0,
    viewedCount:
      schedule.assignments?.filter((assignment) => Boolean(assignment.viewedAt))
        .length || 0,
    confirmedCount:
      schedule.assignments?.filter(
        (assignment) => assignment.confirmationStatus === "CONFIRMED",
      ).length || 0,
    currentUserAssignment: currentUserAssignment
      ? {
          id: currentUserAssignment.id,
          viewedAt: currentUserAssignment.viewedAt,
          confirmationStatus: currentUserAssignment.confirmationStatus,
          confirmedAt: currentUserAssignment.confirmedAt,
        }
      : null,
    mediaItems:
      schedule.mediaItems?.map((item) => ({
        id: item.mediaItem.id,
        title: item.mediaItem.title,
        category: item.mediaItem.category,
        url: item.mediaItem.url,
        metadata: item.mediaItem.metadata,
      })) || [],
    canManage: canManageSchedule(schedule),
    volunteers:
      schedule.assignments?.map((assignment) => ({
        initials: assignment.user.name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0].toUpperCase())
          .join(""),
      })) || [],
  };
};

const updateLocalAssignment = (
  scheduleId: string,
  assignment: NonNullable<DepartmentSchedule["assignments"]>[number],
) => {
  schedules.value = schedules.value.map((schedule) => {
    if (schedule.id !== scheduleId) return schedule;

    return {
      ...schedule,
      assignments: schedule.assignments?.map((item) =>
        item.id === assignment.id ? assignment : item,
      ),
    };
  });
};

const updateMyScheduleResponse = async (
  event: ScheduleEvent,
  action: "VIEWED" | "CONFIRMED" | "DECLINED" | "MAYBE" | "SWAP_REQUESTED",
  fallbackError: string,
) => {
  schedulesError.value = "";
  const { data, error } = await updateMyScheduleAssignment(event.id, {
    action,
  });

  if (error || !data) {
    schedulesError.value = error || fallbackError;
    return;
  }

  updateLocalAssignment(event.id, data);
};

const handleMarkScheduleViewed = async (event: ScheduleEvent) => {
  await updateMyScheduleResponse(
    event,
    "VIEWED",
    "Não foi possível marcar a escala como vista.",
  );
};

const handleConfirmSchedule = async (event: ScheduleEvent) => {
  await updateMyScheduleResponse(
    event,
    "CONFIRMED",
    "Não foi possível confirmar presença.",
  );
};

const handleDeclineSchedule = async (event: ScheduleEvent) => {
  await updateMyScheduleResponse(
    event,
    "DECLINED",
    "Não foi possível informar ausência.",
  );
};

const handleMaybeSchedule = async (event: ScheduleEvent) => {
  await updateMyScheduleResponse(
    event,
    "MAYBE",
    "Não foi possível marcar talvez.",
  );
};

const handleRequestSwap = async (event: ScheduleEvent) => {
  await updateMyScheduleResponse(
    event,
    "SWAP_REQUESTED",
    "Não foi possível pedir troca.",
  );
};

const loadDepartments = async () => {
  const { data } = await getDepartments();
  departments.value = data ?? [];
};

const loadSchedules = async () => {
  schedulesError.value = "";
  const { data, error } = await getChurchSchedules();

  if (error) {
    schedulesError.value = error;
    return;
  }

  schedules.value = data ?? [];
};

const focusScheduleFromRoute = async () => {
  const scheduleId =
    typeof route.query.schedule === "string" ? route.query.schedule : "";

  if (!scheduleId) {
    focusedScheduleId.value = "";
    return;
  }

  const schedule = schedules.value.find((item) => item.id === scheduleId);
  if (!schedule) return;

  focusedScheduleId.value = schedule.id;

  if (schedule.department?.name) {
    activeFilter.value = schedule.department.name;
  }

  await nextTick();
  document.getElementById(`schedule-${schedule.id}`)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

const loadMembers = async () => {
  const { data } = await getMembers();
  members.value = data ?? [];
};

const loadScheduleMediaItems = async (departmentId: string) => {
  if (!departmentId) return;

  const shouldLoadResources = !resourcesByDepartment.value[departmentId];
  const shouldLoadSongs = !songsByDepartment.value[departmentId];

  if (!shouldLoadResources && !shouldLoadSongs) return;

  const [resourcesResponse, songsResponse] = await Promise.all([
    shouldLoadResources
      ? getDepartmentResources(departmentId)
      : Promise.resolve({ data: resourcesByDepartment.value[departmentId] }),
    shouldLoadSongs
      ? getDepartmentSongs(departmentId)
      : Promise.resolve({ data: songsByDepartment.value[departmentId] }),
  ]);

  resourcesByDepartment.value = {
    ...resourcesByDepartment.value,
    [departmentId]: resourcesResponse.data ?? [],
  };
  songsByDepartment.value = {
    ...songsByDepartment.value,
    [departmentId]: songsResponse.data ?? [],
  };
};

const resetScheduleForm = () => {
  scheduleForm.title = "";
  scheduleForm.date = "";
  scheduleForm.time = "";
  scheduleForm.departmentId = "";
  scheduleForm.rehearsalDate = "";
  scheduleForm.rehearsalTime = "";
  scheduleForm.rehearsalNotes = "";
  scheduleForm.songIds = [];
  scheduleForm.resourceIds = [];
  editingScheduleId.value = "";
};

const closeScheduleDialog = () => {
  isScheduleDialogOpen.value = false;
  createScheduleError.value = "";
  resetScheduleForm();
};

const toDateInputValue = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const toTimeInputValue = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toTimeString().slice(0, 5);
};

const openScheduleEditDialog = async (event: ScheduleEvent) => {
  const schedule = schedules.value.find((item) => item.id === event.id);
  if (!schedule) return;

  isPrefillingScheduleForm.value = true;
  editingScheduleId.value = schedule.id;
  scheduleForm.title = schedule.description;
  scheduleForm.date = toDateInputValue(schedule.date);
  scheduleForm.time = toTimeInputValue(schedule.date);
  scheduleForm.departmentId = schedule.departmentId;
  scheduleForm.rehearsalDate = schedule.rehearsalAt
    ? toDateInputValue(schedule.rehearsalAt)
    : "";
  scheduleForm.rehearsalTime = schedule.rehearsalAt
    ? toTimeInputValue(schedule.rehearsalAt)
    : "";
  scheduleForm.rehearsalNotes = schedule.rehearsalNotes || "";
  await loadScheduleMediaItems(schedule.departmentId);
  scheduleForm.songIds =
    schedule.mediaItems
      ?.filter((item) => item.mediaItem.category === "MUSIC")
      .map((item) => item.mediaItemId) || [];
  scheduleForm.resourceIds =
    schedule.mediaItems
      ?.filter((item) => item.mediaItem.category !== "MUSIC")
      .map((item) => item.mediaItemId) || [];
  createScheduleError.value = "";
  isPrefillingScheduleForm.value = false;
  isScheduleDialogOpen.value = true;
};

const handleSaveSchedule = async () => {
  createScheduleError.value = "";
  const title = scheduleForm.title.trim();

  if (!title) {
    createScheduleError.value = "Informe o título da escala.";
    return;
  }

  if (!scheduleForm.date) {
    createScheduleError.value = "Informe a data da escala.";
    return;
  }

  if (!scheduleForm.departmentId) {
    createScheduleError.value = "Escolha o ministério da escala.";
    return;
  }

  isCreatingSchedule.value = true;

  const { data, error } = editingScheduleId.value
    ? await updateChurchSchedule(editingScheduleId.value, {
        title,
        date: scheduleForm.date,
        time: scheduleForm.time || undefined,
        departmentId: scheduleForm.departmentId,
        rehearsalDate: scheduleForm.rehearsalDate || null,
        rehearsalTime: scheduleForm.rehearsalTime || null,
        rehearsalNotes: scheduleForm.rehearsalNotes || null,
        songIds: scheduleForm.songIds,
        resourceIds: scheduleForm.resourceIds,
      })
    : await createChurchSchedule({
        title,
        date: scheduleForm.date,
        time: scheduleForm.time || undefined,
        departmentId: scheduleForm.departmentId,
        rehearsalDate: scheduleForm.rehearsalDate || null,
        rehearsalTime: scheduleForm.rehearsalTime || null,
        rehearsalNotes: scheduleForm.rehearsalNotes || null,
        songIds: scheduleForm.songIds,
        resourceIds: scheduleForm.resourceIds,
      });

  isCreatingSchedule.value = false;

  if (error || !data) {
    createScheduleError.value = error || "Não foi possível criar a escala.";
    return;
  }

  const nextSchedules = editingScheduleId.value
    ? schedules.value.map((schedule) => (schedule.id === data.id ? data : schedule))
    : [...schedules.value, data];

  schedules.value = nextSchedules.sort(
    (current, next) =>
      new Date(current.date).getTime() - new Date(next.date).getTime(),
  );
  closeScheduleDialog();
};

const handleDeleteSchedule = (event: ScheduleEvent) => {
  pendingDeleteSchedule.value = event;
};

const closeDeleteScheduleDialog = () => {
  if (!isDeletingSchedule.value) {
    pendingDeleteSchedule.value = null;
  }
};

const confirmDeleteSchedule = async () => {
  if (!pendingDeleteSchedule.value) return;

  schedulesError.value = "";
  isDeletingSchedule.value = true;
  const scheduleId = pendingDeleteSchedule.value.id;
  const { error } = await deleteChurchSchedule(scheduleId);
  isDeletingSchedule.value = false;

  if (error) {
    schedulesError.value = error;
    return;
  }

  schedules.value = schedules.value.filter((schedule) => schedule.id !== scheduleId);
  pendingDeleteSchedule.value = null;
};

const getSelectedScheduleDate = () => {
  const schedule = selectedSchedule.value;
  if (!schedule) return "";

  return toDateInputValue(schedule.date);
};

const getAssignmentWarning = (userId: string) => {
  const selectedDate = getSelectedScheduleDate();
  if (!selectedDate) return "";

  const member = members.value.find((item) => item.id === userId);

  if (member?.unavailableDates?.includes(selectedDate)) {
    return "Indisponível";
  }

  const hasConflict = schedules.value.some((schedule) => {
    if (schedule.id === selectedScheduleId.value) return false;
    if (toDateInputValue(schedule.date) !== selectedDate) return false;

    return schedule.assignments?.some((assignment) => assignment.userId === userId);
  });

  return hasConflict ? "Conflito" : "";
};

const openAssignmentsDialog = (event: ScheduleEvent) => {
  const schedule = schedules.value.find((item) => item.id === event.id);
  if (!schedule) return;

  selectedScheduleId.value = schedule.id;
  assignmentsError.value = "";
  assignmentForm.userId = "";
  assignmentForm.role = "";
  draftAssignments.value =
    schedule.assignments?.map((assignment) => ({
      assignmentId: assignment.id,
      userId: assignment.userId,
      name: assignment.user.name,
      role: assignment.role,
      viewedAt: assignment.viewedAt,
      confirmationStatus: assignment.confirmationStatus,
      attendanceStatus: assignment.attendanceStatus,
      warning: getAssignmentWarning(assignment.userId),
    })) || [];
  isAssignmentsDialogOpen.value = true;
};

const closeAssignmentsDialog = () => {
  isAssignmentsDialogOpen.value = false;
  selectedScheduleId.value = "";
  assignmentsError.value = "";
  assignmentForm.userId = "";
  assignmentForm.role = "";
  draftAssignments.value = [];
};

const addDraftAssignment = () => {
  assignmentsError.value = "";

  if (!assignmentForm.userId) {
    assignmentsError.value = "Escolha um voluntário.";
    return;
  }

  if (draftAssignments.value.some((item) => item.userId === assignmentForm.userId)) {
    assignmentsError.value = "Esse voluntário já está nesta escala.";
    return;
  }

  const member = members.value.find((item) => item.id === assignmentForm.userId);
  if (!member) return;

  draftAssignments.value = [
    ...draftAssignments.value,
    {
      userId: member.id,
      name: member.name,
      role: assignmentForm.role.trim() || "Voluntário",
      viewedAt: null,
      confirmationStatus: "PENDING",
      attendanceStatus: "PENDING",
      warning: getAssignmentWarning(member.id),
    },
  ];
  assignmentForm.userId = "";
  assignmentForm.role = "";
};

const removeDraftAssignment = (userId: string) => {
  draftAssignments.value = draftAssignments.value.filter(
    (assignment) => assignment.userId !== userId,
  );
};

const markAttendance = async (
  assignment: {
    assignmentId?: string;
    userId: string;
  },
  attendanceStatus: "PRESENT" | "ABSENT",
) => {
  if (!selectedScheduleId.value || !assignment.assignmentId) {
    assignmentsError.value = "Salve os voluntários antes de marcar presença.";
    return;
  }

  assignmentsError.value = "";
  const { data, error } = await updateScheduleAssignmentAttendance(
    selectedScheduleId.value,
    assignment.assignmentId,
    { attendanceStatus },
  );

  if (error || !data) {
    assignmentsError.value = error || "Não foi possível marcar presença.";
    return;
  }

  updateLocalAssignment(selectedScheduleId.value, data);
  draftAssignments.value = draftAssignments.value.map((item) =>
    item.assignmentId === data.id
      ? {
          ...item,
          attendanceStatus: data.attendanceStatus,
        }
      : item,
  );
};

const saveAssignments = async () => {
  assignmentsError.value = "";

  if (!selectedScheduleId.value) {
    assignmentsError.value = "Escala não encontrada.";
    return;
  }

  isSavingAssignments.value = true;

  const { data, error } = await updateScheduleAssignments(
    selectedScheduleId.value,
    {
      assignments: draftAssignments.value.map((assignment) => ({
        userId: assignment.userId,
        role: assignment.role,
      })),
    },
  );

  isSavingAssignments.value = false;

  if (error || !data) {
    assignmentsError.value = error || "Não foi possível salvar os voluntários.";
    return;
  }

  schedules.value = schedules.value.map((schedule) =>
    schedule.id === data.id ? data : schedule,
  );
  closeAssignmentsDialog();
};

onMounted(async () => {
  await Promise.all([loadDepartments(), loadSchedules(), loadMembers()]);
  await focusScheduleFromRoute();
});

watch(
  () => route.query.schedule,
  async () => {
    await focusScheduleFromRoute();
  },
);

watch(
  () => scheduleForm.departmentId,
  async (departmentId, previousDepartmentId) => {
    if (isPrefillingScheduleForm.value) return;

    if (departmentId) {
      await loadScheduleMediaItems(departmentId);
    }

    if (departmentId !== previousDepartmentId) {
      scheduleForm.songIds = [];
      scheduleForm.resourceIds = [];
    }
  },
);

watch(schedules, async () => {
  if (focusedScheduleId.value) return;
  await focusScheduleFromRoute();
});
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}

.gap-2 {
  gap: 8px;
}

.filter-strip {
  position: relative;
  margin-right: -16px;
  margin-left: -16px;
}

.filter-strip::before,
.filter-strip::after {
  position: absolute;
  top: 0;
  bottom: 4px;
  z-index: 1;
  width: 18px;
  pointer-events: none;
  content: "";
}

.filter-strip::before {
  left: 0;
  background: linear-gradient(90deg, #f5f5f5 0%, rgba(245, 245, 245, 0) 100%);
}

.filter-strip::after {
  right: 0;
  background: linear-gradient(270deg, #f5f5f5 0%, rgba(245, 245, 245, 0) 100%);
}

.filter-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px 6px;
  scroll-padding-inline: 16px;
}

.filter-chip {
  flex: 0 0 auto;
  max-width: min(64vw, 220px);
  height: 34px !important;
  padding-inline: 14px !important;
  font-weight: 700;
}

.filter-chip-label {
  display: block;
  min-width: 0;
  overflow: hidden;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cursor-pointer {
  cursor: pointer;
}

.leader-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.leader-summary-card {
  border: 1px solid #f3f4f6;
  border-radius: 8px !important;
}

.scale-input :deep(.v-field) {
  border-radius: 14px;
}

.scale-input :deep(.v-field__input) {
  min-height: 48px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.scale-field-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.dialog-actions .v-btn {
  min-width: 112px;
}

@media (min-width: 560px) {
  .scale-field-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .filter-strip {
    margin-right: -12px;
    margin-left: -12px;
  }

  .filter-scroll {
    gap: 6px;
    padding-right: 12px;
    padding-left: 12px;
    scroll-padding-inline: 12px;
  }

  .filter-chip {
    max-width: 58vw;
    height: 32px !important;
    padding-inline: 12px !important;
    font-size: 0.78rem;
  }

  .dialog-actions .v-btn {
    flex: 1 1 100%;
  }

  .leader-summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
