import QRCode from 'qrcode'
import fs from 'fs'
const url = 'https://karenyjorge.jorgeibarra.dev?guest=ABC123'
const opts = {
  width: 600,
  margin: 0,
  errorCorrectionLevel: 'H',
  color: { dark: '#B8860B', light: '#FFFFFF00' }
}
const data = await QRCode.toDataURL(url, opts)
console.log('QR data URL length:', data.length)
fs.writeFileSync('qr-test.svg', await QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'H', margin: 0 }))
console.log('SVG saved to qr-test.svg')
