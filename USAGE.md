# Get Started

Coaxial UI is a lightweight, framework-agnostic library of accessible web components.

- **Framework Agnostic:** Use it with React, Vue, Angular, or vanilla JavaScript.
- **Accessibility First:** Designed to meet modern accessibility standards.
- **Fast Performance:** Minimal footprint, lightweight, and tree-shakable components.
- **Global-Ready:** Built-in localization and internationalization.
- **Customizable Themes:** Easily switch to dark mode or create brand-specific designs.

## Quick Start

Add components directly via CDN, no configuration required:

```demo
<script type="module" src="https://esm.run/@cxl/ui@6.1.0"></script>
<c-alert>
	Hello World
</c-alert>
```

## Choosing the Right Installation Method

### CDN Link

The quickest way to get started with is by including the CDN link to the main bundle containing all Coaxial UI components:

```html
<script type="module" src="https://esm.run/@cxl/ui"></script>
```

You can also import specific components by using ES6 modules.

```html
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/@cxl/ui/alert.js"
></script>
```

This example demonstrates basic usage with a CDN link for the ES6 module version of the alert component:

```demo
<script type="module" src="https://cdn.jsdelivr.net/npm/@cxl/ui@6.1.0/alert.js"></script>
<c-alert>Hello World!</c-alert>
```

### Package Manager

Install the package with npm or yarn:

```bash
npm install @cxl/ui
# or
yarn add @cxl/ui
```

Import the full component bundle or individual component modules:

```js
import '@cxl/ui';
import '@cxl/ui/alert.js';
```

