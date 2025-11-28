<template>
  <div class="loader" v-if="visible">
    <div class="dot" />
    <div class="dot" />
    <div class="dot" />
  </div>
</template>

<script setup>
const { visible } = defineProps({ visible: { type: Boolean, default: true } })
</script>

<style scoped lang="scss">
.loader { display:flex; gap:6px; align-items:center }
.dot { width:8px; height:8px; background:#6aa5d9; border-radius:50%; animation: blink 1s infinite }
.dot:nth-child(2) { animation-delay: .15s }
.dot:nth-child(3) { animation-delay: .3s }
@keyframes blink { 0%,100%{opacity:0.3}50%{opacity:1} }
</style>
