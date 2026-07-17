<template>
  <div class="admin-section">
    <div class="section-intro">
      <h2>Confirmaciones RSVP</h2>
      <p class="hint">Lista de invitados que ya confirmaron su asistencia a la ceremonia y celebración.</p>
    </div>

    <div class="filters-section">
      <div class="form-group">
        <label for="searchQuery">Buscar invitado</label>
        <input 
          id="searchQuery" 
          v-model="searchQuery" 
          type="text" 
          placeholder="Ej. Familia López" 
        />
      </div>
      <div class="form-group">
        <label for="filterCeremony">Ceremonia</label>
        <select id="filterCeremony" v-model="filterCeremony">
          <option value="">Todos</option>
          <option value="yes">Sí asistirá</option>
          <option value="no">No asistirá</option>
        </select>
      </div>
      <div class="form-group">
        <label for="filterOrigin">Origen</label>
        <select id="filterOrigin" v-model="filterOrigin">
          <option value="">Todos</option>
          <option value="Novia">Novia</option>
          <option value="Novio">Novio</option>
          <option value="Ambos/Otro">Ambos / Otro</option>
        </select>
      </div>
      <div class="form-group">
        <label for="filterCelebration">Celebración</label>
        <select id="filterCelebration" v-model="filterCelebration">
          <option value="">Todos</option>
          <option value="yes">Sí asistirá</option>
          <option value="no">No asistirá</option>
        </select>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Invitado</th>
            <th>Origen</th>
            <th>Ceremonia</th>
            <th>Celebración</th>
            <th>Música sugerida</th>
            <th>Mensaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in filteredRsvps" :key="r.id">
            <td>
              <div class="guest-name">{{ r.guest?.fullName || '—' }}</div>
            </td>
            <td>
              <span class="badge origin-badge" v-if="r.guest?.origin">{{ r.guest.origin }}</span>
              <span v-else class="token">—</span>
            </td>
            <td>
              <span class="badge" :class="r.attendCeremony ? 'yes' : 'no'">
                {{ r.attendCeremony ? 'Sí' : 'No' }}
              </span>
            </td>
            <td>
              <span class="badge" :class="r.attendCelebration ? 'yes' : 'no'">
                {{ r.attendCelebration ? 'Sí' : 'No' }}
              </span>
            </td>
            <td>{{ r.musicSuggestion || '—' }}</td>
            <td>
              <button 
                v-if="r.message" 
                class="message-btn" 
                @click="openMessageModal(r)"
                title="Ver mensaje completo"
              >
                <span class="message-cell">{{ r.message }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"/>
                </svg>
              </button>
              <span v-else>—</span>
            </td>
            <td>{{ formatDate(r.createdAt) }}</td>
          </tr>
          <tr v-if="filteredRsvps.length === 0">
            <td colspan="7" class="empty">No se encontraron confirmaciones</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="selectedRsvp" class="modal-overlay" @click.self="closeMessageModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeMessageModal" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          
          <div class="modal-header">
            <h3>Detalles del RSVP</h3>
            <p class="guest-name-large">{{ selectedRsvp.guest?.fullName }}</p>
          </div>
          
          <div class="modal-body">
            <div class="detail-row">
              <span class="detail-label">Ceremonia:</span>
              <span class="badge" :class="selectedRsvp.attendCeremony ? 'yes' : 'no'">
                {{ selectedRsvp.attendCeremony ? 'Sí asistirá' : 'No asistirá' }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Celebración:</span>
              <span class="badge" :class="selectedRsvp.attendCelebration ? 'yes' : 'no'">
                {{ selectedRsvp.attendCelebration ? 'Sí asistirá' : 'No asistirá' }}
              </span>
            </div>
            <div class="detail-row" v-if="selectedRsvp.musicSuggestion">
              <span class="detail-label">Música sugerida:</span>
              <p class="detail-text">{{ selectedRsvp.musicSuggestion }}</p>
            </div>
            <div class="detail-row full-width">
              <span class="detail-label">Mensaje completo:</span>
              <div class="message-box">
                {{ selectedRsvp.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RsvpRecord } from '@/types'

const props = defineProps<{
  rsvps: RsvpRecord[]
}>()

const searchQuery = ref('')
const filterCeremony = ref('')
const filterCelebration = ref('')
const filterOrigin = ref('')

const filteredRsvps = computed(() => {
  return props.rsvps.filter(r => {
    const guestName = r.guest?.fullName || ''
    const matchName = guestName.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    let matchCeremony = true
    if (filterCeremony.value !== '') {
      const wantsCeremony = filterCeremony.value === 'yes'
      matchCeremony = r.attendCeremony === wantsCeremony
    }
    
    let matchCelebration = true
    if (filterCelebration.value !== '') {
      const wantsCelebration = filterCelebration.value === 'yes'
      matchCelebration = r.attendCelebration === wantsCelebration
    }
    
    let matchOrigin = true
    if (filterOrigin.value !== '') {
      matchOrigin = r.guest?.origin === filterOrigin.value
    }
    
    return matchName && matchCeremony && matchCelebration && matchOrigin
  })
})

const selectedRsvp = ref<RsvpRecord | null>(null)

const openMessageModal = (rsvp: RsvpRecord) => {
  selectedRsvp.value = rsvp
}

const closeMessageModal = () => {
  selectedRsvp.value = null
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
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

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: var(--color-white);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-sand);
}

.filters-section .form-group {
  flex: 1;
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

.form-group input,
.form-group select {
  padding: 0.7rem;
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: var(--font-body);
  color: var(--color-sage);
  background: var(--color-white);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-lavender-light);
  box-shadow: 0 0 0 3px rgba(192, 184, 227, 0.2);
}

@media (max-width: 640px) {
  .filters-section {
    flex-direction: column;
    padding: 1rem;
  }
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
  min-width: 800px;
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

.message-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--color-sand);
  border-radius: var(--radius-md);
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  width: 100%;
  max-width: 220px;
  text-align: left;
  transition: all 0.2s ease;
  color: var(--color-sage);
}

.message-btn:hover {
  border-color: var(--color-lavender-soft);
  background: var(--bg-secondary);
}

.message-cell {
  display: block;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-body);
  font-size: 0.85rem;
}

