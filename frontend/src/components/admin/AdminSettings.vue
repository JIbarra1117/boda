<template>
  <div class="admin-section">
    <h2>Configuración General</h2>
    <form @submit.prevent="save" class="settings-form">
      <div class="form-row">
        <div class="form-group">
          <label>Fecha de la boda</label>
          <input v-model="form.weddingDate" type="date" required />
        </div>
        <div class="form-group">
          <label>Hora</label>
          <input v-model="form.weddingTime" type="time" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Nombre de la novia</label>
          <input v-model="form.brideName" type="text" required />
        </div>
        <div class="form-group">
          <label>Nombre del novio</label>
          <input v-model="form.groomName" type="text" required />
        </div>
      </div>

      <div class="form-group">
        <label>Banco</label>
        <input v-model="form.bankName" type="text" />
      </div>

      <div class="form-group">
        <label>Titular de la cuenta</label>
        <input v-model="form.bankAccountName" type="text" />
      </div>

      <div class="form-group">
        <label>Número de cuenta</label>
        <input v-model="form.bankAccountNumber" type="text" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Guardando...' : 'Guardar cambios' }}
      </button>

      <p v-if="success" class="message success">Configuración actualizada.</p>
      <p v-if="error" class="message error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { api } from '@/api/api'
import { parseWeddingDate } from '@/utils/date'

const form = reactive({
  weddingDate: '',
  weddingTime: '',
  brideName: '',
  groomName: '',
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const toInputDate = (iso: string) => {
  const d = parseWeddingDate(iso)
  if (!d) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(async () => {
  try {
    const s = await api.getSettings()
    form.weddingDate = toInputDate(s.weddingDate)
    form.weddingTime = s.weddingTime || ''
    form.brideName = s.brideName || ''
    form.groomName = s.groomName || ''
    form.bankName = s.bankName || ''
    form.bankAccountName = s.bankAccountName || ''
    form.bankAccountNumber = s.bankAccountNumber || ''
  } catch (e) {
    console.error(e)
  }
})

const save = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    await api.updateSettings({
      weddingDate: form.weddingDate,
      weddingTime: form.weddingTime,
      brideName: form.brideName,
      groomName: form.groomName,
      bankName: form.bankName,
      bankAccountName: form.bankAccountName,
      bankAccountNumber: form.bankAccountNumber,
    })
    success.value = true
  } catch (e: any) {
    error.value = e.message || 'Error al guardar'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

h2 {
  color: #2b1c43;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #80849E;
}

.form-group input {
  padding: 0.6rem;
  border: 1px solid #C2B8E3;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Lato', sans-serif;
  color: #2b1c43;
}

.form-group input:focus {
  outline: none;
  border-color: #A0B1E3;
}

button {
  align-self: flex-start;
  padding: 0.7rem 1.5rem;
  background-color: #80849E;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover:not(:disabled) {
  background-color: #2b1c43;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  font-size: 0.95rem;
}

.success {
  color: #2b1c43;
}

.error {
  color: #c0392b;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
