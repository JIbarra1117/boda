<template>
  <section class="gifts-section">
    <div class="gifts-content">
      <h2>Regalos</h2>
      <p class="gifts-message">
        Si deseas regalarnos algo más que tu hermosa presencia...
      </p>
      <div class="bank-card" v-if="settings?.bankAccountNumber">
        <div class="bank-row">
          <span class="bank-label">Banco</span>
          <span class="bank-value">{{ settings.bankName }}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Titular</span>
          <span class="bank-value">{{ settings.bankAccountName }}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Cuenta</span>
          <span class="bank-value account">{{ settings.bankAccountNumber }}</span>
        </div>
      </div>
      <div v-else class="no-data">
        <p>Los datos bancarios se publicarán pronto.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  settings: any
}>()
</script>

<style scoped>
.gifts-section {
  padding: 3rem 1.5rem;
  background-color: #EBE7E5;
}

.gifts-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  font-size: 2rem;
  color: #2b1c43;
  margin-bottom: 1rem;
}

.gifts-message {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 1.15rem;
  color: #80849E;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.bank-card {
  background: white;
  border: 1px solid #C2B8E3;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.bank-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #EBE7E5;
}

.bank-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.bank-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #80849E;
}

.bank-value {
  font-weight: 700;
  color: #2b1c43;
  font-size: 1rem;
}

.bank-value.account {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
}

.no-data {
  color: #80849E;
  font-style: italic;
}
</style>
