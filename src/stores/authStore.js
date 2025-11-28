// src/stores/authStore.js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { authRepository } from 'src/repositories/auth.repository'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    dashboardData: null,
    isAuthenticated: false
  }),

  actions: {
    async login(correo, password) {
      try {
        const response = await api.post('/Usuario/login', {
          correo,
          password
        })

        const { usuario, token } = response.data

        this.user = usuario
        this.token = token
        this.isAuthenticated = true

        // Intentar obtener sala y asesor asignado usando el Repository
        try {
          this.dashboardData = await authRepository.getDashboardData({ usuario, token })
          // persistir por si se rehidrata
          localStorage.setItem('dashboardData', JSON.stringify(this.dashboardData))
        } catch (e) {
          console.warn('No se pudo obtener dashboardData tras login:', e)
          this.dashboardData = null
        }

        localStorage.setItem('user', JSON.stringify(usuario))
        localStorage.setItem('token', token)

        return { ok: true, user: usuario }

      } catch (error) {
        console.error(error)
        return {
          ok: false,
          error: error.response?.data?.message || 'Credenciales incorrectas'
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.dashboardData = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('dashboardData')
    }
  },

  getters: {
    isAdmin(state) {
      return state.user?.rol === 'Administrador'
    },
    isEmpleadoOnboarding(state) {
      return state.user?.rol === 'Empleado Onboarding'
    }
  }
})
