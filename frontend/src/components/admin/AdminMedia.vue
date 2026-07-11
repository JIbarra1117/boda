<template>
  <div class="admin-section">
    <h2>Gestor de Media</h2>
    <p class="hint">
      Sube las imágenes de infancia para los marcos Polaroid y la música de fondo.
    </p>

    <form @submit.prevent="upload" class="media-form">
      <div class="file-group">
        <label>Foto Karen de niña (Polaroid)</label>
        <input
          type="file"
          @change="handleFile($event, 'polaroidBrideImage')"
          accept="image/*"
        />
        <div v-if="previewBride" class="preview">
          <img :src="previewBride" alt="Preview Karen" />
        </div>
      </div>

      <div class="file-group">
        <label>Foto Jorge de niño (Polaroid)</label>
        <input
          type="file"
          @change="handleFile($event, 'polaroidGroomImage')"
          accept="image/*"
        />
        <div v-if="previewGroom" class="preview">
          <img :src="previewGroom" alt="Preview Jorge" />
        </div>
      </div>

      <div class="file-group">
        <label>Música de fondo (MP3)</label>
        <input
          type="file"
          @change="handleFile($event, 'backgroundMusic')"
          accept="audio/mpeg"
        />
        <p v-if="files.backgroundMusic" class="file-name">
          {{ files.backgroundMusic.name }}
        </p>
      </div>

      <button type="submit" :disabled="loading || !hasFiles">
        {{ loading ? 'Subiendo...' : 'Subir archivos' }}
      </button>

      <p v-if="success" class="message success">Archivos subidos correctamente.</p>
      <p v-if="error" class="message error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { api } from '@/api/api'

const files = reactive<{
  polaroidBrideImage: File | null
  polaroidGroomImage: File | null
  backgroundMusic: File | null
}>({
  polaroidBrideImage: null,
  polaroidGroomImage: null,
  backgroundMusic: null,
})

const previewBride = ref('')
const previewGroom = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const hasFiles = computed(() =>
  Boolean(files.polaroidBrideImage || files.polaroidGroomImage || files.backgroundMusic)
)

const handleFile = (event: Event, field: keyof typeof files) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  files[field] = file

  if (field === 'polaroidBrideImage' && file) {
    previewBride.value = URL.createObjectURL(file)
  }
  if (field === 'polaroidGroomImage' && file) {
    previewGroom.value = URL.createObjectURL(file)
  }
}

const upload = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  const formData = new FormData()
  if (files.polaroidBrideImage) formData.append('polaroidBrideImage', files.polaroidBrideImage)
  if (files.polaroidGroomImage) formData.append('polaroidGroomImage', files.polaroidGroomImage)
  if (files.backgroundMusic) formData.append('backgroundMusic', files.backgroundMusic)

  try {
    const res = await api.uploadMedia(formData)
    if (!res.ok) throw new Error(await res.text())
    success.value = true
    files.polaroidBrideImage = null
    files.polaroidGroomImage = null
    files.backgroundMusic = null
    previewBride.value = ''
    previewGroom.value = ''
  } catch (e: any) {
    error.value = e.message || 'Error al subir archivos'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-section {
  background: var(--color-white);
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

h2 {
  font-family: var(--font-display);
  color: var(--color-sage);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.hint {
  color: var(--color-sage-light);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.media-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-group label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-sage-light);
  font-family: var(--font-body);
}

.file-group input[type='file'] {
  padding: 0.75rem;
  border: 1px dashed var(--color-lavender-soft);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  font-family: var(--font-body);
  color: var(--color-sage);
}

.preview {
  margin-top: 0.5rem;
  width: 160px;
  height: 160px;
  border: 2px solid var(--color-lavender-soft);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-sand);
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-name {
  font-size: 0.9rem;
  color: var(--color-sage-light);
  font-style: italic;
}

button {
  align-self: flex-start;
  padding: 0.7rem 1.5rem;
  background-color: var(--color-sage);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-family: var(--font-body);
  transition: background 0.2s ease, transform 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: var(--color-sage-dark);
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  font-size: 0.95rem;
}

.success {
  color: var(--color-sage);
}

.error {
  color: var(--color-error);
}

@media (max-width: 640px) {
  .admin-section {
    padding: 1.25rem;
  }
}
</style>
