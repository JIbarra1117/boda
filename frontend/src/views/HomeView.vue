<template>
  <div class="home">
    <AppHeader
      v-if="!showIntro"
      :bride-name="settings?.brideName"
      :groom-name="settings?.groomName"
    />

    <EnvelopeIntro
      v-if="showIntro"
      :is-loading="loading"
      :is-opening="isOpening"
      :is-breaking="isBreaking"
      :is-opened="isOpened"
      @open="startOpening"
    />

    <main
      v-if="!loading"
      class="invitation-content"
      :class="{ 'is-revealing': isOpening, 'is-revealed': isOpened }"
    >
      <HeroSection :settings="settings" />
      <CoupleSection :settings="settings" />
      <StorySection />
      <DetailsSection :settings="settings" />
      <CountdownSection :settings="settings" />
      <VerseSection />
      <RsvpSection />
      <GiftsSection :settings="settings" />
    </main>

    <template v-if="!loading && isOpened">
      <AppFooter
        :bride-name="settings?.brideName"
        :groom-name="settings?.groomName"
        :wedding-date="settings?.weddingDate"
      />

      <MusicToggle v-if="musicReady" :src="musicUrl" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { api } from '@/api/api'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import MusicToggle from '@/components/MusicToggle.vue'
import EnvelopeIntro from '@/components/EnvelopeIntro.vue'
import HeroSection from '@/components/HeroSection.vue'
import CoupleSection from '@/components/sections/CoupleSection.vue'
import DetailsSection from '@/components/sections/DetailsSection.vue'
import CountdownSection from '@/components/sections/CountdownSection.vue'
import RsvpSection from '@/components/sections/RsvpSection.vue'
import GiftsSection from '@/components/sections/GiftsSection.vue'
import StorySection from '@/components/sections/StorySection.vue'
import VerseSection from '@/components/sections/VerseSection.vue'
import type { WeddingSettings } from '@/types'

const settings = ref<WeddingSettings | null>(null)
const loading = ref(true)
const isBreaking = ref(false)
const isOpening = ref(false)
const isOpened = ref(false)
const musicReady = ref(false)

const showIntro = computed(() => loading.value || !isOpened.value)

const musicUrl = '/music/QuererMejor-JuanesftAlessiaCara.mp3'

const setBodyScroll = (enabled: boolean) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = enabled ? '' : 'hidden'
}

watch(showIntro, (locked) => {
  setBodyScroll(!locked)
}, { immediate: true })

const startOpening = () => {
  if (isOpening.value || isOpened.value) return

  isBreaking.value = true
  isOpening.value = true

  setTimeout(() => {
    isBreaking.value = false
  }, 350)

  setTimeout(() => {
    isOpened.value = true
  }, 2600)

  setTimeout(() => {
    musicReady.value = true
  }, 3400)
}

onMounted(async () => {
  try {
    settings.value = await api.getSettings()
  } catch (e) {
    console.error('Error loading settings', e)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1200)
  }
})

onUnmounted(() => {
  setBodyScroll(true)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--bg-primary);
}

.invitation-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: scale(0.96);
  transition: none;
}

.invitation-content.is-revealing {
  animation: contentReveal 2.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.invitation-content.is-revealed {
  opacity: 1;
  transform: scale(1);
}

@keyframes contentReveal {
  0% {
    opacity: 0.25;
    transform: scale(0.98);
  }
  15% {
    opacity: 0.55;
    transform: scale(0.99);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
