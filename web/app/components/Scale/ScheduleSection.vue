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
          @mark-viewed="$emit('mark-viewed', $event)"
          @confirm-presence="$emit('confirm-presence', $event)"
          @decline-presence="$emit('decline-presence', $event)"
          @maybe-presence="$emit('maybe-presence', $event)"
          @request-swap="$emit('request-swap', $event)"
        />
      </div>
    </UtilsTitle>
  </div>
</template>

<script setup>
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
