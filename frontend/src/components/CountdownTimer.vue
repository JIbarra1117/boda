<template>
  <div class="countdown" v-if="timeLeft">
    <div class="countdown-item" v-for="(item, index) in items" :key="item.label">
      <div class="countdown-card">
        <span class="number">{{ item.value }}</span>
        <span class="label">{{ item.label }}</span>
      </div>
      <span v-if="index < items.length - 1" class="separator">:</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{
  targetDate: string
}>()

const { timeLeft } = useCountdown(props.targetDate)

const items = computed(() => [
  { value: String(timeLeft.value.days).padStart(2, '0'), label: 'Días' },
  { value: String(timeLeft.value.hours).padStart(2, '0'), label: 'Horas' },
  { value: String(timeLeft.value.minutes).padStart(2, '0'), label: 'Minutos' },
  { value: String(timeLeft.value.seconds).padStart(2, '0'), label: 'Segundos' },
])
</script>

<style scoped>
.countdown {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.countdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.countdown-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  padding: var(--space-4) var(--space-5);
  background: var(--color-white);
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.number {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1;
}

.label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  margin-top: var(--space-2);
}

.separator {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--color-lavender-soft);
  line-height: 1;
  margin-top: -var(--space-4);
}

@media (max-width: 480px) {
  .countdown-card {
    min-width: 68px;
    padding: var(--space-3) var(--space-2);
  }

  .number {
    font-size: var(--text-3xl);
  }

  .label {
    font-size: 0.65rem;
    letter-spacing: 0.08em;
  }

  .separator {
    font-size: var(--text-2xl);
  }
}
</style>
