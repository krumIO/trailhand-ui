# Trailhand UI

A component library built with Lit Element web components, TypeScript, and Storybook.

## Installation

```bash
npm install @krumio/trailhand-ui
```

## Usage

```javascript
// Import components
import '@krumio/trailhand-ui/toggle-switch';
import '@krumio/trailhand-ui/data-table';
import '@krumio/trailhand-ui/action-menu';

// Import global color variables (optional)
import '@krumio/trailhand-ui/styles/colors.css';
```

```html
<!-- Use in HTML -->
<toggle-switch onLabel="On" offLabel="Off"></toggle-switch>
```

## Global Color Variables

Trailhand UI includes a design system with CSS custom properties. Import `colors.css` to use consistent colors across your app:

```css
/* Available variables */
--color-primary: #3d98d3;
--color-white: #FFFFFF;
--color-black: #000000;

/* Greyscale */
--color-grey-100 through --color-grey-800

/* Semantic aliases */
--color-text-primary: #212121;
--color-text-secondary: #636363;
--color-text-muted: #8D8D8D;
--color-background: #FFFFFF;
--color-border: #D7D7D7;
--color-error: #9F3A3A;
--color-success: #30AC66;
--color-warning: #D3C255;
```

### Theming

Override any variable to customize the look:

```css
:root {
  --color-primary: #your-brand-color;
}
```

## Development

### Recommended IDE Setup

VSCode with ES6, Lit, and TypeScript plugin support.

### Project Setup

```bash
npm install
```

### Storybook Development

```bash
npm run storybook
```

### Build for Production

```bash
npm run build
```

### Build Storybook Static Site

```bash
npm run build-storybook
```

## File Structure

```
trailhand-ui/
├── src/
│   ├── components/           # Web components (TypeScript)
│   │   ├── toggle-switch/
│   │   ├── data-table/
│   │   └── action-menu/
│   ├── design-system/        # Design system stories
│   └── styles/
│       └── colors.css        # Global color variables
├── stories/                  # Additional Storybook stories
├── .storybook/               # Storybook configuration
├── dist/                     # Compiled output
└── package.json
```

## Components

### ToggleSwitch

A reusable toggle for boolean values with sync and persistence features.

```html
<toggle-switch
  onLabel="On"
  offLabel="Off"
  name="my-toggle"
  storage-key="my-setting"
></toggle-switch>
```

### DataTable

A sortable, paginated data table with search and custom actions.

```html
<data-table
  .columns=${columns}
  .data=${data}
  searchable
  paginated
></data-table>
```

### ActionMenu

A dropdown menu for row-level actions in tables.

```html
<action-menu
  .actions=${[
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete', variant: 'danger' }
  ]}
></action-menu>
```

## Tech Stack

- **Lit Element** 3.x - Web component library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Storybook** 8.x - Component documentation
- **Vitest** - Testing framework
- **Node.js** v20.18.0+

## Web Components

This library uses **Lit Element** for building fast, lightweight web components. Web components are framework-agnostic and work with any JavaScript framework or vanilla JS.

### Benefits
- Framework agnostic
- Encapsulated styles and functionality
- Reusable across projects
- Based on web standards
- TypeScript support with full type definitions

Learn more at [lit.dev](https://lit.dev)
