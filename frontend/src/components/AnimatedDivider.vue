<template>
  <div class="divider" :class="position">
    <div class="divider-fade fade-left"></div>
    <div class="divider-track">
      <img
        v-for="n in repetitions"
        :key="n"
        :src="`/imgs/divisor-${position}.png`"
        alt=""
      />
    </div>
    <div class="divider-fade fade-right"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  position: 'top' | 'bottom'
}>()

// Muchas repeticiones para asegurar que el track cubra cualquier ancho de pantalla
// y que el loop infinito sea perfecto sin ver el corte.
const repetitions = 24
</script>

<style scoped>
.divider {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 90px;
  line-height: 0;
}

.divider.top {
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.divider.bottom {
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
}

.divider-track {
  display: flex;
  width: max-content;
  animation: scroll-horizontal 40s linear infinite;
  will-change: transform;
}

.divider-track:hover {
  animation-play-state: paused;
}

.divider img {
  height: 90px;
  width: auto;
  flex-shrink: 0;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(74, 64, 58, 0.06));
}

.divider-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  z-index: 2;
  pointer-events: none;
}

.fade-left {
  left: 0;
}

.fade-right {
  right: 0;
}

.divider.top .fade-left {
  background: linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%);
}

.divider.top .fade-right {
  background: linear-gradient(270deg, var(--bg-primary) 0%, transparent 100%);
}

.divider.bottom .fade-left {
  background: linear-gradient(90deg, var(--bg-secondary) 0%, transparent 100%);
}

.divider.bottom .fade-right {
  background: linear-gradient(270deg, var(--bg-secondary) 0%, transparent 100%);
}

@keyframes scroll-horizontal {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (max-width: 640px) {
  .divider {
    height: 70px;
  }

  .divider img {
    height: 70px;
  }

  .divider-fade {
    width: 50px;
  }
}
</style>
