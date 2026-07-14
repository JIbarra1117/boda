<template>
  <section id="dress-code" class="dress-code-section">
    <div class="dress-code-content">
      <div class="section-header" ref="elementRef" :class="{ 'is-visible': isVisible }">
        <span class="section-label">Dress Code</span>
        <h2 class="section-title">Código de Vestimenta</h2>
      </div>

      <div class="dress-code-card" ref="elementRef2" :class="{ 'is-visible': isVisible2 }">
        <div class="icon-container">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3 6 4-2-2 5 2 5-4-2-3 6-3-6-4 2 2-5-2-5 4 2z" stroke-linejoin="round" stroke-linecap="round"/>
          </svg>
        </div>
        
        <h3 class="dress-level">Formal</h3>
        <p class="dress-description">
          Nos encantaría que nos acompañes luciendo espectacular en nuestro gran día.
        </p>

        <div class="colors-section">
          <h4 class="colors-title">Tonalidades sugeridas</h4>
          <div class="color-palette">
            <div class="color-circle" style="background-color: #6E7B60;" title="Verde Oliva"></div>
            <div class="color-circle" style="background-color: #B9B5D8;" title="Lila"></div>
            <div class="color-circle" style="background-color: #A0B2DF;" title="Azul Claro"></div>
            <div class="color-circle" style="background-color: #E8E2D5;" title="Crema"></div>
            <div class="color-circle" style="background-color: #38245D;" title="Morado Oscuro"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'

const { elementRef, isVisible } = useScrollReveal()
const { elementRef: elementRef2, isVisible: isVisible2 } = useScrollReveal()
</script>

<style scoped>
.dress-code-section {
  padding: var(--space-24) var(--space-6);
  background: var(--bg-secondary);
}

.dress-code-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-10);
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
  margin: 0;
}

.dress-code-card {
  background: var(--color-white);
  border: 1px solid var(--color-lavender-soft);
  border-radius: 20px;
  padding: var(--space-12) var(--space-8);
  text-align: center;
  box-shadow: 0 4px 20px rgba(194, 184, 227, 0.15);
  max-width: 600px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.dress-code-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.icon-container {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-6);
  color: #A0B1E3;
}

.icon-container svg {
  width: 100%;
  height: 100%;
}

.dress-level {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.dress-description {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: #80849E;
  margin-bottom: var(--space-8);
}

.colors-section {
  padding-top: var(--space-6);
  border-top: 1px solid rgba(232, 213, 196, 0.5);
}

.colors-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
  font-weight: 600;
}

.color-palette {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.color-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.color-circle:hover {
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .dress-code-card {
    padding: var(--space-8) var(--space-4);
  }
  
  .color-circle {
    width: 40px;
    height: 40px;
  }
}
</style>
