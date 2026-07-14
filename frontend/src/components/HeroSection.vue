<template>
  <section id="hero" class="hero-section">
    <div class="hero-background">
      <div class="hero-gradient"></div>
      <div class="hero-pattern"></div>
      
      <!-- Burbujas con imágenes -->
      <div class="bubbles-container">
        <div v-for="(style, index) in bubbleStyles" :key="index" class="bubble" :style="style">
          <img :src="`/imgs/gallery/${index + 1}.jpg`" alt="" />
        </div>
      </div>
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

// Estilos precalculados para las burbujas para que no cambien en re-renders
const bubbleStyles = Array.from({ length: 12 }, (_, i) => {
  const size = 70 + Math.random() * 50; // Entre 70px y 120px
  
  // Alternar entre lado izquierdo y derecho (i par = izq, i impar = der)
  const isLeft = i % 2 === 0;
  
  // Posición desde el borde (2% a 12%)
  // Usaremos 'left' para las izquierdas y 'right' para las derechas
  // Esto evita que se corten en pantallas pequeñas
  const edgePos = 2 + Math.random() * 10;
    
  // Velocidad constante para todas las burbujas para evitar que se alcancen y choquen
  const animationDuration = 45; // 45 segundos en subir
  
  // Para que salgan de 1 en 1 sin chocar:
  // Hay 6 burbujas por lado. Las espaciamos equitativamente en los 45 segundos.
  const bubblesPerSide = 6;
  const sideIndex = Math.floor(i / 2); // Índice de 0 a 5 por cada lado
  const delaySpacing = animationDuration / bubblesPerSide; // 7.5 segundos entre cada burbuja
  
  // Usamos delay negativo para que ya haya burbujas en pantalla al cargar
  const animationDelay = -(sideIndex * delaySpacing);
  
  // Pequeña variación horizontal al subir (drift)
  const drift = -10 + Math.random() * 20; // -10px a 10px

  return {
    width: `${size}px`,
    height: `${size}px`,
    [isLeft ? 'left' : 'right']: `${edgePos}%`,
    '--drift': `${drift}px`, // Usaremos esta variable en CSS para el movimiento lateral
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  };
})
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

.bubbles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1; /* Detrás del contenido principal */
  pointer-events: none; /* Para no interferir con los clics */
}

.bubble {
  position: absolute;
  bottom: 0;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0.75;
  box-shadow: 0 8px 32px rgba(194, 184, 227, 0.4);
  animation: float-up infinite linear;
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: auto; /* Para que tengan hover si es necesario */
  will-change: transform; /* Aceleración por hardware (GPU) para evitar tirones */
}

.bubble:hover {
  opacity: 1;
  transform: scale(1.1);
  z-index: 10;
}

.bubble img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

@keyframes float-up {
  0% {
    transform: translateY(150px) translateX(0);
  }
  50% {
    transform: translateY(-100vh) translateX(var(--drift));
  }
  100% {
    transform: translateY(-200vh) translateX(0); /* -200vh garantiza que siempre superará el tope superior sin importar el tamaño del contenedor */
  }
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
  
  /* Mejoras para las burbujas en móvil */
  .bubble {
    /* Las hacemos más pequeñas usando la propiedad scale (independiente de transform) */
    scale: 0.6;
    /* Opacidad mayor para que sean visibles */
    opacity: 0.6 !important;
  }
}
</style>
