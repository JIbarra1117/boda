<template>
  <router-view />
</template>

<style>
@import './styles/variables.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1.2;
  color: var(--text-primary);
}

h1 {
  font-size: var(--text-5xl);
}

h2 {
  font-size: var(--text-3xl);
}

h3 {
  font-size: var(--text-2xl);
}

p {
  margin-bottom: var(--space-4);
}

a {
  color: var(--text-accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--text-primary);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  font-family: var(--font-body);
  cursor: pointer;
}

/* Utilidades de tipografía */
.font-script {
  font-family: var(--font-script);
}

.font-serif {
  font-family: var(--font-serif);
}

.font-display {
  font-family: var(--font-display);
}

/* Utilidades de layout */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.container-narrow {
  width: 100%;
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Animaciones globales */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Clases de utilidad para animación */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-lavender-soft);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-lavender);
}

/* Focus visible */
:focus-visible {
  outline: 2px solid var(--color-lavender-light);
  outline-offset: 2px;
}

/* Selección de texto */
::selection {
  background: var(--color-lavender-soft);
  color: var(--color-white);
}
</style>
