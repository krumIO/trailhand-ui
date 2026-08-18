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
- Inherits color from parent via \`currentColor\`
- Scales with \`font-size\`
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

export const AllIcons: Story = {
  render: () => html`
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600;">
        Solid Icons
      </h3>
      <div
        style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px;"
      >
        ${availableIcons.map(
          (iconName) => html`
            <div
              style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
            >
              <trailhand-icon
                name=${iconName}
                style="font-size: 32px;"
              ></trailhand-icon>
              <span style="font-size: 12px; color: #6b7280;">${iconName}</span>
            </div>
          `,
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
