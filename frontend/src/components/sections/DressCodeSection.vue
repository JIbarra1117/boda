<template>
  <section id="dress-code" class="dress-code-section">
    <div class="dress-code-content" ref="elementRef" :class="{ 'is-visible': isVisible }">
      <div class="section-header">
        <span class="section-label">Código de Vestimenta</span>
        <h2 class="section-title">Dress Code</h2>
      </div>

      <div class="dress-code-card">
        <div class="dress-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>

        <h3 class="dress-code-name">{{ settings?.dressCode || 'Formal Elegante' }}</h3>

        <p class="dress-code-hint">
          Queremos que te sientas cómodo y especial. Evita el color blanco y tonos muy claros para resaltar a la novia.
        </p>

        <div class="color-palette">
          <span class="color-dot" style="background: #2C3E50;" title="Azul marino"></span>
          <span class="color-dot" style="background: #2b1c43;" title="Púrpura"></span>
          <span class="color-dot" style="background: #D4A5A5;" title="Rosa viejo"></span>
          <span class="color-dot" style="background: #C9B99A;" title="Champagne"></span>
          <span class="color-dot" style="background: #80849E;" title="Lavanda"></span>
        </div>

        <p class="palette-label">Paleta sugerida</p>
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
</script>

<style scoped>
.dress-code-section {
  padding: var(--space-24) var(--space-6);
  background:
    linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.dress-code-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.dress-code-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-10);
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
  margin: 0;
}

.dress-code-card {
  background: var(--color-white);
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-xl);
  padding: var(--space-12) var(--space-8);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.dress-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto var(--space-6);
  color: var(--text-accent);
}

.dress-icon svg {
  width: 100%;
  height: 100%;
}

.dress-code-name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.dress-code-hint {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-8);
}

.color-palette {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.color-dot {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-white);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.color-dot:hover {
  transform: scale(1.15);
}

.palette-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  margin: 0;
}

@media (max-width: 640px) {
  .dress-code-card {
    padding: var(--space-8) var(--space-4);
  }
}
</style>
