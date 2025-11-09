export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server
  if (process.server) return

  const { isAuthenticated, checkAuth } = useAuth()
  
  // Check authentication status
  checkAuth()

  // If trying to access protected route and not authenticated
  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})

