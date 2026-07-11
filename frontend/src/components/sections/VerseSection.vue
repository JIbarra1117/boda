<template>
  <section id="verse" class="verse-section">
    <div class="verse-content" ref="elementRef" :class="{ 'is-visible': isVisible }">
      <blockquote class="verse-text">
        "El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso."
      </blockquote>
      <cite class="verse-ref">1 Corintios 13:4</cite>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'

const { elementRef, isVisible } = useScrollReveal()
</script>

<style scoped>
.verse-section {
  padding: var(--space-24) var(--space-6);
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.verse-section::before,
.verse-section::after {
  content: '"';
  position: absolute;
  font-family: var(--font-display);
  font-size: 12rem;
  color: var(--color-lavender-soft);
  opacity: 0.15;
  line-height: 1;
  pointer-events: none;
}

.verse-section::before {
  top: var(--space-8);
  left: var(--space-8);
}

.verse-section::after {
  bottom: var(--space-8);
  right: var(--space-8);
  transform: rotate(180deg);
}

.verse-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  position: relative;
  z-index: 1;
}

.verse-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.verse-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.verse-text {
  font-family: var(--font-serif);
  font-size: var(--text-3xl);
  font-style: italic;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0 0 var(--space-6);
}

.verse-ref {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  font-style: normal;
}

@media (max-width: 640px) {
  .verse-section {
    padding: var(--space-16) var(--space-6);
  }

  .verse-section::before,
  .verse-section::after {
    font-size: 8rem;
  }

  .verse-text {
    font-size: var(--text-xl);
  }
}
</style>
