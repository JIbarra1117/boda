<template>
  <div class="admin-section">
    <div class="section-intro">
      <h2>Gestión de Invitados</h2>
      <p class="hint">Agrega, edita o elimina invitados. Cada uno recibe un código único para confirmar su asistencia.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="guest-form">
      <div class="form-row">
        <div class="form-group">
          <label for="fullName">Nombre completo</label>
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            placeholder="Ej. Familia López"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="opcional"
          />
        </div>

        <div class="form-group">
          <label for="phone">Teléfono</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="opcional"
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Guardando...' : editingId ? 'Actualizar invitado' : 'Agregar invitado' }}
        </button>
        <button
          v-if="editingId"
          type="button"
          class="btn-secondary"
          @click="resetForm"
          :disabled="loading"
        >
          Cancelar
        </button>
      </div>

      <p v-if="success" class="message success">{{ success }}</p>
      <p v-if="error" class="message error">{{ error }}</p>
    </form>

    <div class="bulk-upload-section">
      <h3>Carga masiva desde Excel</h3>
      <p class="hint">
        Subí un archivo Excel (.xlsx) con las columnas:
        <code>fullName</code>, <code>email</code>, <code>phone</code>.
        La primera fila debe ser el encabezado.
      </p>

      <div class="file-upload">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          @change="handleExcelUpload"
          ref="excelInput"
        />
      </div>

      <div v-if="excelPreview.length > 0" class="excel-preview">
        <h4>Vista previa ({{ excelPreview.length }} invitados)</h4>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in excelPreview.slice(0, 5)" :key="index">
                <td>{{ row.fullName }}</td>
                <td>{{ row.email || '—' }}</td>
                <td>{{ row.phone || '—' }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="excelPreview.length > 5" class="preview-more">
            ... y {{ excelPreview.length - 5 }} más
          </p>
        </div>

        <button
          class="btn-primary"
          @click="uploadBulk"
          :disabled="bulkLoading"
        >
          {{ bulkLoading ? 'Cargando...' : `Cargar ${excelPreview.length} invitados` }}
        </button>
      </div>

      <p v-if="bulkSuccess" class="message success">{{ bulkSuccess }}</p>
      <div v-if="bulkErrors.length > 0" class="bulk-errors">
        <p class="message error">Algunos invitados no se pudieron cargar:</p>
        <ul>
          <li v-for="(err, index) in bulkErrors" :key="index">
            Fila {{ err.row }}: {{ err.fullName || 'Sin nombre' }} — {{ err.error }}
          </li>
        </ul>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Invitado</th>
            <th>Estado</th>
            <th>Código</th>
            <th>Corto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in guests" :key="guest.id">
            <td>
              <div class="guest-name">{{ guest.fullName }}</div>
              <div v-if="guest.email || guest.phone" class="guest-contact">
                {{ guest.email }}<span v-if="guest.email && guest.phone"> · </span>{{ guest.phone }}
              </div>
            </td>
            <td>
              <span class="badge" :class="guest.hasRsvp ? 'yes' : 'pending'">
                {{ guest.hasRsvp ? 'Confirmado' : 'Pendiente' }}
              </span>
            </td>
            <td>
              <code class="token">{{ guest.token }}</code>
            </td>
            <td>
              <code v-if="guest.code" class="token short">{{ guest.code }}</code>
              <span v-else class="token">—</span>
            </td>
            <td>
              <div class="row-actions">
                <button class="icon-btn" @click="editGuest(guest)" title="Editar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="icon-btn" @click="openQr(guest)" title="Ver QR">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button class="icon-btn danger" @click="deleteGuest(guest.id)" title="Eliminar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="guests.length === 0">
            <td colspan="5" class="empty">Aún no hay invitados registrados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bulk-actions">
      <button class="btn-primary" @click="downloadAll" :disabled="downloadingAll || guests.length === 0">
        {{ downloadingAll ? 'Generando imágenes...' : 'Descargar todos los QRs' }}
      </button>
    </div>

    <Teleport to="body">
      <div v-if="selectedGuest" class="qr-modal-overlay" @click.self="selectedGuest = null">
        <div class="qr-modal">
          <button class="qr-modal-close" @click="selectedGuest = null" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <GuestQrCard :guest="selectedGuest" :base-url="baseUrl" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { api } from '@/api/api'
import GuestQrCard from './GuestQrCard.vue'
import { generateGuestQrPng, getBaseUrl } from '@/composables/useGuestQr'
import type { Guest } from '@/types'

const guests = ref<Guest[]>([])
const loading = ref(false)
const success = ref('')
const error = ref('')
const editingId = ref<number | null>(null)
const selectedGuest = ref<Guest | null>(null)
const downloadingAll = ref(false)
const baseUrl = getBaseUrl()

const excelInput = ref<HTMLInputElement | null>(null)
const excelPreview = ref<{ fullName: string; email: string; phone: string }[]>([])
const bulkLoading = ref(false)
const bulkSuccess = ref('')
const bulkErrors = ref<{ row: number; fullName: string; error: string }[]>([])

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
})

