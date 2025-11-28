<template>
  <q-page class="pa-md">
    <h3>Actividades</h3>
    <div class="grid">
      <div v-for="act in actividades" :key="act.id" class="actividad-card">
        <div class="head"><strong>{{ act.titulo }}</strong> <span class="badge">{{ act.estado }}</span></div>
        <p>{{ act.descripcion }}</p>
        <div class="meta">Tipo: {{ act.tipo }} • Inicio: {{ formatoFecha(act.fechaInicio) }}</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useActividadStore } from 'src/stores/actividadStore'
import { useAuthStore } from 'src/stores/authStore'

const actividad = useActividadStore()
const auth = useAuthStore()

onMounted(async () => {
  const userId = auth.user?.id || auth.user?._id
  if (userId) await actividad.fetchActividades(userId)
})

const actividades = computed(() => actividad.actividades)

function formatoFecha(s) {
  if (!s) return ''
  try { return new Date(s).toLocaleDateString() } catch { return s }
}
</script>

<style scoped lang="scss">
@import 'src/styles/palette.scss';
.grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap:12px }
.actividad-card { background:white; padding:12px; border-radius:12px; box-shadow:0 6px 18px rgba(11,37,64,0.04) }
.head { display:flex; justify-content:space-between; align-items:center }
.badge { background:$blue-light; padding:4px 8px; border-radius:10px; font-size:12px }
.meta { font-size:12px; opacity:0.8 }
</style>
