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

      <div class="events-unified" ref="elementRef2" :class="{ 'is-visible': isVisible2 }">
        <div class="event-card unified-card">
          <div class="event-icons-row">
            <div class="event-icon">
              <!-- Ceremony Icon -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span class="divider-icon">♥</span>
            <div class="event-icon">
              <!-- Celebration Icon -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2a5 5 0 00-5 5v1H5a2 2 0 00-2 2v1a2 2 0 002 2h14a2 2 0 002-2v-1a2 2 0 00-2-2h-2V7a5 5 0 00-5-5z"/>
                <path d="M7 13v7a2 2 0 002 2h6a2 2 0 002-2v-7"/>
                <path d="M9 13h6"/>
              </svg>
            </div>
          </div>
          
          <h3 class="event-title">Ceremonia y Celebración</h3>
          
          <div class="event-detail date-detail">
            <span class="detail-label">Fecha</span>
            <span class="detail-value">{{ formattedDate }}</span>
          </div>

          <div class="times-row">
            <div class="event-detail">
              <span class="detail-label">Ceremonia</span>
              <span class="detail-value">{{ settings?.ceremonyTime || 'Por confirmar' }}</span>
            </div>
            <div class="event-detail">
              <span class="detail-label">Celebración</span>
              <span class="detail-value">{{ settings?.celebrationTime || 'Por confirmar' }}</span>
            </div>
          </div>

          <div class="location-box">
            <div class="event-detail">
              <span class="detail-label">Lugar del Evento</span>
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
        </div>
      </div>

      <div class="calendar-action-wrapper" v-show="settings?.calendarUrl" ref="elementRef3" :class="{ 'is-visible': isVisible3 }">
        <a :href="settings.calendarUrl" target="_blank" rel="noopener" class="calendar-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Agendar Recordatorio
        </a>
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
const { elementRef: elementRef3, isVisible: isVisible3 } = useScrollReveal()

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

.events-unified {
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.events-unified.is-visible {
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
  max-width: 600px;
  width: 100%;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.event-icons-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.event-icon {
  width: 48px;
  height: 48px;
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

.date-detail {
  margin-bottom: var(--space-8);
}

.times-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  padding: var(--space-4) 0;
  border-top: 1px dashed var(--color-lavender-soft);
  border-bottom: 1px dashed var(--color-lavender-soft);
}

.location-box {
  margin-top: var(--space-6);
}

.event-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
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

.divider-icon {
  color: var(--color-rose);
  font-size: var(--text-xl);
  animation: pulse-soft 2s ease-in-out infinite;
}

.calendar-action-wrapper {
  margin-top: var(--space-12);
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.calendar-action-wrapper.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.calendar-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-8);
  background: var(--color-sage);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  text-decoration: none;
}

.calendar-button:hover {
  background: var(--color-sage-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.calendar-button svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 640px) {
  .event-card {
    padding: var(--space-6);
  }
  
  .times-row {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
}
</style>
