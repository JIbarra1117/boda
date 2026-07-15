<template>
  <section id="story" class="story-section">
    <div class="section-header" ref="headerRef" :class="{ 'is-visible': isHeaderVisible }">
      <span class="section-label">Nuestra Historia</span>
      <h2 class="section-title">Un amor que creció con el tiempo</h2>
      <p class="section-subtitle">
        Cada etapa nos fue preparando para encontrarnos y construir esta historia juntos.
      </p>
    </div>

    <div class="story-timeline">
      <div class="timeline-line" aria-hidden="true">
        <div class="timeline-progress" :style="{ height: progressHeight }"></div>
      </div>

      <div
        v-for="(group, index) in storyGroups"
        :key="`group-${index}`"
        ref="groupRefs"
        class="story-group"
        :class="{ 'is-visible': visibleGroups.has(index), 'is-active': activeGroup === index }"
        @mouseenter="activeGroup = index"
        @mouseleave="activeGroup = null"
        @click="toggleGroup(index)"
      >
        <div class="group-year">
          <span class="year-dot"></span>
          <span class="year-text">{{ group.year }}</span>
        </div>

        <svg
          class="group-curve"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M10 20 C45 20, 55 80, 90 80"
            fill="none"
            stroke="var(--color-lavender-soft)"
            stroke-width="3"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <div class="group-events">
          <div class="story-event event-left">
            <div class="event-photo" :style="{ width: groupSizes[index], height: groupSizes[index] }">
              <img
                :src="getImageUrl(group.left.imageName)"
                :alt="group.left.title"
                loading="lazy"
                @error="handleImageError($event, group.left.imageName)"
              />
            </div>
            <div class="event-content">
              <span class="event-stage">{{ group.left.stage }}</span>
              <h3 class="event-title">{{ group.left.title }}</h3>
              <p class="event-description">{{ group.left.description }}</p>
            </div>
          </div>

          <div class="story-event event-right">
            <div class="event-photo" :style="{ width: groupSizes[index], height: groupSizes[index] }">
              <img
                :src="getImageUrl(group.right.imageName)"
                :alt="group.right.title"
                loading="lazy"
                @error="handleImageError($event, group.right.imageName)"
              />
            </div>
            <div class="event-content">
              <span class="event-stage">{{ group.right.stage }}</span>
              <h3 class="event-title">{{ group.right.title }}</h3>
              <p class="event-description">{{ group.right.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-for="(event, index) in centerEvents"
        :key="`center-${index}`"
        ref="centerRefs"
        class="story-event center-event"
        :class="{ 'is-visible': visibleCenters.has(index), 'is-active': activeCenter === index }"
        @mouseenter="activeCenter = index"
        @mouseleave="activeCenter = null"
        @click="toggleCenter(index)"
      >
        <div class="event-marker" aria-hidden="true">
          <span class="marker-dot"></span>
          <span class="marker-year">{{ event.year }}</span>
        </div>

        <div class="event-photo" :style="{ width: centerSizes[index], height: centerSizes[index] }">
          <img
            :src="getImageUrl(event.imageName)"
            :alt="event.title"
            loading="lazy"
            @error="handleImageError($event, event.imageName)"
          />
        </div>

        <div class="event-content">
          <span class="event-stage">{{ event.stage }}</span>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-description">{{ event.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

interface StoryEvent {
  stage: string
  title: string
  description: string
  imageName: string
}

interface CenterEvent extends StoryEvent {
  year: string
}

interface StoryGroup {
  year: string
  left: StoryEvent
  right: StoryEvent
}

const storyGroups: StoryGroup[] = [
  {
    year: '2002',
    left: {
      stage: 'El Novio',
      title: 'A los 2 años',
      description: 'Jorge empezaba a descubrir el mundo con curiosidad y sonrisas.',
      imageName: 'novio-2',
    },
    right: {
      stage: 'La Novia',
      title: 'A los 2 años',
      description: 'Karen daba sus primeros pasos, llenando de luz cada rincón.',
      imageName: 'novia-2',
    },
  },
  {
    year: '2006',
    left: {
      stage: 'El Novio',
      title: 'A los 6 años',
      description: 'Jugando, aprendiendo y soñando con todo lo que vendría.',
      imageName: 'novio-6',
    },
    right: {
      stage: 'La Novia',
      title: 'A los 6 años',
      description: 'Karen crecía con dulzura, imaginando historias de princesas.',
      imageName: 'novia-6',
    },
  },
  {
    year: '2014',
    left: {
      stage: 'El Novio',
      title: 'A los 14 años',
      description: 'Jorge en su adolescencia, formando su carácter y sus sueños.',
      imageName: 'novio-14',
    },
    right: {
      stage: 'La Novia',
      title: 'A los 14 años',
      description: 'Karen descubriendo quién era, con la vida por delante.',
      imageName: 'novia-14',
    },
  },
]

const centerEvents: CenterEvent[] = [
  {
    year: '2018',
    stage: 'Nuestro encuentro',
    title: 'Cuando nos conocimos',
    description: 'Dos caminos que parecían separados se cruzaron por fin.',
    imageName: '2018-conocidos',
  },
  {
    year: '2022',
    stage: 'Novios',
    title: 'Juntos en esta aventura',
    description: 'Caminamos de la mano, construyendo recuerdos inolvidables.',
    imageName: 'novios',
  },
  {
    year: '2026',
    stage: 'La propuesta',
    title: '¿Quieres casarte conmigo?',
    description: 'En un momento lleno de amor y emoción, dimos el sí más importante.',
    imageName: 'propuesta',
  },
]

const groupSizes = ['220px', '260px', '300px']
const centerSizes = ['280px', '320px', '360px', '400px']

const getImageUrl = (name: string) => `/imgs/historia/${name}.jpg`

const handleImageError = (event: Event, name: string) => {
  const img = event.target as HTMLImageElement
  if (!img) return

  if (img.src.endsWith('.jpg')) {
    img.src = `/imgs/historia/${name}.jpeg`
  }
}

const { elementRef: headerRef, isVisible: isHeaderVisible } = useScrollReveal()

const groupRefs = ref<HTMLElement[]>([])
const visibleGroups = ref(new Set<number>())

const centerRefs = ref<HTMLElement[]>([])
const visibleCenters = ref(new Set<number>())

const activeGroup = ref<number | null>(null)
const activeCenter = ref<number | null>(null)
const progressHeight = ref('0%')

const toggleGroup = (index: number) => {
  activeGroup.value = activeGroup.value === index ? null : index
}

const toggleCenter = (index: number) => {
  activeCenter.value = activeCenter.value === index ? null : index
}

let observer: IntersectionObserver | null = null
let focusObserver: IntersectionObserver | null = null

const updateProgress = () => {
  const timeline = document.querySelector('.story-timeline')
  const section = document.querySelector('.story-section')
  if (!timeline || !section) return

  const sectionRect = section.getBoundingClientRect()
  const timelineRect = timeline.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  // El progreso comienza cuando la parte superior de la sección entra a la mitad inferior de la pantalla
  // y termina cuando la parte inferior de la sección sale por la parte inferior
  const start = sectionRect.top - viewportHeight * 0.6
  const end = timelineRect.bottom - viewportHeight * 0.4
  const total = end - start
  const current = -start

  const progress = Math.max(0, Math.min(1, current / total))
  progressHeight.value = `${progress * 100}%`
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    storyGroups.forEach((_, index) => visibleGroups.value.add(index))
    centerEvents.forEach((_, index) => visibleCenters.value.add(index))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'))
          const type = entry.target.getAttribute('data-type')
          if (type === 'group') {
            visibleGroups.value.add(index)
          } else {
            visibleCenters.value.add(index)
          }
        }
      })
    },
    { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
  )

  groupRefs.value.forEach((el, index) => {
    el.setAttribute('data-index', String(index))
    el.setAttribute('data-type', 'group')
    observer?.observe(el)
  })

  centerRefs.value.forEach((el, index) => {
    el.setAttribute('data-index', String(index))
    el.setAttribute('data-type', 'center')
    observer?.observe(el)
  })

  focusObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-focused', entry.isIntersecting)
      })
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  )

  document.querySelectorAll('.story-group, .story-event, .center-event').forEach((el) => {
    focusObserver?.observe(el)
  })

  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
})

