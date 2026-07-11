<template>
  <section class="rsvp-section">
    <h2>Confirma tu Asistencia</h2>
    <p class="rsvp-subtitle">Nos encantaría contar con tu presencia</p>

    <form @submit.prevent="submit" class="rsvp-form">
      <div class="form-group">
        <label>Código de invitado</label>
        <input v-model="form.guestToken" type="text" placeholder="Ingresa tu código" required />
      </div>

      <div class="checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.attendCeremony" />
          <span>Asistiré a la ceremonia</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.attendCelebration" />
          <span>Asistiré a la celebración</span>
        </label>
      </div>

      <div class="form-group">
        <label>Número de invitados</label>
        <input v-model.number="form.numberOfGuests" type="number" min="1" max="10" required />
      </div>

      <div class="form-group">
        <label>¿Qué música no debe faltar?</label>
        <input v-model="form.musicSuggestion" type="text" placeholder="Artista - Canción" />
      </div>

      <div class="form-group">
        <label>Mensaje para los novios</label>
        <textarea v-model="form.message" rows="3" placeholder="Opcional"></textarea>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Enviando...' : 'Confirmar asistencia' }}
      </button>

      <p v-if="success" class="message success">¡Gracias! Tu confirmación ha sido registrada.</p>
      <p v-if="error" class="message error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { api } from '@/api/api'

const form = reactive({
  guestToken: '',
  attendCeremony: false,
  attendCelebration: false,
  numberOfGuests: 1,
  musicSuggestion: '',
  message: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const submit = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    await api.createRsvp({
      guestToken: form.guestToken.trim(),
      attendCeremony: form.attendCeremony,
      attendCelebration: form.attendCelebration,
      numberOfGuests: form.numberOfGuests,
      musicSuggestion: form.musicSuggestion,
      message: form.message,
    })
    success.value = true
    form.guestToken = ''
    form.attendCeremony = false
    form.attendCelebration = false
    form.numberOfGuests = 1
    form.musicSuggestion = ''
    form.message = ''
  } catch (e: any) {
    error.value = e.message || 'Error al enviar la confirmación'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.rsvp-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  background-color: #EBE7E5;
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #2b1c43;
  margin-bottom: 0.5rem;
}

.rsvp-subtitle {
  text-align: center;
  color: #80849E;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2b1c43;
}

.form-group input,
.form-group textarea {
  padding: 0.65rem;
  border: 1px solid #C2B8E3;
  border-radius: 4px;
  background: white;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: #2b1c43;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #A0B1E3;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #2b1c43;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: #80849E;
}

button {
  padding: 0.85rem;
  background-color: #80849E;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Lato', sans-serif;
}

button:hover:not(:disabled) {
  background-color: #2b1c43;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  text-align: center;
  font-size: 0.95rem;
}

.success {
  color: #2b1c43;
}

.error {
  color: #c0392b;
}
</style>