const loadGuests = async () => {
  try {
    guests.value = await api.getGuests()
  } catch (e: any) {
    error.value = e.message || 'Error al cargar invitados'
  }
}

const handleSubmit = async () => {
  loading.value = true
  success.value = ''
  error.value = ''

  try {
    if (editingId.value) {
      await api.updateGuest(editingId.value, {
        fullName: form.fullName,
        email: form.email || undefined,
        phone: form.phone || undefined,
      })
      success.value = 'Invitado actualizado correctamente'
    } else {
      await api.createGuest({
        fullName: form.fullName,
        email: form.email || undefined,
        phone: form.phone || undefined,
      })
      success.value = 'Invitado agregado correctamente'
    }
    resetForm()
    await loadGuests()
  } catch (e: any) {
    error.value = e.message || 'Error al guardar el invitado'
  } finally {
    loading.value = false
  }
}

const editGuest = (guest: Guest) => {
  editingId.value = guest.id
  form.fullName = guest.fullName
  form.email = guest.email || ''
  form.phone = guest.phone || ''
}

const deleteGuest = async (id: number) => {
  if (!confirm('¿Eliminar este invitado? Esta acción no se puede deshacer.')) return

  try {
    await api.deleteGuest(id)
    await loadGuests()
    success.value = 'Invitado eliminado'
  } catch (e: any) {
    error.value = e.message || 'Error al eliminar el invitado'
  }
}

const resetForm = () => {
  editingId.value = null
  form.fullName = ''
  form.email = ''
  form.phone = ''
  success.value = ''
  error.value = ''
}

const openQr = (guest: Guest) => {
  selectedGuest.value = guest
}

const decodeBytes = (bytes: Uint8Array): string => {
  // Intentar UTF-8 primero
  const utf8 = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  // Si el resultado tiene secuencias tÃ­picas de mojibake, probar Latin-1
  if (utf8.includes('Ã') || utf8.includes('Â')) {
    try {
      const latin1 = new TextDecoder('iso-8859-1', { fatal: true }).decode(bytes)
      return latin1
    } catch {
      return utf8
    }
  }
  return utf8
}

const handleExcelUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  bulkSuccess.value = ''
  bulkErrors.value = []

  const isCsv = file.name.toLowerCase().endsWith('.csv')

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      let workbook: XLSX.WorkBook

      if (isCsv) {
        const bytes = new Uint8Array(e.target?.result as ArrayBuffer)
        const text = decodeBytes(bytes)
        workbook = XLSX.read(text, { type: 'string' })
      } else {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        workbook = XLSX.read(data, { type: 'array' })
      }

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

      if (json.length < 2) {
        error.value = 'El archivo parece estar vacío o no tiene encabezados'
        return
      }

      const headers = json[0].map((h) => String(h).toLowerCase().trim())
      const nameIndex = headers.indexOf('fullname')
      const emailIndex = headers.indexOf('email')
      const phoneIndex = headers.indexOf('phone')
      if (nameIndex === -1) {
        error.value = 'El archivo debe tener la columna fullName'
        return
      }

      const parsed: { fullName: string; email: string; phone: string }[] = []

      for (let i = 1; i < json.length; i++) {
        const row = json[i]
        const fullName = String(row[nameIndex] || '').trim()
        if (!fullName) continue

        parsed.push({
          fullName,
          email: emailIndex >= 0 ? String(row[emailIndex] || '').trim() : '',
          phone: phoneIndex >= 0 ? String(row[phoneIndex] || '').trim() : '',
        })
      }

      excelPreview.value = parsed
      success.value = `${parsed.length} invitados listos para cargar`
    } catch (e: any) {
      error.value = 'Error al leer el archivo Excel'
    }
  }
  reader.readAsArrayBuffer(file)
}

const uploadBulk = async () => {
  if (excelPreview.value.length === 0) return

  bulkLoading.value = true
  bulkSuccess.value = ''
  bulkErrors.value = []
  success.value = ''
  error.value = ''

  try {
    const response = await api.createGuestsBulk(excelPreview.value)
    bulkSuccess.value = `Se cargaron ${response.created} invitados correctamente`
    if (response.errors && response.errors.length > 0) {
      bulkErrors.value = response.errors
    }
    excelPreview.value = []
    if (excelInput.value) excelInput.value.value = ''
    await loadGuests()
  } catch (e: any) {
    error.value = e.message || 'Error al cargar invitados masivamente'
  } finally {
    bulkLoading.value = false
  }
}

