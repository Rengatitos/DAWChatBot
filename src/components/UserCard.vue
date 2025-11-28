<template>
  <div class="user-card">
    <div class="avatar">{{ initials }}</div>
    <div class="info">
      <div class="name">{{ user.nombre || user.name }}</div>
      <div class="email">{{ user.correo || user.email }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ user: { type: Object, required: true } })
const initials = (props.user && props.user.nombre) ? props.user.nombre.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase() : 'U'
</script>

<style scoped lang="scss">
@import 'src/styles/palette.scss';
.user-card { display:flex; gap:10px; align-items:center }
.avatar { width:40px; height:40px; border-radius:12px; background:$blue-soft; color:white; display:flex; align-items:center; justify-content:center; font-weight:600 }
.info .name { font-weight:600 }
.info .email { font-size:12px; opacity:0.8 }
</style>
