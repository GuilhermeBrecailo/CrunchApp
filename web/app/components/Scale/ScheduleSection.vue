<template>
  <div>
    <UtilsTitle :title="title">
      <div class="d-flex flex-column gap-3">
        <ScaleScheduleCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          :selected="event.id === selectedEventId"
          :can-manage="event.canManage"
          @add-volunteer="$emit('add-volunteer', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </UtilsTitle>
  </div>
</template>

<script setup>
defineEmits(["add-volunteer", "edit", "delete"]);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  events: {
    type: Array,
    required: true,
  },
  selectedEventId: {
    type: String,
    default: "",
  },
});
</script>
