import QRCode from 'qrcode'
import type { Guest } from '@/types'

const QR_SIZE = 400
const CANVAS_SIZE = 480
const LOGO_SIZE = 130
const LOGO_RADIUS = 16
const QR_RADIUS = 24

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

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

const drawQrOnCanvas = async (
  ctx: CanvasRenderingContext2D,
  inviteUrl: string,
  color: string,
  x: number,
  y: number,
  size: number
) => {
  const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
    width: size,
    margin: 0,
    color: {
      dark: color,
      light: '#FFFFFF00',
    },
  })

  const qrImage = new Image()
  qrImage.src = qrDataUrl
  await new Promise<void>((resolve) => (qrImage.onload = () => resolve()))
  ctx.drawImage(qrImage, x, y, size, size)
}

export const drawGuestQr = async (
  ctx: CanvasRenderingContext2D,
  guest: Guest,
  baseUrl: string,
  size: number = CANVAS_SIZE
) => {
  const padding = (size - QR_SIZE) / 2
  const qrX = padding
  const qrY = padding

  // Fondo transparente
  ctx.clearRect(0, 0, size, size)

  // Fondo blanco del QR con esquinas redondeadas
  ctx.fillStyle = '#FFFFFF'
  drawRoundedRect(ctx, qrX, qrY, QR_SIZE, QR_SIZE, QR_RADIUS)
  ctx.fill()

  // Gradient dorado de fondo
  ctx.save()
  drawRoundedRect(ctx, qrX, qrY, QR_SIZE, QR_SIZE, QR_RADIUS)
  ctx.clip()
  const gradient = ctx.createLinearGradient(qrX, qrY, qrX + QR_SIZE, qrY + QR_SIZE)
  gradient.addColorStop(0, '#B8860B')
  gradient.addColorStop(0.5, '#D4AF37')
  gradient.addColorStop(1, '#F0C674')
  ctx.fillStyle = gradient
  ctx.fillRect(qrX, qrY, QR_SIZE, QR_SIZE)
  ctx.restore()

  // QR en blanco encima del gradiente
  const inviteUrl = `${baseUrl}?guest=${guest.token}`
  ctx.save()
  drawRoundedRect(ctx, qrX, qrY, QR_SIZE, QR_SIZE, QR_RADIUS)
  ctx.clip()
  await drawQrOnCanvas(ctx, inviteUrl, '#FFFFFF', qrX, qrY, QR_SIZE)
  ctx.restore()

  // Logo en el centro
  try {
    const logo = await loadImage('/imgs/kj-transparent.png')
    const logoX = qrX + QR_SIZE / 2 - LOGO_SIZE / 2
    const logoY = qrY + QR_SIZE / 2 - LOGO_SIZE / 2

    ctx.fillStyle = '#FFFFFF'
    drawRoundedRect(ctx, logoX - 4, logoY - 4, LOGO_SIZE + 8, LOGO_SIZE + 8, LOGO_RADIUS)
    ctx.fill()

    ctx.save()
    drawRoundedRect(ctx, logoX, logoY, LOGO_SIZE, LOGO_SIZE, LOGO_RADIUS - 4)
    ctx.clip()
    ctx.drawImage(logo, logoX, logoY, LOGO_SIZE, LOGO_SIZE)
    ctx.restore()
  } catch {
    // Si el logo no carga, el QR sigue funcionando
  }
}

export const generateGuestQrPng = async (
  guest: Guest,
  baseUrl: string
): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo obtener el contexto del canvas')

  await drawGuestQr(ctx, guest, baseUrl, CANVAS_SIZE)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else throw new Error('Error al generar la imagen')
    }, 'image/png')
  })
}

export const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_APP_URL
  if (envUrl && typeof envUrl === 'string') {
    return envUrl.replace(/\/$/, '')
  }
  return window.location.origin
}
