<template>
  <section id="couple" class="couple-section">
    <div class="section-header" ref="elementRef" :class="{ 'is-visible': isVisible }">
      <span class="section-label">Nosotros</span>
      <h2 class="section-title">Un amor para toda la vida</h2>
      <p class="love-quote">{{ settings?.loveQuote || 'Porque de todo corazón confío en ti, y me dices: "El Señor es mi herencia". Salmos 16:5' }}</p>
    </div>

    <div class="couple-grid" ref="elementRef2" :class="{ 'is-visible': isVisible2 }">
      <!-- Novio -->
      <div class="couple-card groom">
        <div class="polaroid-wrapper">
          <img
            src="/imgs/novio.png"
            :alt="`${settings?.groomName || 'Novio'}`"
            class="couple-photo"
          />
        </div>
        <div class="couple-info">
          <span class="role">El Novio</span>
          <h3 class="couple-name">{{ settings?.groomName || 'Jorge Ibarra' }}</h3>
        </div>
      </div>

      <!-- Ampersand -->
      <div class="ampersand-center">
        <span>&</span>
      </div>

      <!-- Novia -->
      <div class="couple-card bride">
        <div class="polaroid-wrapper">
          <img
            src="/imgs/novia.png"
            :alt="`${settings?.brideName || 'Novia'}`"
            class="couple-photo"
          />
        </div>
        <div class="couple-info">
          <span class="role">La Novia</span>
          <h3 class="couple-name">{{ settings?.brideName || 'Karen Mejía' }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'
import type { WeddingSettings } from '@/types'

defineProps<{
  settings: WeddingSettings | null
}>()

const { elementRef, isVisible } = useScrollReveal()
const { elementRef: elementRef2, isVisible: isVisible2 } = useScrollReveal()
</script>

<style scoped>
.couple-section {
  padding: var(--space-24) var(--space-6);
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.section-header {
  text-align: center;
  max-width: var(--max-width-content);
  margin: 0 auto var(--space-12);
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

.love-quote {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.7;
}

.couple-grid {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: clamp(var(--space-2), 4vw, var(--space-10));
  max-width: var(--max-width);
  margin: 0 auto;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.couple-grid.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.couple-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  flex: 0 0 auto;
}

.polaroid-wrapper {
  position: relative;
  width: 280px;
  height: 400px;
  flex-shrink: 0;
}

.couple-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 10px 30px rgba(74, 64, 58, 0.1));
  transition: transform var(--transition-slow);
}

.couple-card:hover .couple-photo {
  transform: scale(1.02);
}

.couple-info {
  text-align: center;
}

.role {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  margin-bottom: var(--space-1);
}

.couple-name {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin: 0;
}

.ampersand-center {
  font-family: var(--font-script);
  font-size: var(--text-6xl);
  color: var(--text-accent);
  opacity: 0.8;
  animation: float 4s ease-in-out infinite;
  flex-shrink: 0;
  line-height: 1;
}

/* Responsive: siempre en fila, reduciendo proporcionalmente */
@media (max-width: 900px) {
  .polaroid-wrapper {
    width: 220px;
    height: 314px;
  }

  .ampersand-center {
    font-size: var(--text-5xl);
  }

  .couple-name {
    font-size: var(--text-xl);
  }
}

@media (max-width: 640px) {
  .couple-section {
    padding: var(--space-16) var(--space-3);
  }

  .section-title {
    font-size: var(--text-3xl);
  }

  .love-quote {
    font-size: var(--text-base);
  }

  .polaroid-wrapper {
    width: 42vw;
    max-width: 170px;
    height: calc(42vw * 1.429);
    max-height: 243px;
  }

  .ampersand-center {
    font-size: var(--text-3xl);
  }

  .couple-info {
    gap: var(--space-1);
  }

  .role {
    font-size: 0.65rem;
    letter-spacing: 0.1em;
  }

  .couple-name {
    font-size: var(--text-lg);
  }
}

@media (max-width: 360px) {
  .couple-grid {
    gap: var(--space-2);
  }

  .polaroid-wrapper {
    width: 38vw;
    max-width: 135px;
    height: calc(38vw * 1.429);
    max-height: 193px;
  }

  .ampersand-center {
    font-size: var(--text-2xl);
  }

  .couple-name {
    font-size: var(--text-base);
  }
}
</style>