.message-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-sage-light);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.badge.yes {
  background-color: var(--color-sage);
  color: var(--color-white);
}

.badge.no {
  background-color: var(--color-sand);
  color: var(--color-sage-light);
}

.badge.origin-badge {
  background-color: var(--color-lavender-soft);
  color: var(--color-sage-dark);
  font-weight: 600;
}

.empty {
  text-align: center;
  color: var(--color-sage-light);
  padding: 2rem;
  font-style: italic;
}

/* Modal Styles */
.modal-overlay {
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

.modal-content {
  position: relative;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: 2.5rem 2rem;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modal-fade-in 0.3s ease-out forwards;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
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

.modal-close:hover {
  color: var(--color-sage);
  background: var(--color-sand);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 16px;
  height: 16px;
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-sand);
}

.modal-header h3 {
  font-family: var(--font-display);
  color: var(--color-sage-light);
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.guest-name-large {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-sage);
  margin: 0;
  line-height: 1.2;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-sage-light);
  font-weight: 600;
}

.detail-text {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-sage);
}

.message-box {
  background: #fcfbfe;
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  color: var(--color-sage);
  font-size: 1.05rem;
  line-height: 1.6;
  font-style: italic;
  position: relative;
}

.message-box::before {
  content: '"';
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  font-size: 3rem;
  color: var(--color-lavender-soft);
  font-family: var(--font-display);
  line-height: 1;
  opacity: 0.5;
}

@media (max-width: 640px) {
  .admin-section {
    padding: 1.25rem;
  }

  .modal-content {
    padding: 2rem 1.5rem;
  }
  
  .modal-body {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .guest-name-large {
    font-size: 1.5rem;
  }
}
</style>
