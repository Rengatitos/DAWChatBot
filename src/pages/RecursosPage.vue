<template>
  <q-page class="pa-md">
    <h3>Recursos</h3>
    <div class="grid">
      <div v-for="r in recursos" :key="r.id" class="recurso-card">
        <div class="desc">{{ r.descripcion }}</div>
        <div class="meta">Tipo: {{ r.tipo }} • Subido: {{ formatoFecha(r.fechaSubida) }}</div>
        <div class="actions"><a :href="r.link" target="_blank" rel="noopener">Abrir</a></div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRecursoStore } from 'src/stores/recursoStore'

const recurso = useRecursoStore()

onMounted(async () => {
  await recurso.fetchRecursos()
})

const recursos = computed(() => recurso.recursos)

function formatoFecha(s) { if (!s) return ''; try { return new Date(s).toLocaleDateString() } catch { return s } }
</script>

<style scoped lang="scss">
@import 'src/styles/palette.scss';
.grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap:12px }
.recurso-card { background:white; padding:12px; border-radius:12px; box-shadow:0 6px 18px rgba(11,37,64,0.04) }
.desc { font-weight:600 }
.meta { font-size:12px; opacity:0.8 }
.actions { margin-top:8px }
.actions a { background:$blue-main; color:white; padding:6px 10px; border-radius:8px; text-decoration:none }
</style>
