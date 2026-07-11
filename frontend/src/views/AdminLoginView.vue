<template>
  <div class="login-page">
    <div class="login-box">
      <h1>Panel de Administración</h1>
      <form @submit.prevent="handleLogin">
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit">Entrar</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const password = ref('')
const error = ref('')
const router = useRouter()
const { login } = useAuth()

const handleLogin = () => {
  error.value = ''
  const success = login(password.value)
  if (success) {
    router.push('/admin')
  } else {
    error.value = 'Contraseña incorrecta'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EBE7E5;
}

.login-box {
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #2b1c43;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #C2B8E3;
  border-radius: 4px;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #80849E;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2b1c43;
}

.error {
  color: #c0392b;
  text-align: center;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}
</style>
