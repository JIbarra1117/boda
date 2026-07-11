import QRCode from 'qrcode'
import type { Guest } from '@/types'

const QR_OPTIONS: QRCode.QRCodeToDataURLOptions = {
  width: 400,
  margin: 2,
  errorCorrectionLevel: 'H',
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export const drawGuestQr = async (
  ctx: CanvasRenderingContext2D,
  guest: Guest,
  baseUrl: string,
  size: number = 400
) => {
  const inviteUrl = `${baseUrl}?guest=${guest.code || guest.token}`
  const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
    ...QR_OPTIONS,
    width: size,
  })

  const qrImage = await loadImage(qrDataUrl)

  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(qrImage, 0, 0, size, size)
}

export const generateGuestQrPng = async (
  guest: Guest,
  baseUrl: string
): Promise<Blob> => {
  const inviteUrl = `${baseUrl}?guest=${guest.code || guest.token}`
  const dataUrl = await QRCode.toDataURL(inviteUrl, QR_OPTIONS)
  const res = await fetch(dataUrl)
  return res.blob()
}

export const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_APP_URL
  if (envUrl && typeof envUrl === 'string') {
    return envUrl.replace(/\/$/, '')
  }
  return window.location.origin
}
