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

## Testing

This component library will serve as the foundation for future projects, thus it is important to ensure that these components are well tested. Thankfully, Storybook provides many useful tools to test the components using various methods.

### Render Tests

Render tests (smoke tests), as one might expect, simply tes that the component renders as desired. These tests serve to find any errors that would cause the component to fail on render. Storybook turns each story into a render test. By adding stories to represent the various states of a component, you can confirm that the component will render in that state.

### Interaction Tests

After confirming that a component renders properly, you would likely next want to test that it behaves properly. These interaction tests can be written by adding a new story for the interaction you are testing, and then using the "play" method provided by Storybook to simulate user interactions and make assumptions against expected results. 

### Accessibility Tests

Storybook also provides addons to check components against accessibility rules. This ensures components meet certain standards. The configuration for which rules are applied as well as the result of not meeting said rules can be set in .storybook/preview.js. These properties can also be set at the Component and Story levels in case secific rulesets need to be applied or removed.

### Visual Tests 

Visual tests compare snapshots taken of components to catch unexpected visual changes. The Storybook developers provide a platform to run and manage these tests called Chromatic. 

### Running the tests

Tests can be executed via the Storybook UI or in the command line. 

#### Via Storybook

To run tests via the Storybook UI, first run 
```bash
npm run storybook
```

In the bottom left hand corner of the UI, you can open a menu to run tests and view test results.

![Storybook Testing Menu](/docs/images/image.png)

You can also view test results for specific stories in the playground for that story.

![Interaction Test](/docs/images/image-1.png)

![Visual Tests](/docs/images/image-2.png)

![Accessibility Test](/docs/images/image-3.png)

#### Via the command line

To run render, interaction and accessibility tests via the command line run the following command
```bash
npm run test-storybook
```

To run visual tests via the command line ensure CHROMATIC_PROJECT_TOKEN is added to your env and then run the following command
```bash
npm run chromatic
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
