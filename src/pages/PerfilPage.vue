<template>
  <q-page class="pa-md">
    <h3>Perfil</h3>
    <div class="profile-card">
      <div><strong>Nombre:</strong> {{ user?.nombre }}</div>
      <div><strong>Correo:</strong> {{ user?.correo }}</div>
      <div><strong>Teléfono:</strong> {{ user?.telefono }}</div>
      <div><strong>Rol:</strong> {{ user?.rol }}</div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/authStore'
const auth = useAuthStore()
const user = auth.user
</script>

<style scoped lang="scss">
.profile-card { background:white; padding:16px; border-radius:12px; box-shadow:0 6px 18px rgba(11,37,64,0.04) }
</style>
