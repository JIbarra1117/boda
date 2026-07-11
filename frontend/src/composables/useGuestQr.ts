import QRCode from 'qrcode'
import type { Guest } from '@/types'

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

export const generateGuestQrPng = async (
  guest: Guest,
  baseUrl: string
): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 900

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo obtener el contexto del canvas')

  const width = canvas.width
  const height = canvas.height

  // Fondo
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#FAF8F5')
  gradient.addColorStop(0.5, '#FFFFFF')
  gradient.addColorStop(1, '#F3EFE9')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Marco
  ctx.strokeStyle = 'rgba(194, 184, 227, 0.6)'
  ctx.lineWidth = 3
  drawRoundedRect(ctx, 30, 30, width - 60, height - 60, 32)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(194, 184, 227, 0.3)'
  ctx.lineWidth = 1
  drawRoundedRect(ctx, 42, 42, width - 84, height - 84, 24)
  ctx.stroke()

  // Nombres
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

  // Nombre
  ctx.fillStyle = '#2b1c43'
  ctx.font = '500 42px "Playfair Display", "Cormorant Garamond", serif'
  wrapText(ctx, guest.fullName, width / 2, 280, 480, 50)

  // QR
  const inviteUrl = `${baseUrl}?guest=${guest.token}`
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
  await new Promise<void>((resolve) => (qrImage.onload = () => resolve()))

  ctx.fillStyle = '#FFFFFF'
  drawRoundedRect(ctx, width / 2 - 175, 380, 350, 350, 24)
  ctx.fill()

  ctx.drawImage(qrImage, width / 2 - 160, 395, 320, 320)

  // Instrucciones
  ctx.fillStyle = '#6d5f82'
  ctx.font = '400 20px "Lato", sans-serif'
  ctx.fillText('Escanea para abrir tu invitación', width / 2, 790)

  // Código
  ctx.fillStyle = '#80849E'
  ctx.font = '600 16px "Lato", sans-serif'
  ctx.fillText('O ingresa este código:', width / 2, 830)

  ctx.fillStyle = '#2b1c43'
  ctx.font = '28px "SF Mono", Monaco, "Cascadia Code", monospace'
  ctx.fillText(guest.code || guest.token, width / 2, 865)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else throw new Error('Error al generar la imagen')
    }, 'image/png')
  })
}

export const getBaseUrl = () => {
  return window.location.origin
}
