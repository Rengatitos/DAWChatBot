<template>
  <div class="chat-input row items-center">
    <q-input
      v-model="model"
      placeholder="Escribe tu mensaje..."
      outlined
      class="col-grow"
      @keyup.enter="emitSend"
    />
    <q-btn
      round
      color="primary"
      icon="send"
      :loading="loading"
      @click="emitSend"
      class="q-ml-sm"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const { loading } = defineProps({
  loading: Boolean
});

const emit = defineEmits(["send"]);

const model = ref("");

function emitSend() {
  const text = model.value.trim();
  if (!text) return;
  emit("send", text);
  model.value = "";
}
</script>

<style scoped>
.chat-input {
  padding-top: 8px;
}
</style>
