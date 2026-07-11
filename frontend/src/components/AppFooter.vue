<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="footer-names">{{ brideName || 'Karen' }} & {{ groomName || 'Jorge' }}</p>
      <p class="footer-thanks">Gracias por ser parte de nuestra historia</p>
      <div class="footer-divider">
        <span></span>
        <span class="heart">♥</span>
        <span></span>
      </div>
      <p class="footer-date">{{ formattedDate }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parseWeddingDate } from '@/utils/date'

const props = defineProps<{
  brideName?: string
  groomName?: string
  weddingDate?: string
}>()

const formattedDate = computed(() => {
  const date = parseWeddingDate(props.weddingDate)
  if (!date) return ''
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<style scoped>
.app-footer {
  background: var(--bg-secondary);
  padding: var(--space-16) var(--space-6);
  text-align: center;
}

.footer-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.footer-names {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-style: italic;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.footer-thanks {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.footer-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.footer-divider span:first-child,
.footer-divider span:last-child {
  width: 60px;
  height: 1px;
  background: var(--color-lavender-soft);
}

.heart {
  color: var(--color-rose);
  font-size: var(--text-xl);
  animation: pulse-soft 2s ease-in-out infinite;
}

.footer-date {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  margin: 0;
}

@media (max-width: 640px) {
  .footer-names {
    font-size: var(--text-2xl);
  }
}
</style>
