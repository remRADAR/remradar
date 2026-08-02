# ANIMATIONS

## Purpose

This document defines the animation principles, motion guidelines, and interaction standards for RADARCharts by REM.

Animations should improve usability, communicate hierarchy, and reinforce the platform's premium identity without distracting users.

---

# Motion Principles

## Smooth
Animations should feel natural and fluid.

## Fast
Most interface animations should complete within 150–300ms.

## Purposeful
Every animation must have a reason:
- Guide attention
- Confirm actions
- Improve navigation
- Reduce perceived loading time

Decorative animations should be used sparingly.

---

# Animation Categories

## Page Transitions

Examples:
- Home → Charts
- Charts → Artist
- Artist → Article

Guidelines:
- Fade
- Slide
- Scale
- Blur (minimal)

---

## Scroll Animations

Reveal content as it enters the viewport.

Examples:
- Headlines
- Cards
- Sections
- Statistics
- Hero content

Avoid excessive motion.

---

## Hover Effects

Buttons

Cards

Navigation

Album artwork

Artist images

Links

Hover effects should be subtle and responsive.

---

## Loading Animations

Use skeleton loaders instead of spinners whenever possible.

Loading indicators should:
- feel lightweight
- avoid blocking interaction
- preserve layout stability

---

## Hero Animations

Homepage hero

Featured charts

Magazine hero

Music highlights

These may include:
- layered movement
- parallax
- subtle floating elements
- gradient motion

---

## Chart Animations

Chart rankings

Trending indicators

Position changes

Badge updates

Animated counters

---

## Navigation

Menu opening

Search overlay

Drawer transitions

Breadcrumb transitions

---

## Modal Animations

Fade

Scale

Blur background

Maintain focus management.

---

## Page Section Transitions

Each section should transition consistently.

Preferred:
- Fade Up
- Fade In
- Slide Up

Avoid random animation styles.

---

# Accessibility

Respect reduced motion preferences.

If the user enables "Reduce Motion":

- Disable parallax
- Disable continuous movement
- Replace complex transitions with fades

Animations must never prevent interaction.

---

# Performance

Prioritize GPU-accelerated animations.

Animate:

- transform
- opacity

Avoid animating:

- width
- height
- top
- left
- margin

---

# Recommended Libraries

Primary:
- GSAP

Secondary:
- Framer Motion

Use CSS animations only for simple interactions.

---

# Duration Standards

| Animation | Duration |
|-----------|----------|
| Hover | 150ms |
| Button Press | 120ms |
| Card Hover | 200ms |
| Modal | 250ms |
| Page Transition | 300–500ms |
| Hero Sequence | 600–1200ms |

---

# Easing

Preferred easing:

- ease-out
- ease-in-out

Avoid:
- bounce
- elastic
- exaggerated easing

unless intentionally used for special experiences.

---

# Future Animations

- Welcome animation
- Chart reveal animation
- Search animation
- Magazine transitions
- XCAPE event effects
- Artist profile interactions
- Interactive statistics
- Seasonal themes

---

# Design Goal

Motion should make RADARCharts feel elegant, modern, and premium while maintaining excellent performance and accessibility across desktop and mobile devices.
