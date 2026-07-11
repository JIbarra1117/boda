import QRCodeStyling from 'qr-code-styling'
import type { Guest } from '@/types'

const QR_SIZE = 800
const QR_MARGIN = 20
const QR_COLOR = '#2a1f03' // Dorado oscuro
const LOGO_PATH = '/imgs/kj-transparent.png'

const createQr = (data: string, size: number = QR_SIZE) => {
  return new (QRCodeStyling as any)({
    width: size,
    height: size,
    data,
    margin: QR_MARGIN,
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
    image: LOGO_PATH,
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 4,
      imageSize: 0.25,
      hideBackgroundDots: true,
    },
    dotsOptions: {
      color: QR_COLOR,
      type: 'rounded',
    },
    backgroundOptions: {
      color: '#FFFFFF',
    },
    cornersSquareOptions: {
      type: 'square',
    },
    cornersDotOptions: {
      type: 'square',
    },
  })
}

export const drawGuestQr = async (
  ctx: CanvasRenderingContext2D,
  guest: Guest,
  baseUrl: string,
  size: number = QR_SIZE
) => {
  const inviteUrl = `${baseUrl}?guest=${guest.code || guest.token}`
  const qr = createQr(inviteUrl, size)

  const blob = await qr.getRawData('png')
  if (!blob) throw new Error('Error al generar el QR')

  const dataUrl = URL.createObjectURL(blob as Blob)
  const img = new Image()
  img.src = dataUrl

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
  })

  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(img, 0, 0, size, size)
  URL.revokeObjectURL(dataUrl)
}

export const generateGuestQrPng = async (
  guest: Guest,
  baseUrl: string
): Promise<Blob> => {
  const inviteUrl = `${baseUrl}?guest=${guest.code || guest.token}`
  const qr = createQr(inviteUrl)
  const blob = await qr.getRawData('png')
  if (!blob) throw new Error('Error al generar el QR')
  return blob as Blob
}

export const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_APP_URL
  if (envUrl && typeof envUrl === 'string') {
    return envUrl.replace(/\/$/, '')
  }
  return window.location.origin
}
