<template>
  <div
    :class="['bubble', from === 'user' ? 'user-bubble' : 'bot-bubble']"
  >
    <div class="text">{{ text }}</div>
    <div class="time">{{ timeFormatted }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { from, text, time } = defineProps({
  from: String,
  text: String,
  time: String
});

const timeFormatted = computed(() => {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
});
</script>

<style scoped>
.bubble {
  max-width: 75%;
  padding: 10px 14px;
  margin: 6px 0;
  border-radius: 14px;
  font-size: 0.95rem;
}

.user-bubble {
  background: #a5d8ff;
  margin-left: auto;
}

.bot-bubble {
  background: #e6e9f5;
  margin-right: auto;
}

.time {
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 2px;
  text-align: right;
}
</style>
