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

      <div class="form-row">
        <div class="form-group">
          <label>Cédula</label>
          <input v-model="form.bankAccountId" type="text" />
        </div>
        <div class="form-group">
          <label>Correo electrónico</label>
          <input v-model="form.bankAccountEmail" type="email" />
        </div>
      </div>

      <div class="events-divider"><h3>Ceremonia</h3></div>
      <div class="form-row">
        <div class="form-group">
          <label>Hora de la ceremonia</label>
          <input v-model="form.ceremonyTime" type="time" />
        </div>
        <div class="form-group">
          <label>Lugar del Evento</label>
          <input v-model="form.ceremonyLocation" type="text" />
        </div>
      </div>
      <div class="form-group">
        <label>Dirección del Evento</label>
        <input v-model="form.ceremonyAddress" type="text" />
      </div>
      <div class="form-group">
        <label>Google Maps URL (Evento)</label>
        <input v-model="form.ceremonyMapsUrl" type="url" />
      </div>

      <div class="events-divider"><h3>Celebración</h3></div>
      <div class="form-row">
        <div class="form-group">
          <label>Hora de la celebración</label>
          <input v-model="form.celebrationTime" type="time" />
        </div>
      </div>

      <div class="events-divider"><h3>Recordatorio</h3></div>
      <div class="form-group">
        <label>Google Calendar URL (Recordatorio)</label>
        <input v-model="form.calendarUrl" type="url" />
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
  bankAccountId: '',
  bankAccountEmail: '',
  ceremonyTime: '',
  ceremonyLocation: '',
  ceremonyAddress: '',
  ceremonyMapsUrl: '',
  celebrationTime: '',
  celebrationLocation: '',
  celebrationAddress: '',
  celebrationMapsUrl: '',
  calendarUrl: '',
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
    form.bankAccountId = s.bankAccountId || ''
    form.bankAccountEmail = s.bankAccountEmail || ''
    form.ceremonyTime = s.ceremonyTime || ''
    form.ceremonyLocation = s.ceremonyLocation || ''
    form.ceremonyAddress = s.ceremonyAddress || ''
    form.ceremonyMapsUrl = s.ceremonyMapsUrl || ''
    form.celebrationTime = s.celebrationTime || ''
    form.celebrationLocation = s.celebrationLocation || ''
    form.celebrationAddress = s.celebrationAddress || ''
    form.celebrationMapsUrl = s.celebrationMapsUrl || ''
    form.calendarUrl = s.calendarUrl || ''
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
      bankAccountId: form.bankAccountId,
      bankAccountEmail: form.bankAccountEmail,
      ceremonyTime: form.ceremonyTime,
      ceremonyLocation: form.ceremonyLocation,
      ceremonyAddress: form.ceremonyAddress,
      ceremonyMapsUrl: form.ceremonyMapsUrl,
      celebrationTime: form.celebrationTime,
      celebrationLocation: form.celebrationLocation,
      celebrationAddress: form.celebrationAddress,
      celebrationMapsUrl: form.celebrationMapsUrl,
      calendarUrl: form.calendarUrl,
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
  background: var(--color-white);
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

h2 {
  font-family: var(--font-display);
  color: var(--color-sage);
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

.events-divider {
  margin-top: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-lavender-soft);
}

.events-divider h3 {
  font-family: var(--font-display);
  color: var(--color-sage);
  font-size: 1.1rem;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-sage-light);
  font-family: var(--font-body);
}

.form-group input {
  padding: 0.7rem;
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: var(--font-body);
  color: var(--color-sage);
  background: var(--color-white);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-lavender-light);
  box-shadow: 0 0 0 3px rgba(192, 184, 227, 0.2);
}

button {
  align-self: flex-start;
  padding: 0.7rem 1.5rem;
  background-color: var(--color-sage);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-family: var(--font-body);
  transition: background 0.2s ease, transform 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: var(--color-sage-dark);
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  font-size: 0.95rem;
  margin: 0;
}

.success {
  color: var(--color-sage);
}

.error {
  color: var(--color-error);
}

@media (max-width: 640px) {
  .admin-section {
    padding: 1.25rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
