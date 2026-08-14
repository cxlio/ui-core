# Coaxial UI

`@cxl/ui` is a framework-agnostic TypeScript library of browser-native custom elements (`c-*`). It provides reusable UI components and the primitives used to build them.

## Principles

- Standards first: Custom Elements, Shadow DOM, attributes, properties, events, slots, and CSS custom properties.
- Modular: ES modules support root and direct `@cxl/ui/*.js` imports.
- Typed and reactive: strict TypeScript APIs with observable bindings tied to element lifecycles.
- Accessible: native semantics, keyboard and focus behavior, validation, and reduced motion.
- Adaptable: responsive themes, localization, and LTR/RTL directionality.

## Scope

Controls, forms, layout, navigation, routing, overlays, feedback, data display, theming, localization, accessibility, and reactive utilities.

## Non-Goals

Framework wrappers, application architecture, backend or business logic, and server rendering without a browser DOM.

Changes should be reusable, browser-native, typed, accessible, independently importable, and tested.