const downloadAll = async () => {
  if (guests.value.length === 0) return
  downloadingAll.value = true
  success.value = ''
  error.value = ''

  try {
    const zip = new JSZip()
    const folder = zip.folder('invitaciones-qr')

    for (const guest of guests.value) {
      const blob = await generateGuestQrPng(guest, baseUrl)
      const fileName = `invitacion-${guest.fullName.toLowerCase().replace(/\s+/g, '-')}.png`
      folder?.file(fileName, blob)
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'invitaciones-karen-jorge.zip')
    success.value = 'ZIP descargado correctamente'
  } catch (e: any) {
    error.value = e.message || 'Error al generar los QRs'
  } finally {
    downloadingAll.value = false
  }
}

onMounted(loadGuests)
</script>

<style scoped>
.admin-section {
  background: var(--color-white);
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.section-intro {
  margin-bottom: 1.5rem;
}

.section-intro h2 {
  font-family: var(--font-display);
  color: var(--color-sage);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.hint {
  color: var(--color-sage-light);
  font-size: 0.9rem;
  margin: 0;
}

.guest-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-sage-light);
  font-family: var(--font-body);
}

.form-group input {
  padding: 0.7rem;
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: var(--font-body);
  color: var(--color-sage);
  background: var(--color-white);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-lavender-light);
  box-shadow: 0 0 0 3px rgba(192, 184, 227, 0.2);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-family: var(--font-body);
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

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-lavender-soft);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  font-size: 0.95rem;
  margin: 0;
}

.success {
  color: var(--color-sage);
}

.error {
  color: var(--color-error);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-sand);
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: var(--color-white);
  min-width: 700px;
}

th,
td {
  padding: 0.875rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-sand);
}

th {
  background-color: #f5f3f8;
  color: var(--color-sage);
  font-family: var(--font-body);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

tr:nth-child(even) {
  background-color: var(--bg-secondary);
}

tr:hover {
  background-color: #f9f7fc;
}

.guest-name {
  font-weight: 600;
  color: var(--color-sage);
}

.guest-contact {
  font-size: 0.8rem;
  color: var(--color-sage-light);
  margin-top: 0.2rem;
}

.token {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 0.75rem;
  color: var(--color-sage-light);
  background: var(--bg-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.token.short {
  color: var(--color-sage);
  background: rgba(194, 184, 227, 0.25);
  font-weight: 700;
  letter-spacing: 0.05em;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.badge.yes {
  background-color: var(--color-sage);
  color: var(--color-white);
}

.badge.pending {
  background-color: var(--color-sand);
  color: var(--color-sage-light);
}

.row-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-sand);
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-sage-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  color: var(--color-sage);
  border-color: var(--color-lavender-soft);
  background: var(--bg-secondary);
}

.icon-btn.danger:hover {
  color: var(--color-error);
  border-color: var(--color-error);
  background: #fdf2f2;
}

.icon-btn svg {
  width: 14px;
  height: 14px;
}

.empty {
  text-align: center;
  color: var(--color-sage-light);
  padding: 2rem;
  font-style: italic;
}

.bulk-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.qr-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 17, 41, 0.65);
  backdrop-filter: blur(4px);
  padding: 1rem;
}

.qr-modal {
  position: relative;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  max-width: 420px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.qr-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 1px solid var(--color-sand);
  border-radius: 50%;
  color: var(--color-sage-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.qr-modal-close:hover {
  color: var(--color-sage);
  background: var(--color-sand);
}

.qr-modal-close svg {
  width: 16px;
  height: 16px;
}

.bulk-upload-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-lavender-soft);
}

.bulk-upload-section h3 {
  font-family: var(--font-display);
  color: var(--color-sage);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.bulk-upload-section .hint code {
  background: rgba(194, 184, 227, 0.25);
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-sm);
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 0.85em;
}

.file-upload {
  margin: 1rem 0;
}

.file-upload input[type='file'] {
  padding: 0.5rem;
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-sage);
  font-family: var(--font-body);
  width: 100%;
}

.excel-preview {
  margin-top: 1rem;
}

.excel-preview h4 {
  color: var(--color-sage);
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.preview-more {
  text-align: center;
  color: var(--color-sage-light);
  font-size: 0.85rem;
  padding: 0.5rem;
  margin: 0;
}

.bulk-errors {
  margin-top: 1rem;
}

.bulk-errors ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  font-size: 0.9rem;
  color: var(--color-error);
}

.bulk-errors li {
  margin-bottom: 0.25rem;
}

@media (max-width: 640px) {
  .admin-section {
    padding: 1.25rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  th,
  td {
    padding: 0.75rem;
  }
}
</style>
