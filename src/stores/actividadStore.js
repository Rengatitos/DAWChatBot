import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useActividadStore = defineStore('actividad', {
  state: () => ({
    actividades: [],
    loading: false
  }),
  actions: {
    async fetchActividades(usuarioRef) {
      this.loading = true
      try {
        const resp = await api.get(`Actividad/Usuario/${usuarioRef}`)
        this.actividades = resp.data || []
        this.loading = false
        return { ok: true }
      } catch (err) {
        this.loading = false
        return { ok: false, error: err?.response?.data || err.message }
      }
    }
  },
  getters: {
    pendientes: (state) => state.actividades.filter(a => a.estado === 'Pendiente'),
    enCurso: (state) => state.actividades.filter(a => a.estado === 'En curso' || a.estado === 'En curso'),
    completadas: (state) => state.actividades.filter(a => a.estado === 'Completado')
  }
})
