<template>
  <section id="gifts" class="gifts-section">
    <div class="gifts-content">
      <div class="section-header" ref="elementRef" :class="{ 'is-visible': isVisible }">
        <span class="section-label">Regalos</span>
        <h2 class="section-title">Nuestro Mejor Regalo</h2>
      </div>

      <div class="gifts-card" ref="elementRef2" :class="{ 'is-visible': isVisible2 }">
        <div class="gift-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="8" width="18" height="13" rx="2"/>
            <path d="M12 8v13M7 8V6a2 2 0 012-2h0a2 2 0 012 2v2M13 8V6a2 2 0 012-2h0a2 2 0 012 2v2M3 12h18"/>
          </svg>
        </div>

        <p class="gifts-message">
          El mejor regalo es tu compañía en este día tan especial. Si además deseas hacernos un presente, una lluvia de sobres o una transferencia nos ayudará a comenzar esta nueva etapa.
        </p>

        <div v-if="settings?.bankAccountNumber" class="bank-card">
          <div class="bank-header">
            <span class="bank-title">Datos Bancarios</span>
          </div>

          <div class="bank-row">
            <div class="bank-info">
              <span class="bank-label">Banco</span>
              <span class="bank-value">{{ settings.bankName }}</span>
            </div>
          </div>

          <div class="bank-row">
            <div class="bank-info">
              <span class="bank-label">Titular</span>
              <span class="bank-value">{{ settings.bankAccountName }}</span>
            </div>
          </div>

          <div class="bank-row">
            <div class="bank-info">
              <span class="bank-label">Cuenta</span>
              <span class="bank-value account">{{ settings.bankAccountNumber }}</span>
            </div>
            <button class="copy-btn" @click="copyAccount" type="button">
              <span v-if="copied">¡Copiado!</span>
              <span v-else>Copiar</span>
            </button>
          </div>
        </div>

        <div v-else class="coming-soon">
          <p>Los datos bancarios se publicarán próximamente.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import type { WeddingSettings } from '@/types'

const props = defineProps<{
  settings: WeddingSettings | null
}>()

const { elementRef, isVisible } = useScrollReveal()
const { elementRef: elementRef2, isVisible: isVisible2 } = useScrollReveal()

const copied = ref(false)

const copyAccount = async () => {
  if (!props.settings?.bankAccountNumber) return
  try {
    await navigator.clipboard.writeText(props.settings.bankAccountNumber)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('Error copying', e)
  }
}
</script>

<style scoped>
.gifts-section {
  padding: var(--space-24) var(--space-6);
  background: var(--bg-primary);
}

.gifts-content {
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

.gifts-card {
  background: var(--color-white);
  border: 1px solid var(--color-lavender-soft);
  border-radius: var(--radius-xl);
  padding: var(--space-12) var(--space-10);
  text-align: center;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.gifts-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.gift-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto var(--space-6);
  color: var(--text-accent);
}

.gift-icon svg {
  width: 100%;
  height: 100%;
}

.gifts-message {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-8);
}

.bank-card {
  background: var(--bg-primary);
  border: 1px solid var(--color-sand);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: left;
}

.bank-header {
  text-align: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-sand);
}

.bank-title {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.bank-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-sand);
}

.bank-row:last-child {
  border-bottom: none;
}

.bank-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.bank-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.bank-value {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.bank-value.account {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
  font-size: var(--text-base);
}

.copy-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--text-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all var(--transition-fast);
}

.copy-btn:hover {
  background: var(--color-sage-dark);
  transform: translateY(-1px);
}

.coming-soon {
  padding: var(--space-6);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.coming-soon p {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 640px) {
  .gifts-card {
    padding: var(--space-8) var(--space-4);
  }

  .bank-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .copy-btn {
    align-self: flex-start;
  }
}
</style>
