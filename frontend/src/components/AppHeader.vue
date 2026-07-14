<template>
  <header class="app-header" :class="{ 'is-visible': isScrolled, 'is-expanded': menuOpen }">
    <div class="header-inner">
      <a href="#" class="header-logo" @click.prevent="scrollToSection('hero')">
        <span class="logo-names">{{ brideInitial }} & {{ groomInitial }}</span>
      </a>

      <nav class="header-nav" :class="{ 'is-open': menuOpen }">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          @click.prevent="handleNavClick(item.id)"
        >
          {{ item.label }}
        </a>
      </nav>

      <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="Menú">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useScrollTo } from '@/composables/useScrollTo'

const props = defineProps<{
  brideName?: string
  groomName?: string
}>()

const { scrollToSection } = useScrollTo()
const isScrolled = ref(false)
const menuOpen = ref(false)

const brideInitial = computed(() => props.brideName?.charAt(0).toUpperCase() || 'K')
const groomInitial = computed(() => props.groomName?.charAt(0).toUpperCase() || 'J')

const navItems = [
  { id: 'couple', label: 'Nosotros' },
  { id: 'details', label: 'Evento' },
  { id: 'countdown', label: 'Cuenta Regresiva' },
  { id: 'rsvp', label: 'Confirmar' },
  { id: 'gifts', label: 'Regalos' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

const handleNavClick = (id: string) => {
  menuOpen.value = false
  scrollToSection(id)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: var(--space-4) var(--space-6);
  transition: all var(--transition-base);
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}

.app-header.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  background: rgba(250, 248, 245, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
}

.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  position: relative;
  z-index: 10;
  font-family: var(--font-script);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.header-logo:hover {
  color: var(--text-accent);
}

.header-nav {
  display: flex;
  gap: var(--space-8);
  align-items: center;
}

.header-nav a {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-primary);
  position: relative;
  padding: var(--space-2) 0;
  transition: color var(--transition-fast);
}

.header-nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-lavender-soft);
  transition: width var(--transition-base);
}

.header-nav a:hover {
  color: var(--text-accent);
}

.header-nav a:hover::after {
  width: 100%;
}

.menu-toggle {
  position: relative;
  z-index: 10;
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: var(--space-2);
}

.menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  transition: all var(--transition-fast);
}

.menu-toggle span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-toggle span.open:nth-child(2) {
  opacity: 0;
}

.menu-toggle span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .app-header.is-expanded {
    height: 100dvh;
    background: rgba(250, 248, 245, 0.98);
  }

  .header-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-6);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
    transition: all var(--transition-base);
    z-index: 5;
  }

  .header-nav.is-open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .header-nav a {
    font-size: var(--text-sm);
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
