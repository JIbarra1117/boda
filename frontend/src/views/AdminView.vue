<template>
  <div class="admin-page">
    <header class="admin-header">
      <div class="header-brand">
        <div class="header-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div class="header-titles">
          <h1>Karen & Jorge</h1>
          <span class="header-subtitle">Panel de administración</span>
        </div>
      </div>
      <button class="logout-btn" @click="logoutAndRedirect">
        <span>Cerrar sesión</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </header>

    <nav class="admin-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        <span class="tab-dot" aria-hidden="true"></span>
        {{ tab.label }}
      </button>
    </nav>

    <main class="admin-content">
      <div class="kpi-grid" v-if="kpis">
        <div class="kpi-card">
          <div class="kpi-icon total" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ kpis.total }}</span>
            <span class="kpi-label">Invitados totales</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon confirmed" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ kpis.confirmed }}</span>
            <span class="kpi-label">Confirmados</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon pending" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ kpis.pending }}</span>
            <span class="kpi-label">Pendientes</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon guests" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ kpis.guestsCount }}</span>
            <span class="kpi-label">Asistentes confirmados</span>
          </div>
        </div>
      </div>

      <AdminSettings v-if="currentTab === 'settings'" />
      <AdminMedia v-if="currentTab === 'media'" />
      <AdminRsvpTable v-if="currentTab === 'rsvp'" :rsvps="rsvps" />
      <AdminGuests v-if="currentTab === 'guests'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { api } from '@/api/api'
import AdminSettings from '@/components/admin/AdminSettings.vue'
import AdminMedia from '@/components/admin/AdminMedia.vue'
import AdminRsvpTable from '@/components/admin/AdminRsvpTable.vue'
import AdminGuests from '@/components/admin/AdminGuests.vue'
import type { Guest, RsvpRecord } from '@/types'

const currentTab = ref('settings')
const tabs = [
  { id: 'settings', label: 'Configuración' },
  { id: 'media', label: 'Media' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'guests', label: 'Invitados' },
]

const guests = ref<Guest[]>([])
const rsvps = ref<RsvpRecord[]>([])

const kpis = computed(() => {
  const total = guests.value.length
  const confirmed = guests.value.filter((g) => g.hasRsvp).length
  const pending = total - confirmed
  const guestsCount = rsvps.value.reduce((sum, r) => sum + (r.numberOfGuests || 0), 0)
  return { total, confirmed, pending, guestsCount }
})

onMounted(async () => {
  try {
    const [g, r] = await Promise.all([api.getGuests(), api.getRsvps()])
    guests.value = g
    rsvps.value = r
  } catch (e) {
    console.error('Error loading admin data', e)
  }
})

const router = useRouter()
const { logout } = useAuth()

const logoutAndRedirect = () => {
  logout()
  router.push('/')
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  font-family: var(--font-body);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--color-sage) 0%, var(--color-sage-dark) 100%);
  color: var(--color-white);
  box-shadow: var(--shadow-md);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  color: var(--color-lavender-soft);
}

.header-icon svg {
  width: 22px;
  height: 22px;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.admin-header h1 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
}

.header-subtitle {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.8;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: var(--color-white);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.logout-btn svg {
  width: 16px;
  height: 16px;
}

.admin-nav {
  display: flex;
  gap: 0.25rem;
  padding: 0.75rem 2rem;
  background-color: var(--color-sage-light);
  overflow-x: auto;
}

.admin-nav button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  padding: 0.6rem 1.25rem;
  cursor: pointer;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-family: var(--font-body);
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease;
}

.admin-nav button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
}

.admin-nav button.active {
  background: var(--color-lavender-soft);
  color: var(--color-sage);
  font-weight: 600;
}

.tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}

.admin-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.kpi-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-sand);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon svg {
  width: 22px;
  height: 22px;
}

.kpi-icon.total {
  background: #f3f0f8;
  color: var(--color-sage);
}

.kpi-icon.confirmed {
  background: #f0f6f0;
  color: #5a7d5a;
}

.kpi-icon.pending {
  background: #fdf6ed;
  color: #b88a5a;
}

.kpi-icon.guests {
  background: #f5f0fc;
  color: var(--color-sage-light);
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-value {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-sage);
  line-height: 1;
}

.kpi-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-sage-light);
}

@media (max-width: 900px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .admin-header {
    padding: 1rem;
  }

  .header-titles h1 {
    font-size: 1.1rem;
  }

  .header-subtitle {
    display: none;
  }

  .logout-btn span {
    display: none;
  }

  .admin-nav {
    padding: 0.75rem 1rem;
  }

  .admin-content {
    padding: 1rem;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .kpi-card {
    padding: 1rem;
  }
}
</style>
