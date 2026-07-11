<template>
  <section id="details" class="details-section">
    <div class="details-background">
      <div class="floral-accent top-left">❦</div>
      <div class="floral-accent bottom-right">❦</div>
    </div>

    <div class="details-content">
      <div class="section-header" ref="elementRef" :class="{ 'is-visible': isVisible }">
        <span class="section-label">El Gran Día</span>
        <h2 class="section-title">Itinerario</h2>
        <p class="section-subtitle">Te esperamos para celebrar juntos este momento tan especial</p>
      </div>

      <div class="events-grid" ref="elementRef2" :class="{ 'is-visible': isVisible2 }">
        <div class="event-card ceremony">
          <div class="event-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span class="event-tag">Ceremonia</span>
          <h3 class="event-title">La Boda</h3>
          <div class="event-detail">
            <span class="detail-label">Fecha</span>
            <span class="detail-value">{{ formattedDate }}</span>
          </div>
          <div class="event-detail">
            <span class="detail-label">Hora</span>
            <span class="detail-value">{{ settings?.ceremonyTime || 'Por confirmar' }}</span>
          </div>
          <div class="event-detail">
            <span class="detail-label">Lugar</span>
            <span class="detail-value">{{ settings?.ceremonyLocation || 'Por confirmar' }}</span>
          </div>
          <p class="event-address" v-if="settings?.ceremonyAddress">
            {{ settings.ceremonyAddress }}
          </p>
          <a
            v-if="settings?.ceremonyMapsUrl"
            :href="settings.ceremonyMapsUrl"
            target="_blank"
            rel="noopener"
            class="event-button"
          >
            Ver ubicación
          </a>
        </div>

        <div class="events-divider">
          <span class="divider-line"></span>
          <span class="divider-icon">♥</span>
          <span class="divider-line"></span>
        </div>

        <div class="event-card celebration">
          <div class="event-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2a5 5 0 00-5 5v1H5a2 2 0 00-2 2v1a2 2 0 002 2h14a2 2 0 002-2v-1a2 2 0 00-2-2h-2V7a5 5 0 00-5-5z"/>
              <path d="M7 13v7a2 2 0 002 2h6a2 2 0 002-2v-7"/>
              <path d="M9 13h6"/>
            </svg>
          </div>
          <span class="event-tag">Celebración</span>
          <h3 class="event-title">La Fiesta</h3>
          <div class="event-detail">
            <span class="detail-label">Fecha</span>
            <span class="detail-value">{{ formattedDate }}</span>
          </div>
          <div class="event-detail">
            <span class="detail-label">Hora</span>
            <span class="detail-value">{{ settings?.celebrationTime || 'Por confirmar' }}</span>
          </div>
          <div class="event-detail">
            <span class="detail-label">Lugar</span>
            <span class="detail-value">{{ settings?.celebrationLocation || 'Por confirmar' }}</span>
          </div>
          <p class="event-address" v-if="settings?.celebrationAddress">
            {{ settings.celebrationAddress }}
          </p>
          <a
            v-if="settings?.celebrationMapsUrl"
            :href="settings.celebrationMapsUrl"
            target="_blank"
            rel="noopener"
            class="event-button"
          >
            Ver ubicación
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { parseWeddingDate } from '@/utils/date'
import type { WeddingSettings } from '@/types'

const props = defineProps<{
  settings: WeddingSettings | null
}>()

const { elementRef, isVisible } = useScrollReveal()
const { elementRef: elementRef2, isVisible: isVisible2 } = useScrollReveal()

const formattedDate = computed(() => {
  const date = parseWeddingDate(props.settings?.weddingDate)
  if (!date) return 'Por confirmar'
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<style scoped>
.details-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-secondary);
  overflow: hidden;
}

.details-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floral-accent {
  position: absolute;
  font-size: 8rem;
  color: var(--color-lavender-soft);
  opacity: 0.08;
  font-family: var(--font-display);
}

.floral-accent.top-left {
  top: var(--space-8);
  left: var(--space-8);
  transform: rotate(-15deg);
}

.floral-accent.bottom-right {
  bottom: var(--space-8);
  right: var(--space-8);
  transform: rotate(15deg);
}

.details-content {
  position: relative;
  z-index: 1;
  max-width: var(--max-width);
  margin: 0 auto;
}

.section-header {
  text-align: center;
  max-width: var(--max-width-content);
  margin: 0 auto var(--space-16);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.section-header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--text-secondary);
  margin: 0;
}

.events-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-8);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.events-grid.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.event-card {
  background: var(--color-white);
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-lg);
  padding: var(--space-10);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.event-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  color: var(--text-accent);
}

.event-icon svg {
  width: 100%;
  height: 100%;
}

.event-tag {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

.event-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.event-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
}

.detail-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}

.detail-value {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--text-primary);
  font-weight: 500;
}

.event-address {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-style: italic;
  margin: var(--space-4) 0;
  line-height: 1.6;
}

.event-button {
  display: inline-block;
  margin-top: var(--space-4);
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--text-accent);
  border-radius: var(--radius-full);
  color: var(--text-accent);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all var(--transition-fast);
}

.event-button:hover {
  background: var(--text-accent);
  color: var(--color-white);
}

.events-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.divider-line {
  width: 1px;
  height: 80px;
  background: var(--color-lavender-soft);
}

.divider-icon {
  color: var(--color-rose);
  font-size: var(--text-xl);
  animation: pulse-soft 2s ease-in-out infinite;
}

@media (max-width: 900px) {
  .events-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .events-divider {
    flex-direction: row;
    justify-content: center;
  }

  .divider-line {
    width: 80px;
    height: 1px;
  }
}
</style>
