<template>
  <section id="rsvp" class="rsvp-section">
    <div class="rsvp-content">
      <div class="section-header" ref="elementRef" :class="{ 'is-visible': isVisible }">
        <span class="section-label">Reserva tu lugar</span>
        <h2 class="section-title">Confirma tu Asistencia</h2>
        <p class="section-subtitle">Tu presencia es el mejor regalo que podemos recibir</p>
      </div>

      <div class="rsvp-card" ref="elementRef2" :class="{ 'is-visible': isVisible2 }">
        <Transition name="fade" mode="out-in">
          <div v-if="success || identifiedGuest?.hasRsvp" class="success-state" key="success">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h3>¡Gracias!</h3>
            <p v-if="success">Tu confirmación ha sido registrada con éxito. Nos encantará verte en nuestro gran día.</p>
            <p v-else>Ya confirmaste tu asistencia. Nos encantará verte en nuestro gran día.</p>
            <button class="btn-secondary" @click="resetForAnotherGuest">Confirmar otro invitado</button>
          </div>

          <form v-else @submit.prevent="submit" class="rsvp-form" key="form">
            <template v-if="identifiedGuest">
              <div class="guest-welcome">
                <span class="welcome-label">Confirmando como</span>
                <span class="welcome-name">{{ identifiedGuest.fullName }}</span>
              </div>

              <div class="form-group attendance-group">
                <label>¿A qué eventos asistirás?</label>
                <div class="checkbox-group">
                  <label class="switch-card" :class="{ checked: form.attendCeremony }">
                    <div class="switch-text">
                      <strong>Ceremonia</strong>
                      <small>Donde diremos "sí, acepto"</small>
                    </div>
                    <div class="switch-toggle">
                      <input type="checkbox" v-model="form.attendCeremony" />
                      <span class="slider"></span>
                    </div>
                  </label>

                  <label class="switch-card" :class="{ checked: form.attendCelebration }">
                    <div class="switch-text">
                      <strong>Celebración</strong>
                      <small>Para bailar y festejar juntos</small>
                    </div>
                    <div class="switch-toggle">
                      <input type="checkbox" v-model="form.attendCelebration" />
                      <span class="slider"></span>
                    </div>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label for="musicSuggestion">¿Qué música no debe faltar?</label>
                <input
                  id="musicSuggestion"
                  v-model="form.musicSuggestion"
                  type="text"
                  placeholder="Artista - Canción"
                />
              </div>

              <div class="form-group">
                <label for="message">Mensaje para los novios</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="4"
                  placeholder="Déjanos un mensaje de amor y buenos deseos..."
                ></textarea>
              </div>

              <button type="submit" class="btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                <span>{{ loading ? 'Enviando...' : 'Confirmar asistencia' }}</span>
              </button>

              <p v-if="error" class="message error">{{ error }}</p>
            </template>

            <div v-else class="guest-hint">
              <p>Para confirmar tu asistencia, ingresa a tu invitación desde el enlace o QR que recibiste.</p>
            </div>
          </form>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { api } from '@/api/api'
import { useScrollReveal } from '@/composables/useScrollReveal'
import type { RsvpPayload, Guest } from '@/types'

const props = defineProps<{
  guest?: Guest | null
}>()

const emit = defineEmits<{
  'guest-identified': [guest: Guest | null]
}>()

const { elementRef, isVisible } = useScrollReveal()
const { elementRef: elementRef2, isVisible: isVisible2 } = useScrollReveal()

const form = reactive<RsvpPayload>({
  guestToken: props.guest?.token || '',
  attendCeremony: false,
  attendCelebration: false,
  musicSuggestion: '',
  message: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')
const identifiedGuest = ref<Guest | null>(props.guest || null)
const identifying = ref(false)
const notFound = ref(false)
let identifyTimeout: ReturnType<typeof setTimeout> | null = null

const submit = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    await api.createRsvp({
      guestToken: form.guestToken.trim(),
      attendCeremony: form.attendCeremony,
      attendCelebration: form.attendCelebration,
      musicSuggestion: form.musicSuggestion,
      message: form.message,
    })
    success.value = true
    if (identifiedGuest.value) {
      identifiedGuest.value.hasRsvp = true
    }
    resetFormValues()
  } catch (e: any) {
    error.value = e.message || 'Error al enviar la confirmación. Por favor intentá de nuevo.'
  } finally {
    loading.value = false
  }
}

