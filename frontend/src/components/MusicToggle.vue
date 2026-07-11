<template>
  <button
    class="music-toggle"
    :class="{ playing: isPlaying }"
    @click="toggle"
    :aria-label="isPlaying ? 'Pausar música' : 'Reproducir música'"
  >
    <span class="icon">
      <svg v-if="isPlaying" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </span>
    <span class="music-waves" v-if="isPlaying">
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  src?: string
}>()

const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)

const toggle = () => {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play().catch(() => {
      // El navegador bloqueó el autoplay, requiere interacción
    })
  }
}

const startMusic = () => {
  if (!audio.value) return
  audio.value.play().catch(() => {
    // Autoplay bloqueado hasta interacción del usuario
  })
}

onMounted(() => {
  if (!props.src) return
  audio.value = new Audio(props.src)
  audio.value.loop = true
  audio.value.volume = 0.4

  audio.value.addEventListener('play', () => (isPlaying.value = true))
  audio.value.addEventListener('pause', () => (isPlaying.value = false))

  // Intentar reproducir automáticamente al montar
  startMusic()
})

watch(
  () => props.src,
  (newSrc) => {
    if (audio.value) {
      audio.value.pause()
      audio.value = null
    }
    if (newSrc) {
      audio.value = new Audio(newSrc)
      audio.value.loop = true
      audio.value.volume = 0.4

      audio.value.addEventListener('play', () => (isPlaying.value = true))
      audio.value.addEventListener('pause', () => (isPlaying.value = false))

      startMusic()
    }
  }
)
</script>

<style scoped>
.music-toggle {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 999;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-full);
  background: var(--color-white);
  border: 1px solid var(--color-lavender-soft);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.music-toggle:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
  color: var(--text-accent);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.icon svg {
  width: 100%;
  height: 100%;
}

.music-waves {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 14px;
}

.music-waves span {
  width: 2px;
  background: currentColor;
  border-radius: var(--radius-full);
  animation: wave 1s ease-in-out infinite;
}

.music-waves span:nth-child(1) {
  height: 6px;
  animation-delay: 0s;
}

.music-waves span:nth-child(2) {
  height: 12px;
  animation-delay: 0.2s;
}

.music-waves span:nth-child(3) {
  height: 8px;
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 100% { transform: scaleY(0.6); }
  50% { transform: scaleY(1); }
}

@media (max-width: 640px) {
  .music-toggle {
    width: 44px;
    height: 44px;
    bottom: var(--space-4);
    right: var(--space-4);
  }
}
</style>