onUnmounted(() => {
  observer?.disconnect()
  focusObserver?.disconnect()
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<style scoped>
.story-section {
  padding: var(--space-24) var(--space-6);
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.section-header {
  text-align: center;
  max-width: var(--max-width-content);
  margin: 0 auto var(--space-16);
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
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

/* Timeline container */
.story-timeline {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
}

/* Central straight line for shared events */
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--color-lavender-soft) 10%,
    var(--color-lavender-soft) 90%,
    transparent 100%
  );
  transform: translateX(-50%);
  z-index: 1;
  overflow: hidden;
}

.timeline-progress {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: linear-gradient(
    180deg,
    var(--color-lavender-light) 0%,
    var(--color-sage) 100%
  );
  transition: height 0.3s ease-out;
}

/* Story group (one year, two photos) */
.story-group {
  position: relative;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  z-index: 2;
  cursor: pointer;
}

.story-group.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.group-year {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-style: italic;
  color: var(--text-primary);
  z-index: 4;
  background: var(--bg-secondary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: 2px solid var(--color-lavender-soft);
  box-shadow: 0 0 0 4px rgba(194, 184, 227, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.year-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-lavender-soft);
}

.story-group.is-active .group-year,
.story-group:hover .group-year {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 0 0 8px rgba(194, 184, 227, 0.25);
}

.group-curve {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.story-group:hover .group-curve,
.story-group.is-active .group-curve {
  opacity: 1;
}

.group-curve path {
  filter: drop-shadow(0 1px 2px rgba(192, 184, 227, 0.4));
}

.group-events {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
}

/* Story event */
.story-event {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  width: 45%;
  transition: transform 0.4s ease;
}

.story-group:hover .story-event,
.story-group.is-active .story-event {
  transform: translateY(-4px);
}

.event-left {
  align-items: flex-end;
  text-align: right;
}

.event-right {
  align-items: flex-start;
  text-align: left;
}

/* Event photo */
.event-photo {
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid var(--color-white);
  box-shadow: var(--shadow-md);
  background: var(--bg-accent);
  flex-shrink: 0;
  position: relative;
  z-index: 3;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.story-event:hover .event-photo,
.story-event.is-active .event-photo {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

/* Zoom al enfocar con scroll (desktop: grupo completo) */
.story-group.is-focused .event-photo,
.center-event.is-focused .event-photo {
  transform: scale(1.08);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.event-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.story-event:hover .event-photo img,
.story-event.is-active .event-photo img {
  transform: scale(1.08);
}

/* Event content */
.event-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 340px;
  position: relative;
  z-index: 3;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: rgba(250, 248, 245, 0.7);
  backdrop-filter: blur(4px);
  transition: background 0.3s ease, transform 0.3s ease;
}

.story-event:hover .event-content,
.story-event.is-active .event-content {
  background: var(--color-white);
  transform: translateY(-2px);
}

.event-left .event-content {
  align-items: flex-end;
}

.event-right .event-content {
  align-items: flex-start;
}

.event-stage {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.event-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin: 0;
}

.event-description {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Center events */
.center-event {
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 560px;
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  cursor: pointer;
}

.center-event.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.center-event:hover,
.center-event.is-active {
  transform: translateY(-6px);
}

.event-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  position: relative;
  z-index: 3;
  background: var(--bg-secondary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: 2px solid var(--color-lavender-soft);
  box-shadow: 0 0 0 4px rgba(194, 184, 227, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.center-event:hover .event-marker,
.center-event.is-active .event-marker {
  transform: scale(1.1);
  box-shadow: 0 0 0 8px rgba(194, 184, 227, 0.25);
}

.center-event .event-content {
  background: var(--color-white);
  padding: var(--space-5) var(--space-8);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  align-items: center;
  max-width: 460px;
}

.center-event:hover .event-content,
.center-event.is-active .event-content {
  box-shadow: var(--shadow-md);
}

.marker-dot,
.year-dot {
  display: none;
}

.marker-year {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-style: italic;
  color: var(--text-primary);
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 1100px) {
  .story-timeline {
    max-width: 1000px;
    gap: var(--space-16);
  }

  .event-title {
    font-size: var(--text-xl);
  }

  .event-description {
    font-size: var(--text-sm);
  }
}

@media (max-width: 900px) {
  .story-timeline {
    max-width: 900px;
  }

  .event-content {
    max-width: 280px;
  }
}

@media (max-width: 768px) {
  .story-section {
    padding: var(--space-16) var(--space-4);
  }

  .story-timeline {
    gap: var(--space-12);
    padding-left: 80px;
  }

  .timeline-line {
    left: 40px;
    transform: none;
  }

  .story-group,
  .center-event {
    padding-left: 0;
  }

  .group-curve {
    display: none;
  }

  .group-year {
    position: absolute;
    left: -40px;
    top: 0;
    transform: translateX(-50%);
    margin-bottom: 0;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-4);
  }

  .story-group.is-active .group-year,
  .story-group:hover .group-year {
    transform: translateX(-50%) scale(1.1);
  }

  .group-events {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-8);
  }

  .story-event {
    width: 100%;
    align-items: flex-start !important;
    text-align: left !important;
    flex-direction: row;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--color-white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
  }

  .story-event:hover,
  .story-event.is-active {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .event-left .event-content,
  .event-right .event-content {
    align-items: flex-start !important;
    text-align: left !important;
    background: transparent;
    padding: 0;
    max-width: none;
  }

  .event-photo {
    width: 100px !important;
    height: 100px !important;
    flex-shrink: 0;
  }

  .center-event {
    align-items: flex-start;
    text-align: left;
    padding-left: 0;
    max-width: none;
  }

  .center-event .event-photo {
    width: 140px !important;
    height: 140px !important;
  }

  .center-event .event-content {
    align-items: flex-start;
    text-align: left;
    padding: var(--space-4);
    max-width: none;
  }

  .event-marker {
    position: absolute;
    left: -40px;
    top: 0;
    margin-bottom: 0;
    transform: translateX(-50%);
  }

  .center-event:hover .event-marker,
  .center-event.is-active .event-marker {
    transform: translateX(-50%) scale(1.1);
  }

  /* Zoom al enfocar con scroll (mobile: evento individual) */
  .story-event.is-focused .event-photo {
    transform: scale(1.08);
    box-shadow: var(--shadow-lg), var(--shadow-glow);
  }
}

@media (max-width: 480px) {
  .story-event {
    flex-direction: column;
    align-items: center !important;
    text-align: center !important;
  }

  .event-left .event-content,
  .event-right .event-content,
  .center-event .event-content {
    align-items: center !important;
    text-align: center !important;
  }

  .event-photo {
    width: 130px !important;
    height: 130px !important;
  }

  .center-event .event-photo {
    width: 160px !important;
    height: 160px !important;
  }
}
</style>
