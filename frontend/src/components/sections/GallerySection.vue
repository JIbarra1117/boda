<template>
  <section id="gallery" class="gallery-section">
    <div class="section-header" ref="elementRef" :class="{ 'is-visible': isVisible }">
      <span class="section-label">Momentos</span>
      <h2 class="section-title">Nuestra Historia</h2>
      <p class="section-subtitle">Algunos recuerdos que nos trajeron hasta aquí</p>
    </div>

    <div class="gallery-grid" ref="elementRef2" :class="{ 'is-visible': isVisible2 }">
      <div class="gallery-item large">
        <div class="photo-frame">
          <img
            :src="getMediaUrl(settings?.polaroidGroomImage) || '/imgs/placeholder-groom.svg'"
            alt="Foto del novio"
          />
          <div class="frame-decoration"></div>
        </div>
      </div>

      <div class="gallery-item quote-card">
        <div class="quote-content">
          <span class="quote-mark">"</span>
          <p class="quote-text">El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.</p>
          <span class="quote-source">1 Corintios 13:4</span>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <img
            :src="getMediaUrl(settings?.polaroidBrideImage) || '/imgs/placeholder-bride.svg'"
            alt="Foto de la novia"
          />
          <div class="frame-decoration"></div>
        </div>
      </div>

      <div class="gallery-item wide">
        <div class="photo-frame couple-frame">
          <div class="couple-placeholder">
            <span class="placeholder-names">{{ settings?.brideName || 'Ella' }} & {{ settings?.groomName || 'Él' }}</span>
            <span class="placeholder-text">Pronto compartiremos más momentos</span>
          </div>
          <div class="frame-decoration"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getMediaUrl } from '@/api/api'
import { useScrollReveal } from '@/composables/useScrollReveal'
import type { WeddingSettings } from '@/types'

defineProps<{
  settings: WeddingSettings | null
}>()

const { elementRef, isVisible } = useScrollReveal()
const { elementRef: elementRef2, isVisible: isVisible2 } = useScrollReveal()
</script>

<style scoped>
.gallery-section {
  padding: var(--space-24) var(--space-6);
  background: var(--bg-primary);
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

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 320px);
  gap: var(--space-4);
  max-width: var(--max-width);
  margin: 0 auto;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.gallery-grid.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.gallery-item.large {
  grid-row: span 2;
}

.gallery-item.wide {
  grid-column: span 2;
}

.gallery-item.quote-card {
  background: var(--bg-secondary);
  border: 1px solid var(--color-lavender-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  text-align: center;
}

.photo-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.gallery-item:hover .photo-frame img {
  transform: scale(1.05);
}

.frame-decoration {
  position: absolute;
  inset: var(--space-3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: calc(var(--radius-lg) - 4px);
  pointer-events: none;
}

.couple-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-accent) 100%);
}

.couple-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
  padding: var(--space-6);
}

.placeholder-names {
  font-family: var(--font-script);
  font-size: var(--text-4xl);
  color: var(--text-accent);
}

.placeholder-text {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}

.quote-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.quote-mark {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  color: var(--text-accent);
  line-height: 1;
  opacity: 0.5;
}

.quote-text {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-style: italic;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
}

.quote-source {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }

  .gallery-item.large {
    grid-row: span 1;
  }

  .gallery-item.wide {
    grid-column: span 2;
  }

  .gallery-item {
    min-height: 240px;
  }
}

@media (max-width: 640px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .gallery-item.wide {
    grid-column: span 1;
  }
}
</style>
