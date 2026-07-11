# Sistema de Diseño — Invitación de Boda

## Paleta de Colores

```css
--color-cream: #FAF8F5;
--color-champagne: #F3EFE9;
--color-sand: #EBE7E5;
--color-sage: #2b1c43;
--color-sage-dark: #1a1129;
--color-sage-light: #6d5f82;
--color-lavender: #80849E;
--color-lavender-light: #A0B1E3;
--color-lavender-soft: #C2B8E3;
--color-blush: #E8D5C4;
--color-rose: #D4A5A5;
--color-gold: #C9B99A;
--color-charcoal: #4A403A;
--color-white: #FFFFFF;

--bg-primary: var(--color-cream);
--bg-secondary: var(--color-champagne);
--bg-accent: var(--color-sand);

--text-primary: var(--color-sage);
--text-secondary: var(--color-lavender);
--text-accent: var(--color-lavender-light);
--text-muted: var(--color-sage-light);
```

Uso: fondos cremas/champagne alternados, texto púrpura oscuro, acentos lavanda, detalles blush y gold.

## Tipografías

```css
--font-display: 'Playfair Display', 'Cormorant Garamond', serif;
--font-serif: 'Cormorant Garamond', 'Playfair Display', serif;
--font-script: 'Great Vibes', cursive;
--font-body: 'Lato', sans-serif;
```

- **Playfair Display**: títulos y nombres elegantes.
- **Cormorant Garamond**: citas, versículos y textos románticos en cursiva.
- **Great Vibes**: iniciales, ampersand y detalles decorativos.
- **Lato**: cuerpo de texto, etiquetas y formularios.

## Filosofía de UI

- **Airy design**: espaciado generoso, contenido centrado, fondos suaves alternados.
- **Animaciones nativas**: transiciones CSS puras, keyframes y transformaciones 3D.
- **Scroll reveal**: la clase `.is-visible` se aplica vía `IntersectionObserver` para revelar secciones suavemente.
- **Apertura de carta**: efecto 3D con `rotateY`, `perspective` y `preserve-3d`.
- **Responsive**: mobile-first con breakpoints en 640px y 900px.

## Restricción Técnica

**Prohibido** usar frameworks de componentes o utilidades CSS como Tailwind CSS, Vuetify, Element Plus, Bootstrap o similares.

Todo el diseño debe implementarse con:
- CSS puro y variables nativas.
- Componentes propios en Vue 3 con TypeScript.
- Composables propios (ej. `useScrollReveal`).
