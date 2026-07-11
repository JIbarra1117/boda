<template>
  <div class="qr-card">
    <a
      :href="inviteUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="qr-link"
      :title="`Abrir invitación de ${guest.fullName}`"
    >
      <canvas ref="canvasRef" width="480" height="480" class="qr-canvas"></canvas>
    </a>
    <div class="qr-actions">
      <button class="btn-primary" @click="download" :disabled="!ready">
        Descargar imagen
      </button>
      <a
        :href="inviteUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-secondary"
      >
        Abrir invitación
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { drawGuestQr } from '@/composables/useGuestQr'
import type { Guest } from '@/types'

const props = defineProps<{
  guest: Guest
  baseUrl: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)

const inviteUrl = `${props.baseUrl}?guest=${props.guest.token}`

const drawCard = async () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  await drawGuestQr(ctx, props.guest, props.baseUrl, canvas.width)
  ready.value = true
}

const download = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const link = document.createElement('a')
  link.download = `invitacion-${props.guest.fullName.toLowerCase().replace(/\s+/g, '-')}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

onMounted(drawCard)
watch(() => props.guest, drawCard, { deep: true })
watch(() => props.baseUrl, drawCard)

defineExpose({ download })
</script>

<style scoped>
.qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-canvas {
  width: 100%;
  max-width: 360px;
  height: auto;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.qr-link {
  display: block;
  text-decoration: none;
  line-height: 0;
  transition: transform 0.3s ease;
}

.qr-link:hover {
  transform: scale(1.02);
}

.qr-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-family: var(--font-body);
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn-primary {
  background-color: var(--color-sage);
  color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-sage-dark);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--color-sand);
  color: var(--color-sage);
}

.btn-secondary:hover {
  background-color: var(--color-lavender-soft);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
