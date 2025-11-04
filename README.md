# Trailhand UI

A component library built with Lit Element web components and Storybook.

## Recommended IDE Setup

VSCode with ES6 and Lit plugin support.

## Project Setup

```bash
npm install
```

### Compile and Hot-Reload for Development

```bash
npm start
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
├── Components/           # Web components
├── stories/              # Storybook stories
├── .storybook/           # Storybook configuration
│   ├── main.js
│   └── preview.js
├── index.html            # Demo page
└── package.json
```

## Web Components

This library uses **Lit Element** for building fast, lightweight web components. Web components are framework-agnostic and work with any JavaScript framework or vanilla JS.

### Benefits
- Framework agnostic
- Encapsulated styles and functionality
- Reusable across projects
- Based on web standards

Learn more at [lit.dev](https://lit.dev)

## Storybook

Storybook provides an isolated environment for component development and documentation.

### Setup

Storybook was initialized using:

```bash
npm create storybook@latest
```

**Configuration:**
- Framework: `@storybook/web-components-vite`
- Addons: `addon-essentials`, `addon-a11y`
- ES Modules: `"type": "module"` in package.json
- Version: 8.6.14 (for Node.js v20.18.0 compatibility)

### Writing Stories

Every component should have stories that demonstrate its various states and configurations.

```javascript
export default {
  title: 'Components/ComponentName',
  tags: ['autodocs'],
};

export const Default = {
  args: {
    // component props
  },
};
```

## Tech Stack

- **Lit Element** 3.3.1 - Web component library
- **Vite** 6.4.1 - Build tool
- **Storybook** 8.6.14 - Component documentation
- **Node.js** v20.18.0+
