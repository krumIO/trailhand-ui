import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './icon';
import type { IconProps } from './icon';
import { availableIcons } from './icon';

const meta: Meta<IconProps> = {
  title: 'Components/Icon',
  component: 'trailhand-icon',
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: availableIcons,
      description: 'The Font Awesome duotone icon name',
    },
  },
  args: {
    name: 'globe',
  },
  parameters: {
    docs: {
      description: {
        component: `
A wrapper component for Font Awesome icons.

**Features:**
- Supports both duotone and solid icon styles
- Inherits color from parent via \`currentColor\`
- Scales with \`font-size\`
- Customizable duotone colors via CSS variables

**Duotone Icons** (two-layer styling):
- bug, error, pause, play, close, grid

**Solid Icons** (single-layer):
- globe, home, user

**CSS Variables (duotone only):**
- \`--fa-primary-color\`: Primary layer color (default: currentColor)
- \`--fa-secondary-color\`: Secondary layer color (default: currentColor)
- \`--fa-primary-opacity\`: Primary layer opacity (default: 1)
- \`--fa-secondary-opacity\`: Secondary layer opacity (default: 0.4)
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<IconProps>;

export const Default: Story = {
  args: {
    name: 'globe',
  },
  render: (args) => html` <trailhand-icon name=${args.name}></trailhand-icon> `,
};

export const Home: Story = {
  args: {
    name: 'home',
  },
  render: (args) => html` <trailhand-icon name=${args.name}></trailhand-icon> `,
};

export const User: Story = {
  args: {
    name: 'user',
  },
  render: (args) => html` <trailhand-icon name=${args.name}></trailhand-icon> `,
};

export const WithColor: Story = {
  args: {
    name: 'globe',
  },
  render: (args) => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <trailhand-icon
        name=${args.name}
        style="color: red; font-size: 24px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="color: blue; font-size: 24px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="color: green; font-size: 24px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="color: orange; font-size: 24px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="color: purple; font-size: 24px;"
      ></trailhand-icon>
    </div>
  `,
};

export const WithSizes: Story = {
  args: {
    name: 'globe',
  },
  render: (args) => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <trailhand-icon
        name=${args.name}
        style="font-size: 12px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="font-size: 16px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="font-size: 24px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="font-size: 32px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="font-size: 48px;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="font-size: 64px;"
      ></trailhand-icon>
    </div>
  `,
};

export const DuotoneColors: Story = {
  args: {
    name: 'play',
  },
  render: (args) => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <trailhand-icon
        name=${args.name}
        style="font-size: 48px; --fa-primary-color: #3b82f6; --fa-secondary-color: #93c5fd;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="font-size: 48px; --fa-primary-color: #10b981; --fa-secondary-color: #6ee7b7;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="font-size: 48px; --fa-primary-color: #f59e0b; --fa-secondary-color: #fcd34d;"
      ></trailhand-icon>
      <trailhand-icon
        name=${args.name}
        style="font-size: 48px; --fa-primary-color: #ef4444; --fa-secondary-color: #fca5a5;"
      ></trailhand-icon>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Duotone icons support separate colors for primary and secondary layers via CSS variables.',
      },
    },
  },
};

const duotoneIcons = ['bug', 'error', 'pause', 'play', 'close', 'grid', 'rocket', 'gauge', 'list', 'folderPlus', 'solarSystem', 'shoppingBag', 'info', 'chartLine', 'folderGear', 'database'];
const solidIcons = ['globe', 'home', 'user', 'check', 'minus'];

export const AllIcons: Story = {
  render: () => html`
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600;">Duotone Icons</h3>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; margin-bottom: 32px;">
        ${duotoneIcons.map(
          (iconName) => html`
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <trailhand-icon name=${iconName} style="font-size: 32px;"></trailhand-icon>
              <span style="font-size: 12px; color: #6b7280;">${iconName}</span>
            </div>
          `
        )}
      </div>
      <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600;">Solid Icons</h3>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px;">
        ${solidIcons.map(
          (iconName) => html`
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <trailhand-icon name=${iconName} style="font-size: 32px;"></trailhand-icon>
              <span style="font-size: 12px; color: #6b7280;">${iconName}</span>
            </div>
          `
        )}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All available icons, grouped by style (duotone vs solid).',
      },
    },
  },
};
