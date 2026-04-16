<template>
  <div class="pa-4 pb-8 bg-grey-lighten-4">
    <v-card class="scale-card rounded-xl pa-5 mb-8 elevation-4">
      <div class="circle-decoration top-right"></div>
      <div class="circle-decoration bottom-left"></div>

      <div class="position-relative" style="z-index: 1">
        <p class="text-subtitle-2 text-white opacity-80 mb-1">
          Minha Próxima Escala
        </p>
        <h2 class="text-h6 font-weight-bold text-white mb-5">
          Culto Especial de Louvor
        </h2>

        <div class="d-flex align-center mb-3 text-white">
          <div class="icon-wrapper mr-3">
            <Calendar size="16" />
          </div>
          <span class="text-body-2 font-weight-medium"
            >sábado, 25 de abril</span
          >
        </div>

        <div class="d-flex align-center mb-3 text-white">
          <div class="icon-wrapper mr-3">
            <Clock size="16" />
          </div>
          <span class="text-body-2 font-weight-medium">19:00</span>
        </div>

        <div class="d-flex align-center text-white">
          <div class="icon-wrapper mr-3">
            <Users size="16" />
          </div>
          <span class="text-body-2 font-weight-medium">Louvor</span>
        </div>
      </div>
    </v-card>

    <div class="mb-8">
      <h3 class="text-subtitle-1 font-weight-bold mb-3 text-grey-darken-4">
        Acesso Rápido
      </h3>
      <div class="d-flex gap-3 horizontal-scroll hide-scrollbar pb-2">
        <v-card
          color="white"
          min-width="100"
          class="rounded-xl pa-3 d-flex flex-column align-center justify-center flex-grow-1 elevation-1"
        >
          <v-avatar size="40" class="mb-2" color="#EEF2FF">
            <CalendarDays size="20" color="#6366F1" />
          </v-avatar>
          <span class="quick-access-label">Escalas</span>
        </v-card>

        <v-card
          color="white"
          min-width="100"
          class="rounded-xl pa-3 d-flex flex-column align-center justify-center flex-grow-1 elevation-1"
        >
          <v-avatar size="40" class="mb-2" color="#FAF5FF">
            <Music size="20" color="#A855F7" />
          </v-avatar>
          <span class="quick-access-label">Músicas</span>
        </v-card>

        <v-card
          color="white"
          min-width="100"
          class="rounded-xl pa-3 d-flex flex-column align-center justify-center flex-grow-1 elevation-1"
        >
          <v-avatar size="40" class="mb-2" color="#F0FDFA">
            <Users size="20" color="#14B8A6" />
          </v-avatar>
          <span class="quick-access-label">Membros</span>
        </v-card>

        <v-card
          color="white"
          min-width="100"
          class="rounded-xl pa-3 d-flex flex-column align-center justify-center flex-grow-1 elevation-1"
        >
          <v-avatar size="40" class="mb-2" color="#FEFCE8">
            <BookOpen size="20" color="#EAB308" />
          </v-avatar>
          <span class="quick-access-label">Devocionais</span>
        </v-card>
      </div>
    </div>

    <div>
      <div class="d-flex justify-space-between align-center mb-3">
        <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-0">
          Próximos Cultos
        </h3>
        <a
          href="#"
          class="text-caption text-primary text-decoration-none d-flex align-center font-weight-medium"
        >
          Ver todos <ChevronRight size="14" class="ml-1" />
        </a>
      </div>

      <div class="d-flex flex-column gap-3 pb-4">
        <v-card
          color="white"
          class="rounded-xl pa-3 d-flex align-center elevation-1 flex-shrink-0"
        >
          <div
            class="date-badge rounded-lg d-flex flex-column align-center justify-center mr-4"
          >
            <span class="date-day font-weight-bold">25</span>
            <span class="date-month font-weight-bold text-uppercase">ABR</span>
          </div>
          <div class="flex-grow-1">
            <p class="text-subtitle-2 font-weight-bold mb-0 text-grey-darken-4">
              Culto Especial de Louvor
            </p>
            <p class="text-caption text-grey-darken-1 mb-0">
              Louvor &bull; 19:00
            </p>
          </div>
          <ChevronRight size="20" color="#9CA3AF" />
        </v-card>

        <v-card
          color="white"
          class="rounded-xl pa-3 d-flex align-center elevation-1 flex-shrink-0"
        >
          <div
            class="date-badge rounded-lg d-flex flex-column align-center justify-center mr-4"
          >
            <span class="date-day font-weight-bold">21</span>
            <span class="date-month font-weight-bold text-uppercase">ABR</span>
          </div>
          <div class="flex-grow-1">
            <p class="text-subtitle-2 font-weight-bold mb-0 text-grey-darken-4">
              Culto de Quarta
            </p>
            <p class="text-caption text-grey-darken-1 mb-0">
              Louvor &bull; 19:30
            </p>
          </div>
          <ChevronRight size="20" color="#9CA3AF" />
        </v-card>

        <v-card
          color="white"
          class="rounded-xl pa-3 d-flex align-center elevation-1 flex-shrink-0"
        >
          <div
            class="date-badge rounded-lg d-flex flex-column align-center justify-center mr-4"
          >
            <span class="date-day font-weight-bold">21</span>
            <span class="date-month font-weight-bold text-uppercase">ABR</span>
          </div>
          <div class="flex-grow-1">
            <p class="text-subtitle-2 font-weight-bold mb-0 text-grey-darken-4">
              Culto de Quarta
            </p>
            <p class="text-caption text-grey-darken-1 mb-0">
              Intercessão &bull; 19:00
            </p>
          </div>
          <ChevronRight size="20" color="#9CA3AF" />
        </v-card>

        <v-card
          color="white"
          class="rounded-xl pa-3 d-flex align-center elevation-1 flex-shrink-0"
        >
          <div
            class="date-badge rounded-lg d-flex flex-column align-center justify-center mr-4"
          >
            <span class="date-day font-weight-bold">28</span>
            <span class="date-month font-weight-bold text-uppercase">ABR</span>
          </div>
          <div class="flex-grow-1">
            <p class="text-subtitle-2 font-weight-bold mb-0 text-grey-darken-4">
              Culto de Domingo
            </p>
            <p class="text-caption text-grey-darken-1 mb-0">
              Celebração &bull; 18:00
            </p>
          </div>
          <ChevronRight size="20" color="#9CA3AF" />
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Calendar,
  Clock,
  Users,
  CalendarDays,
  Music,
  BookOpen,
  ChevronRight,
} from "lucide-vue-next";
</script>

<style scoped>
/* Estilo do Card Principal com Gradiente Roxo */
.scale-card {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
  position: relative;
  overflow: hidden;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.opacity-80 {
  opacity: 0.8;
}

/* Elementos Decorativos */
.circle-decoration {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
}

.circle-decoration.top-right {
  width: 150px;
  height: 150px;
  top: -40px;
  right: -30px;
}

.circle-decoration.bottom-left {
  width: 100px;
  height: 100px;
  bottom: -30px;
  left: -20px;
}

/* Scroll Horizontal (Acesso Rápido) - Mantido! */
.horizontal-scroll {
  overflow-x: auto;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
}

/* Ocultar a barra de rolagem mas manter a funcionalidade */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Espaçamentos e Utilitários */
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

/* Textos do Acesso Rápido */
.quick-access-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #1f2937;
}

/* Badge de Data (Próximos Cultos) */
.date-badge {
  width: 48px;
  height: 48px;
  background-color: #f3e8ff;
  color: #7c3aed;
}

.date-day {
  font-size: 1rem;
  line-height: 1;
}

.date-month {
  font-size: 0.55rem;
  line-height: 1;
  margin-top: 2px;
}
</style>
