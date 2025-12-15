# @cxl/ui 
	
[![npm version](https://badge.fury.io/js/%40cxl%2Fui.svg)](https://badge.fury.io/js/%40cxl%2Fui)

High-performance Web Components

## Project Details

-   Branch Version: [6.0.0-beta.6](https://npmjs.com/package/@cxl/ui/v/6.0.0-beta.6)
-   License: SEE LICENSE IN LICENSE.md
-   Documentation: [Link](https:/cxlio.github.io/docs/ui)
-   Report Issues: [Github](https://github.com/cxlio/ui-core/issues)

## Installation

	npm install @cxl/ui

# Get Started

Coaxial UI is a lightweight, framework-agnostic library of accessible web components. Built to help developers deliver high-performance, visually stunning, and inclusive applications without unnecessary complexity.

Fast. Accessible. Bloat-Free.

-   **Framework Agnostic:** Use it with React, Vue, Angular, or vanilla JavaScript.
-   **Accessibility First:** Designed to meet modern accessibility standards from the start.
-   **Fast Performance:** Minimal footprint, lightweight, and tree-shakable components that won’t slow you down.
-   **Global-Ready:** Built-in localization and internationalization.
-   **Customizable Themes:** Easily switch to dark mode or create brand-specific designs.

## Quick Start

We’ve made it ridiculously simple to integrate Coaxial UI into your stack.
Add components directly via CDN, no configuration required:

```demo
<script type="module" src="https://esm.run/@cxl/ui@5-beta"></script>
<c-alert>
	Hello World
</c-alert>
```

## Choosing the Right Installation Method

### CDN Link

The quickest way to get started with v5 is by including the CDN link to the main bundle containing all Coaxial UI components:

```html
<script type="module" src="https://esm.run/@cxl/ui@5-beta"></script>
```

You can also import specific components your application needs by using ES6 modules. Just include the exact modules you plan to use.

```html
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/@cxl/ui@5-beta/alert.js"
></script>
```

This example demonstrates basic usage with a CDN link for the ES6 module version of the alert component:

```demo
<script type="module" src="https://cdn.jsdelivr.net/npm/@cxl/ui@5-beta/alert.js"></script>
<c-alert>Hello World!</c-alert>
```

### Package Manager

If you use a package manager like npm or yarn. Install the package using the following command:

```bash
npm install @cxl/ui@<version>
# or
yarn add @cxl/ui@<version>
```

Note: Replace `<version>` with the specific version you want to install. You can omit the version number to install the latest stable version.

Coaxial UI follows semantic versioning.

No additional configuration steps are required after installing the package. However, depending on your build process, you might need to configure your build tool to handle the library.

#### Importing the library

You can integrate Coaxial UI into your project using two approaches:

1. Import the entire library directly in your source files:

```ts
import '@cxl/ui';
```

This approach imports all components and styles from the library at once. It's suitable for smaller projects or when you plan to use most of the components.

2. Import only the modules your UI needs.

```ts
import '@cxl/ui/alert.js';
```

This approach allows you to import only the modules your application needs. This is recommended for larger projects or to improve bundle size optimization.
