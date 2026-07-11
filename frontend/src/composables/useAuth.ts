import { ref } from 'vue'

const isAuthenticated = ref(localStorage.getItem('admin_auth') === 'true')

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'boda2026'

export function useAuth() {
  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      isAuthenticated.value = true
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('admin_auth')
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
}
