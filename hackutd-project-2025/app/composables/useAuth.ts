import { ref } from 'vue'

// Simple auth state management
const isAuthenticated = ref(false)
const currentUser = ref<{ name: string; email: string } | null>(null)

export const useAuth = () => {
  // Check if user is logged in (from localStorage)
  const checkAuth = () => {
    if (process.client) {
      const auth = localStorage.getItem('isAuthenticated')
      const user = localStorage.getItem('currentUser')
      
      if (auth === 'true' && user) {
        isAuthenticated.value = true
        currentUser.value = JSON.parse(user)
      }
    }
  }

  // Login function
  const login = (email: string, password: string): boolean => {
    // Simple mock authentication - accept any email/password for demo
    if (email && password) {
      isAuthenticated.value = true
      currentUser.value = {
        name: email.split('@')[0],
        email: email
      }
      
      if (process.client) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      }
      
      return true
    }
    return false
  }

  // Logout function
  const logout = () => {
    isAuthenticated.value = false
    currentUser.value = null
    
    if (process.client) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('currentUser')
    }
  }

  return {
    isAuthenticated,
    currentUser,
    checkAuth,
    login,
    logout
  }
}

