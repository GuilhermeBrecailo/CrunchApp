<template>
  <div class="song-text-renderer" :class="rendererClasses">
    <span
      v-for="(line, lineIndex) in renderedLines"
      :key="lineIndex"
      class="song-line"
    ><span
      v-for="(segment, segmentIndex) in line"
      :key="segmentIndex"
      :class="`song-${segment.type}`"
    >{{ segment.text }}</span></span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string | null;
    mode?: "lyrics" | "chords";
    emptyText?: string;
    dense?: boolean;
  }>(),
  {
    text: "",
    mode: "lyrics",
    emptyText: "",
    dense: false,
  },
);

type SongSegment = {
  text: string;
  type: "lyric" | "chord" | "section";
};

const chordTokenRegex =
  /^[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|sus[0-9]|add[0-9]|[0-9]|M|maj7|dim7|aug7)*(?:\([^)]+\))?(?:\/[A-G](?:#|b)?)?$/;

const rendererClasses = computed(() => ({
  "song-text-renderer--chords": props.mode === "chords",
  "song-text-renderer--lyrics": props.mode !== "chords",
  "song-text-renderer--dense": props.dense,
}));

const isChordToken = (token: string) => {
  const cleanToken = token.replace(/[()[\],.;:]+$/g, "").replace(/^[()[\],.;:]+/g, "");
  return chordTokenRegex.test(cleanToken);
};

const isTabLine = (line: string) =>
  /^\s*[EADGB][|:]/i.test(line) || /\|[-0-9hpsbr~/\\x]+\|?/.test(line);

const tokenizeChordLine = (line: string): SongSegment[] => {
  if (!line) return [{ text: "\u00a0", type: "lyric" }];
  if (isTabLine(line)) return [{ text: line, type: "lyric" }];

  const parts = line.match(/\[[^\]]+\]|\s+|[^\s]+/g) || [line];

  return parts.map((part) => {
    if (/^\s+$/.test(part)) return { text: part, type: "lyric" };
    if (/^\[[^\]]+\]$/.test(part)) return { text: part, type: "section" };
    if (isChordToken(part)) return { text: part, type: "chord" };
    return { text: part, type: "lyric" };
  });
};

const renderedLines = computed(() => {
  const value = props.text?.length ? props.text : props.emptyText;
  const lines = (value || "").split("\n");

  return lines.map((line) =>
    props.mode === "chords"
      ? tokenizeChordLine(line)
      : [{ text: line || "\u00a0", type: "lyric" }],
  );
});
</script>

<style scoped>
.song-text-renderer {
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  background: #ffffff;
  color: #111111;
  font-family: "Courier New", "Roboto Mono", monospace;
  font-size: 0.95rem;
  line-height: 1.75;
  margin: 0;
  min-height: 180px;
  overflow-x: auto;
  overflow-y: auto;
  padding: 14px;
  tab-size: 4;
}

.song-text-renderer--chords {
  white-space: pre;
}

.song-text-renderer--lyrics {
  color: #1f2937;
  font-family: inherit;
  white-space: pre-wrap;
}

.song-text-renderer--dense {
  font-size: 0.9rem;
  line-height: 1.6;
  min-height: 120px;
  padding: 12px;
}

.song-line {
  display: block;
  min-height: 1.75em;
}

.song-lyric {
  color: inherit;
  font-weight: 500;
}

.song-section {
  color: #111827;
  font-weight: 800;
}

.song-chord {
  color: #ea580c;
  font-weight: 900;
}
</style>
