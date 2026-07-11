<template>
  <div class="qr-card">
    <a
      :href="inviteUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="qr-link"
      :title="`Abrir invitación de ${guest.fullName}`"
    >
      <canvas ref="canvasRef" width="600" height="900" class="qr-canvas"></canvas>
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
import QRCode from 'qrcode'
import type { Guest } from '@/types'

const props = defineProps<{
  guest: Guest
  baseUrl: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)

const inviteUrl = `${props.baseUrl}?guest=${props.guest.token}`

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

const drawCard = async () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  // Fondo crema suave
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#FAF8F5')
  gradient.addColorStop(0.5, '#FFFFFF')
  gradient.addColorStop(1, '#F3EFE9')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Marco decorativo
  ctx.strokeStyle = 'rgba(194, 184, 227, 0.6)'
  ctx.lineWidth = 3
  drawRoundedRect(ctx, 30, 30, width - 60, height - 60, 32)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(194, 184, 227, 0.3)'
  ctx.lineWidth = 1
  drawRoundedRect(ctx, 42, 42, width - 84, height - 84, 24)
  ctx.stroke()

  // Nombres de los novios
  ctx.fillStyle = '#2b1c43'
  ctx.font = 'italic 500 46px "Playfair Display", "Cormorant Garamond", serif'
  ctx.textAlign = 'center'
  ctx.fillText('Karen & Jorge', width / 2, 130)

  // Línea decorativa
  ctx.strokeStyle = '#C2B8E3'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 80, 155)
  ctx.lineTo(width / 2 + 80, 155)
  ctx.stroke()

  // Etiqueta
  ctx.fillStyle = '#6d5f82'
  ctx.font = '600 18px "Lato", sans-serif'
  ctx.fillText('INVITACIÓN PARA', width / 2, 215)

  // Nombre del invitado
  ctx.fillStyle = '#2b1c43'
  ctx.font = '500 42px "Playfair Display", "Cormorant Garamond", serif'
  wrapText(ctx, props.guest.fullName, width / 2, 280, 480, 50)

  // Generar QR
  const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
    width: 320,
    margin: 2,
    color: {
      dark: '#2b1c43',
      light: '#FFFFFF',
    },
  })

  const qrImage = new Image()
  qrImage.src = qrDataUrl
  await new Promise((resolve) => (qrImage.onload = resolve))

  // Fondo blanco del QR
  ctx.fillStyle = '#FFFFFF'
  drawRoundedRect(ctx, width / 2 - 175, 380, 350, 350, 24)
  ctx.fill()

  ctx.drawImage(qrImage, width / 2 - 160, 395, 320, 320)

  // Instrucciones
  ctx.fillStyle = '#6d5f82'
  ctx.font = '400 20px "Lato", sans-serif'
  ctx.fillText('Escanea para abrir tu invitación', width / 2, 790)

  // Código para ingreso manual
  ctx.fillStyle = '#80849E'
  ctx.font = '600 16px "Lato", sans-serif'
  ctx.fillText('O ingresa este código:', width / 2, 830)

  ctx.fillStyle = '#2b1c43'
  ctx.font = '28px "SF Mono", Monaco, "Cascadia Code", monospace'
  ctx.fillText(props.guest.code || props.guest.token, width / 2, 865)

  ready.value = true
}

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.split(' ')
  let line = ''
  let currentY = y

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currentY)
      line = words[i] + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, currentY)
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
