import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/authStore'

export default boot(({ router }) => {
  const auth = useAuthStore()
  try {
    auth.rehydrate()
  } catch {
    // ignore
  }

  // If user is already authenticated and is on /login, redirect according to role
  if (router && auth.isAuthenticated) {
    const cur = router.currentRoute.value
    if (cur && cur.path === '/login') {
      if (auth.isEmpleadoOnboarding) {
        router.replace('/chat').catch(() => {})
      } else if (auth.isAdmin) {
        router.replace('/admin').catch(() => {})
      } else {
        router.replace('/').catch(() => {})
      }
    }
  }
})
