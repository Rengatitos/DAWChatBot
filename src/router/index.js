import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/authStore'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER ? createMemoryHistory : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    // Rehydration is handled by boot; allow pages to decide behavior.
    // Authorization for admin route: redirect to '/' if unauthorized.
    if (to.path === '/admin') {
      if (!auth.user || !auth.user.rol || !auth.user.rol.toLowerCase().includes('admin')) {
        return next('/')
      }
    }
    next()
  })

  return Router
})
