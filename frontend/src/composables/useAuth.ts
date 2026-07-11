import { ref } from 'vue'

const isAuthenticated = ref(localStorage.getItem('admin_auth') === 'true')

export function useAuth() {
  const login = (password: string) => {
    if (password === 'boda2026') {
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
