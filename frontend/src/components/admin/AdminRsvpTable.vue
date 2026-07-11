<template>
  <div class="admin-section">
    <div class="section-intro">
      <h2>Confirmaciones RSVP</h2>
      <p class="hint">Lista de invitados que ya confirmaron su asistencia a la ceremonia y celebración.</p>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Invitado</th>
            <th>Ceremonia</th>
            <th>Celebración</th>
            <th>Invitados</th>
            <th>Música sugerida</th>
            <th>Mensaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rsvps" :key="r.id">
            <td>
              <div class="guest-name">{{ r.guest?.fullName || '—' }}</div>
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
            <td>{{ r.numberOfGuests }}</td>
            <td>{{ r.musicSuggestion || '—' }}</td>
            <td>
              <span class="message-cell" :title="r.message || ''">
                {{ r.message || '—' }}
              </span>
            </td>
            <td>{{ formatDate(r.createdAt) }}</td>
          </tr>
          <tr v-if="rsvps.length === 0">
            <td colspan="7" class="empty">Aún no hay confirmaciones</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RsvpRecord } from '@/types'

defineProps<{
  rsvps: RsvpRecord[]
}>()

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

.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-sand);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: var(--color-white);
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

.message-cell {
  display: block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-sage-light);
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

.badge.no {
  background-color: var(--color-sand);
  color: var(--color-sage-light);
}

.empty {
  text-align: center;
  color: var(--color-sage-light);
  padding: 2rem;
  font-style: italic;
}

@media (max-width: 640px) {
  .admin-section {
    padding: 1.25rem;
  }

  th,
  td {
    padding: 0.75rem;
  }
}
</style>
