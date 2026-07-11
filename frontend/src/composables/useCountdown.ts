import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useCountdown(targetDate: string | Date) {
  const now = ref(new Date())
  let interval: number

  const timeLeft = computed(() => {
    const target = new Date(targetDate).getTime()
    const current = now.value.getTime()
    const diff = target - current

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    }
  })

  onMounted(() => {
    interval = window.setInterval(() => {
      now.value = new Date()
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })

  return { timeLeft }
}
