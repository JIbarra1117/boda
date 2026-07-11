<template>
  <section id="hero" class="hero-section">
    <div class="hero-background">
      <div class="hero-gradient"></div>
      <div class="hero-pattern"></div>
    </div>

    <div class="hero-content">
      <div v-if="guest" class="hero-top reveal-text">
        <span class="guest-label">
          Invitación para {{ guest.fullName }}
        </span>
      </div>

      <div class="hero-main">
        <p class="invitation-text reveal-text">Te invitamos a celebrar nuestra boda</p>

        <h1 class="couple-names">
          <span class="name reveal-text">{{ settings?.brideName || 'Karen Mejía' }}</span>
          <span class="ampersand reveal-text">&</span>
          <span class="name reveal-text">{{ settings?.groomName || 'Jorge Ibarra' }}</span>
        </h1>

        <div class="wedding-date reveal-text" v-if="settings?.weddingDate">
          <span class="date-day">{{ weddingDay }}</span>
          <span class="date-month">{{ weddingMonth }}</span>
          <span class="date-year">{{ weddingYear }}</span>
        </div>
      </div>

      <button class="scroll-hint" @click="scrollToSection('couple')" aria-label="Ver invitación">
        <span class="scroll-line"></span>
        <span class="scroll-text">Descubrir</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollTo } from '@/composables/useScrollTo'
import { parseWeddingDate } from '@/utils/date'
import type { WeddingSettings, Guest } from '@/types'

const props = defineProps<{
  settings: WeddingSettings | null
  guest?: Guest | null
}>()

const { scrollToSection } = useScrollTo()

const weddingDate = computed(() => parseWeddingDate(props.settings?.weddingDate))

const weddingDay = computed(() => weddingDate.value?.getDate())
const weddingMonth = computed(() =>
  weddingDate.value?.toLocaleDateString('es-ES', { month: 'long' })
)
const weddingYear = computed(() => weddingDate.value?.getFullYear())
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-12) var(--space-6);
  overflow: hidden;
  background: var(--bg-primary);
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(192, 184, 227, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(232, 213, 196, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(250, 248, 245, 0.8) 0%, var(--bg-primary) 70%);
}

.hero-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image:
    radial-gradient(circle at 25% 25%, var(--color-lavender) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, var(--color-lavender) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding-bottom: var(--space-16);
}

.hero-top {
  margin-bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.save-the-date {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: var(--text-muted);
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.5);
}

.guest-label {
  display: inline-block;
  font-family: var(--font-display);
  font-size: var(--text-base);
  color: var(--text-primary);
  padding: var(--space-2) var(--space-5);
  background: linear-gradient(135deg, rgba(194, 184, 227, 0.25) 0%, rgba(232, 213, 196, 0.25) 100%);
  border: 1px solid rgba(194, 184, 227, 0.5);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.hero-main {
  margin-bottom: var(--space-12);
}

.invitation-text {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-style: italic;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.couple-names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
}

.couple-names .name {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  font-weight: 400;
  line-height: 1.1;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.couple-names .ampersand {
  font-family: var(--font-script);
  font-size: var(--text-5xl);
  color: var(--text-accent);
  line-height: 0.8;
  margin: var(--space-2) 0;
}

.wedding-date {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-3);
  font-family: var(--font-serif);
  color: var(--text-secondary);
}

.date-day {
  font-size: var(--text-4xl);
  font-weight: 600;
  color: var(--text-primary);
}

.date-month {
  font-size: var(--text-xl);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.date-year {
  font-size: var(--text-xl);
  letter-spacing: 0.1em;
}

.scroll-hint {
  position: absolute;
  bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  background: none;
  border: none;
  color: var(--text-muted);
  transition: color var(--transition-fast);
  animation: float 3s ease-in-out infinite;
}

.scroll-hint:hover {
  color: var(--text-accent);
}

.scroll-line {
  width: 1px;
  height: 48px;
  background: currentColor;
  opacity: 0.5;
}

.scroll-text {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* Animaciones de entrada */
.reveal-text {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

.hero-top .reveal-text { animation-delay: 0.2s; }
.invitation-text { animation-delay: 0.4s; }
.couple-names .name:first-child { animation-delay: 0.6s; }
.couple-names .ampersand { animation-delay: 0.8s; }
.couple-names .name:last-child { animation-delay: 1s; }
.wedding-date { animation-delay: 1.2s; }

@media (max-width: 768px) {
  .couple-names .name {
    font-size: var(--text-5xl);
  }

  .couple-names .ampersand {
    font-size: var(--text-4xl);
  }

  .wedding-date {
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }
}
</style>