const resetFormValues = () => {
  form.guestToken = props.guest?.token || ''
  form.attendCeremony = false
  form.attendCelebration = false
  form.musicSuggestion = ''
  form.message = ''
}

watch(() => props.guest, (guest) => {
  if (guest && !success.value) {
    form.guestToken = guest.token
    identifiedGuest.value = guest
  }
}, { immediate: true })

watch(() => form.guestToken, (token) => {
  if (identifyTimeout) clearTimeout(identifyTimeout)
  notFound.value = false

  const trimmed = token.trim()
  if (!trimmed) {
    identifiedGuest.value = null
    emit('guest-identified', null)
    return
  }

  identifying.value = true
  identifyTimeout = setTimeout(async () => {
    try {
      const guest = await api.getGuestByToken(trimmed)
      identifiedGuest.value = guest
      emit('guest-identified', guest)
      notFound.value = false
    } catch {
      identifiedGuest.value = null
      emit('guest-identified', null)
      notFound.value = true
    } finally {
      identifying.value = false
    }
  }, 400)
})

const resetForAnotherGuest = () => {
  success.value = false
  error.value = ''
  form.guestToken = ''
  identifiedGuest.value = null
  emit('guest-identified', null)
}
</script>

<style scoped>
.rsvp-section {
  padding: var(--space-24) var(--space-6);
  background: var(--bg-secondary);
}

.rsvp-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-10);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.section-header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--text-secondary);
  margin: 0;
}

.rsvp-card {
  background: var(--color-white);
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  box-shadow: var(--shadow-lg);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.rsvp-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  font-weight: 700;
}

.form-group input,
.form-group textarea {
  padding: var(--space-4);
  border: 1px solid var(--color-sand);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-dark);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-lavender-soft);
  box-shadow: 0 0 0 3px rgba(192, 184, 227, 0.15);
}

.input-hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-style: italic;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.switch-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--color-sand);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.switch-card:hover {
  border-color: var(--color-lavender-soft);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.switch-card.checked {
  border-color: var(--text-accent);
  background: rgba(160, 177, 227, 0.05);
}

.switch-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.switch-text strong {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: 700;
}

.switch-text small {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.switch-toggle {
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.switch-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-sand);
  transition: .3s ease;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s ease;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .slider {
  background-color: var(--text-accent);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  background: var(--text-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all var(--transition-fast);
  margin-top: var(--space-2);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-sage-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  display: inline-block;
  padding: var(--space-3) var(--space-6);
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--text-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all var(--transition-fast);
  margin-top: var(--space-4);
}

.btn-secondary:hover {
  background: var(--text-primary);
  color: var(--color-white);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--color-white);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

.message {
  text-align: center;
  font-size: var(--text-sm);
  padding: var(--space-3);
  border-radius: var(--radius-md);
}

.message.error {
  color: var(--color-error);
  background: rgba(184, 92, 92, 0.08);
}

.success-state {
  text-align: center;
  padding: var(--space-8) var(--space-4);
}

.success-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto var(--space-6);
  background: var(--color-success);
  color: var(--color-white);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  width: 36px;
  height: 36px;
}

.success-state h3 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.success-state p {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
}

.guest-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  margin-bottom: var(--space-6);
  padding: var(--space-4) var(--space-6);
  background: linear-gradient(135deg, rgba(194, 184, 227, 0.2) 0%, rgba(232, 213, 196, 0.2) 100%);
  border: 1px solid rgba(194, 184, 227, 0.4);
  border-radius: var(--radius-xl);
  text-align: center;
}

.welcome-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.welcome-name {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--text-primary);
}

.welcome-passes {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.guest-not-found {
  margin-bottom: var(--space-6);
  padding: var(--space-4);
  background: rgba(184, 92, 92, 0.08);
  border: 1px solid rgba(184, 92, 92, 0.2);
  border-radius: var(--radius-lg);
  color: var(--color-error);
  font-size: var(--text-sm);
  text-align: center;
}

.guest-hint {
  padding: var(--space-8) var(--space-4);
  text-align: center;
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  line-height: 1.6;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
  }

  .rsvp-card {
    padding: var(--space-6) var(--space-4);
  }
}
</style>
