import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useRecursoStore = defineStore('recurso', {
  state: () => ({
    recursos: [],
    loading: false
  }),
  actions: {
    async fetchRecursos() {
      this.loading = true
      try {
        const resp = await api.get('Recurso')
        this.recursos = resp.data || []
        this.loading = false
        return { ok: true }
      } catch (err) {
        this.loading = false
        return { ok: false, error: err?.response?.data || err.message }
      }
    }
  }
})
