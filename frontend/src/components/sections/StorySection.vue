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
      <div class="timeline-line" aria-hidden="true"></div>

      <div
        v-for="(group, index) in storyGroups"
        :key="`group-${index}`"
        ref="groupRefs"
        class="story-group"
        :class="{ 'is-visible': visibleGroups.has(index) }"
      >
        <div class="group-year">{{ group.year }}</div>

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
            <div class="event-photo">
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
            <div class="event-photo">
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
        :class="{ 'is-visible': visibleCenters.has(index) }"
      >
        <div class="event-marker" aria-hidden="true">
          <span class="marker-dot"></span>
          <span class="marker-year">{{ event.year }}</span>
        </div>

        <div class="event-photo">
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
    year: '2019',
    stage: 'Novios',
    title: 'Empezamos nuestra historia',
    description: 'Decidimos caminar juntos, construyendo recuerdos inolvidables.',
    imageName: 'novios',
  },
  {
    year: '2024',
    stage: 'La propuesta',
    title: '¿Quieres casarte conmigo?',
    description: 'En un momento lleno de amor y emoción, dimos el sí más importante.',
    imageName: 'propuesta',
  },
]

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

let observer: IntersectionObserver | null = null

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
})

onUnmounted(() => {
  observer?.disconnect()
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
  gap: var(--space-16);
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
}

/* Story group (one year, two photos) */
.story-group {
  position: relative;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  z-index: 2;
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
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-style: italic;
  color: var(--text-primary);
  z-index: 4;
  background: var(--bg-secondary);
  padding: var(--space-1) var(--space-2);
}

.group-curve {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
  width: 320px;
  height: 320px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid var(--color-white);
  box-shadow: var(--shadow-md);
  background: var(--bg-accent);
  flex-shrink: 0;
  position: relative;
  z-index: 3;
}

.event-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Event content */
.event-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 340px;
  position: relative;
  z-index: 3;
}

.event-stage {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.event-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--text-primary);
  margin: 0;
}

.event-description {
  font-family: var(--font-body);
  font-size: var(--text-lg);
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
  max-width: 520px;
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.center-event.is-visible {
  opacity: 1;
  transform: translateY(0);
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
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

.center-event .event-content {
  background: var(--bg-secondary);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
}

.marker-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 3px solid var(--color-lavender-soft);
  box-shadow: 0 0 0 4px rgba(194, 184, 227, 0.2);
}

.marker-year {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-style: italic;
  color: var(--text-primary);
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 1100px) {
  .story-timeline {
    max-width: 1000px;
  }

  .event-photo {
    width: 260px;
    height: 260px;
  }

  .event-title {
    font-size: var(--text-2xl);
  }

  .event-description {
    font-size: var(--text-base);
  }
}

@media (max-width: 900px) {
  .story-timeline {
    max-width: 900px;
  }

  .event-photo {
    width: 200px;
    height: 200px;
  }

  .event-title {
    font-size: var(--text-lg);
  }

  .event-description {
    font-size: var(--text-sm);
  }
}

@media (max-width: 640px) {
  .group-events {
    flex-direction: column;
    align-items: center;
    gap: var(--space-8);
  }

  .story-event {
    width: 100%;
    align-items: center !important;
    text-align: center !important;
  }

  .event-content {
    align-items: center !important;
  }

  .group-curve {
    display: none;
  }

  .group-year {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    margin-bottom: var(--space-4);
    text-align: center;
  }

  .event-photo {
    width: 160px;
    height: 160px;
  }

  .center-event .event-photo {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 400px) {
  .event-photo {
    width: 140px;
    height: 140px;
  }

  .center-event .event-photo {
    width: 160px;
    height: 160px;
  }
}
</style>
