<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1>Administración - Karen & Jorge</h1>
      <button @click="logoutAndRedirect">Cerrar sesión</button>
    </header>

    <nav class="admin-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <main class="admin-content">
      <AdminSettings v-if="currentTab === 'settings'" />
      <AdminMedia v-if="currentTab === 'media'" />
      <AdminRsvpTable v-if="currentTab === 'rsvp'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AdminSettings from '@/components/admin/AdminSettings.vue'
import AdminMedia from '@/components/admin/AdminMedia.vue'
import AdminRsvpTable from '@/components/admin/AdminRsvpTable.vue'

const currentTab = ref('settings')
const tabs = [
  { id: 'settings', label: 'Configuración' },
  { id: 'media', label: 'Media' },
  { id: 'rsvp', label: 'RSVP' },
]

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
  background-color: #EBE7E5;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2b1c43;
  color: white;
}

.admin-header h1 {
  font-size: 1.25rem;
}

.admin-header button {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.admin-nav {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: #80849E;
}

.admin-nav button {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.95rem;
}

.admin-nav button.active,
.admin-nav button:hover {
  background-color: #A0B1E3;
}

.admin-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
