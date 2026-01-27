A modern Web Components library using CSS custom properties and shadow DOM for flexible, isolated, and themeable UI elements.


# Get Started

Coaxial UI is a lightweight, framework-agnostic library of accessible web components.

- **Framework Agnostic:** Use it with React, Vue, Angular, or vanilla JavaScript.
- **Accessibility First:** Designed to meet modern accessibility standards.
- **Fast Performance:** Minimal footprint, lightweight, and tree-shakable components.
- **Global-Ready:** Built-in localization and internationalization.
- **Customizable Themes:** Easily switch to dark mode or create brand-specific designs.

[Documentation](https://cxlio.github.io/docs/@cxl/ui/)

## Quick Start

Add components directly via CDN, no configuration required:

```demo
<script type="module" src="https://esm.run/@cxl/ui@5-beta"></script>
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

No additional configuration steps are required after installing the package. However, depending on your build process, you might need to configure your build tool to handle the library.


## Packages

| Name           | License | Description                          | Links                                          |
| -------------- | ------- | ------------------------------------ | ---------------------------------------------- |
| @cxl/ui              | SEE LICENSE IN LICENSE.md | High-performance Web Components | [Docs](https://cxlio.github.io/docs/@cxl/ui/6.0.0-beta.7/) |

