<template>
  <div class="bifold-stage" :class="{ opening: isOpening, opened: isOpened }">
    <!-- Solapas de cartulina -->
    <div class="bifold-panels">
      <div class="panel panel-left">
        <div class="panel-face panel-face-front">
          <div class="panel-texture"></div>
          <div class="panel-curve"></div>
          <div class="panel-shadow"></div>
        </div>
        <div class="panel-face panel-face-back"></div>
        <div class="panel-fold"></div>
      </div>

      <div class="panel panel-right">
        <div class="panel-face panel-face-front">
          <div class="panel-texture"></div>
          <div class="panel-curve"></div>
          <div class="panel-shadow"></div>
        </div>
        <div class="panel-face panel-face-back"></div>
        <div class="panel-fold"></div>
      </div>
    </div>

    <!-- Sello de cera -->
    <button
      class="wax-seal"
      :class="{ loading: isLoading, ready: !isLoading && !isOpening && !isOpened, breaking: isBreaking, opening: isOpening, opened: isOpened }"
      :disabled="isLoading || isOpening || isOpened"
      @click="handleClick"
      aria-label="Abrir invitación"
    >
      <img
        src="/imgs/cera.png"
        alt="Sello de cera"
        class="seal-image"
      />
    </button>

    <!-- Texto de carga / hint -->
    <Transition name="fade" mode="out-in">
      <p v-if="isLoading" class="stage-text loading-text" key="loading">
        Preparando tu invitación...
      </p>
      <p v-else-if="!isOpening && !isOpened" class="stage-text hint-text" key="hint">
        Toca el sello para abrir
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean
  isOpening: boolean
  isBreaking: boolean
  isOpened: boolean
}>()

const emit = defineEmits<{
  open: []
}>()

const handleClick = () => {
  if (!props.isLoading && !props.isOpening) {
    emit('open')
  }
}
</script>

<style scoped>
.bifold-stage {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.6s ease, visibility 0.6s ease;
  pointer-events: auto;
}

.bifold-stage.opened {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* Contenedor de las solapas */
.bifold-panels {
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 10;
  perspective: 2000px;
}

/* Solapa base */
.panel {
  position: relative;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 2.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Cada solapa mide 50.5% para solaparse en el centro y no dejar rendijas */
.panel-left {
  width: 50.5%;
  transform-origin: left center;
}

.panel-right {
  width: 50.5%;
  margin-left: -1%;
  transform-origin: right center;
}

/* Caras de la solapa (frente y reverso) */
.panel-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

.panel-face-front {
  z-index: 2;
  background: linear-gradient(135deg, #3d2b5a 0%, #2b1c43 50%, #1f1430 100%);
  overflow: hidden;
}

.panel-face-back {
  z-index: 1;
  background: linear-gradient(135deg, #2b1c43 0%, #1f1430 50%, #140d1f 100%);
  transform: rotateY(180deg);
}

/* Textura de cartulina */
.panel-texture {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 3px),
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.02) 2px, rgba(255, 255, 255, 0.02) 3px),
    repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0, 0, 0, 0.02) 40px, rgba(0, 0, 0, 0.02) 41px);
  mix-blend-mode: multiply;
}

/* Gradiente de curvatura del papel */
.panel-curve {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0) 25%,
    rgba(0, 0, 0, 0.05) 50%,
    rgba(0, 0, 0, 0) 75%,
    rgba(0, 0, 0, 0.1) 100%
  );
  opacity: 0.6;
  transition: opacity 2.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Sombra en el borde central que simula el doblez */
.panel-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60px;
  pointer-events: none;
  transition: opacity 2.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panel-left .panel-shadow {
  right: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.25) 100%);
}

.panel-right .panel-shadow {
  left: 0;
  background: linear-gradient(270deg, transparent 0%, rgba(0, 0, 0, 0.25) 100%);
}

/* Línea de doblez */
.panel-fold {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.25) 15%, rgba(0, 0, 0, 0.25) 85%, transparent 100%);
  z-index: 3;
  transition: opacity 2.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panel-left .panel-fold {
  right: 0;
}

.panel-right .panel-fold {
  left: 0;
}

/* Animación de apertura */
.bifold-stage.opening .panel-left,
.bifold-stage.opened .panel-left {
  transform: rotateY(-125deg);
}

.bifold-stage.opening .panel-right,
.bifold-stage.opened .panel-right {
  transform: rotateY(125deg);
}

/* Durante la apertura, la curvatura y sombras cambian para simular el doblez */
.bifold-stage.opening .panel-curve,
.bifold-stage.opened .panel-curve {
  opacity: 0.2;
}

.bifold-stage.opening .panel-shadow,
.bifold-stage.opened .panel-shadow {
  opacity: 0.4;
}

.bifold-stage.opening .panel-fold,
.bifold-stage.opened .panel-fold {
  opacity: 0.6;
}

/* Sello de cera */
.wax-seal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  width: 275px;
  height: 275px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.35s ease, filter 0.35s ease, opacity 0.35s ease;
  filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.4));
}

.wax-seal:disabled {
  cursor: default;
}

.wax-seal.ready:hover {
  transform: translate(-50%, -50%) scale(1.05);
  filter: drop-shadow(0 18px 36px rgba(0, 0, 0, 0.5));
}

.wax-seal.ready:active {
  transform: translate(-50%, -50%) scale(0.97);
}

.seal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* Animación de pulso durante loading */
.wax-seal.loading {
  animation: sealPulse 2.2s ease-in-out infinite;
}

@keyframes sealPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.4));
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    filter: drop-shadow(0 14px 34px rgba(99, 0, 98, 0.5));
  }
}

/* Al abrir, el sello desaparece con un efecto suave */
.wax-seal.breaking,
.wax-seal.opening,
.wax-seal.opened {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
  pointer-events: none;
}

/* Texto inferior */
.stage-text {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-body);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  z-index: 25;
  text-align: center;
  white-space: nowrap;
}

.hint-text {
  animation: fadeInUp 0.6s ease;
}

.loading-text {
  opacity: 0.8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .wax-seal {
    width: 200px;
    height: 200px;
  }

  .stage-text {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
  }
}

@media (max-width: 360px) {
  .wax-seal {
    width: 170px;
    height: 170px;
  }
}
</style>
