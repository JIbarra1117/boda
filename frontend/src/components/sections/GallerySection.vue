<template>
  <section id="gallery" class="gallery-section">
    <div class="gallery-header" ref="elementRef" :class="{ 'is-visible': isVisible }">
      <span class="section-label">Nuestra Historia</span>
      <h2 class="section-title">Momentos Inolvidables</h2>
    </div>

    <div class="slider-container" ref="elementRef2" :class="{ 'is-visible': isVisible2 }">
      <div class="slider-track" ref="trackRef">
        <div v-for="index in 12" :key="index" class="slide">
          <img :src="`/imgs/gallery/${index}.jpg`" :alt="`Nuestra foto ${index}`" loading="lazy" />
        </div>
      </div>
      
      <!-- Controles de navegación -->
      <button class="nav-btn prev-btn" @click="scrollPrev" aria-label="Anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button class="nav-btn next-btn" @click="scrollNext" aria-label="Siguiente">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { elementRef, isVisible } = useScrollReveal()
const { elementRef: elementRef2, isVisible: isVisible2 } = useScrollReveal()

const trackRef = ref<HTMLElement | null>(null)

const scrollNext = () => {
  if (trackRef.value) {
    const slideWidth = trackRef.value.querySelector('.slide')?.clientWidth || 0
    trackRef.value.scrollBy({ left: slideWidth + 24, behavior: 'smooth' })
  }
}

const scrollPrev = () => {
  if (trackRef.value) {
    const slideWidth = trackRef.value.querySelector('.slide')?.clientWidth || 0
    trackRef.value.scrollBy({ left: -(slideWidth + 24), behavior: 'smooth' })
  }
}
</script>

<style scoped>
.gallery-section {
  padding: var(--space-24) 0;
  background: var(--bg-primary);
  overflow: hidden;
}

.gallery-header {
  text-align: center;
  margin-bottom: var(--space-12);
  padding: 0 var(--space-6);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.gallery-header.is-visible {
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

.slider-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.slider-container.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.slider-track {
  display: flex;
  gap: var(--space-6);
  padding: 0 var(--space-6) var(--space-8) var(--space-6);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  scroll-behavior: smooth;
}

.slider-track::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.slide {
  flex: 0 0 85%;
  max-width: 350px;
  aspect-ratio: 4/5;
  scroll-snap-align: center;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  position: relative;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.slide:hover img {
  transform: scale(1.03);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--color-sand);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  z-index: 2;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: var(--color-white);
  transform: translateY(-50%) scale(1.05);
  box-shadow: var(--shadow-md);
}

.nav-btn svg {
  width: 24px;
  height: 24px;
}

.prev-btn {
  left: 1.5rem;
}

.next-btn {
  right: 1.5rem;
}

@media (max-width: 768px) {
  .slide {
    flex: 0 0 80%;
    max-width: 300px;
    aspect-ratio: 3/4;
  }
  
  .nav-btn {
    display: none; /* En móviles el scroll táctil es suficiente */
  }
  
  .slider-track {
    padding-bottom: var(--space-4);
  }
}
</style>
