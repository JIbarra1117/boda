<template>
  <div class="admin-section">
    <h2>Confirmaciones RSVP</h2>
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
            <td>{{ r.guest?.fullName || '—' }}</td>
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
            <td>{{ r.message || '—' }}</td>
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
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'

const rsvps = ref<any[]>([])

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

onMounted(async () => {
  try {
    rsvps.value = await api.getRsvps()
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.admin-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

h2 {
  color: #2b1c43;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #EBE7E5;
}

th {
  background-color: #f7f6f5;
  color: #2b1c43;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

td {
  color: #2b1c43;
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
}

.badge.yes {
  background-color: #2b1c43;
  color: white;
}

.badge.no {
  background-color: #EBE7E5;
  color: #80849E;
}

.empty {
  text-align: center;
  color: #80849E;
  padding: 2rem;
  font-style: italic;
}
</style>
