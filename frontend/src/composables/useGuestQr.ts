import QRCode from 'qrcode'
import type { Guest } from '@/types'

const QR_COLOR = '#000000'
const QR_BG = '#FFFFFF'
const QR_MARGIN = 20
const MODULE_RADIUS_RATIO = 0.35

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
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export const drawGuestQr = async (
  ctx: CanvasRenderingContext2D,
  guest: Guest,
  baseUrl: string,
  size: number = 400
) => {
  const inviteUrl = `${baseUrl}?guest=${guest.code || guest.token}`

  // Generar matriz del QR
  const qr = (QRCode as any).create(inviteUrl, { errorCorrectionLevel: 'H' })
  const moduleCount = qr.modules.size
  const moduleSize = (size - 2 * QR_MARGIN) / moduleCount
  const radius = Math.max(1, moduleSize * MODULE_RADIUS_RATIO)

  // Fondo blanco
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = QR_BG
  ctx.fillRect(0, 0, size, size)

  // Dibujar cada módulo negro con esquinas redondeadas
  ctx.fillStyle = QR_COLOR
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.modules.get(row, col)) {
        const x = QR_MARGIN + col * moduleSize
        const y = QR_MARGIN + row * moduleSize
        drawRoundedRect(ctx, x, y, moduleSize, moduleSize, radius)
        ctx.fill()
      }
    }
  }
}

export const generateGuestQrPng = async (
  guest: Guest,
  baseUrl: string
): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 400

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo obtener el contexto del canvas')

  await drawGuestQr(ctx, guest, baseUrl, canvas.width)

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
