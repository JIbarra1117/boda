<template>
  <section id="countdown" class="countdown-section">
    <div class="countdown-card" ref="elementRef" :class="{ 'is-visible': isVisible }">
      <div class="countdown-header">
        <span class="section-label">Cuenta Regresiva</span>
        <h2 class="countdown-title">Faltan</h2>
      </div>

      <CountdownTimer v-if="settings?.weddingDate" :target-date="settings.weddingDate" />

      <p class="countdown-message" v-if="settings?.weddingDate">
        Para el día más importante de nuestras vidas
      </p>
      <p class="countdown-message" v-else>
        Pronto anunciaremos la fecha de nuestra boda
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import CountdownTimer from '@/components/CountdownTimer.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import type { WeddingSettings } from '@/types'

defineProps<{
  settings: WeddingSettings | null
}>()

const { elementRef, isVisible } = useScrollReveal()
</script>

<style scoped>
.countdown-section {
  padding: var(--space-24) var(--space-6);
  background:
    linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  display: flex;
  justify-content: center;
}

.countdown-card {
  width: 100%;
  max-width: 800px;
  background: var(--bg-primary);
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-xl);
  padding: var(--space-12) var(--space-8);
  text-align: center;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.countdown-card.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.countdown-header {
  margin-bottom: var(--space-8);
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

.countdown-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  color: var(--text-primary);
  margin: 0;
}

.countdown-message {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--text-secondary);
  margin-top: var(--space-8);
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .countdown-card {
    padding: var(--space-8) var(--space-4);
  }
}
</style>
