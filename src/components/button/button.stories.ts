import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './button';
import { ButtonProps } from './button';
import '../icon/icon';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: 'trailhand-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'alternate',
        'destructive',
        'confirmation',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'The HTML button type',
    },
    name: {
      control: { type: 'text' },
      description: 'The name identifier for the button',
    },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    type: 'button',
    name: '',
  },
  render: (args) => html`
    <trailhand-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      type=${args.type}
      name=${args.name}
    >
      Button
    </trailhand-button>
  `,
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Alternate: Story = {
  args: {
    variant: 'alternate',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

export const Confirmation: Story = {
  args: {
    variant: 'confirmation',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLeftIcon: Story = {
  render: (args) => html`
    <trailhand-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      type=${args.type}
      name=${args.name}
    >
      <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
      Left Icon
    </trailhand-button>
  `,
};

export const WithRightIcon: Story = {
  render: (args) => html`
    <trailhand-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      type=${args.type}
      name=${args.name}
    >
      Right Icon
      <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
    </trailhand-button>
  `,
};

export const WithBothIcons: Story = {
  render: (args) => html`
    <trailhand-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      type=${args.type}
      name=${args.name}
    >
      <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
      Both Icons
      <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
    </trailhand-button>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;"
    >
      <trailhand-button variant="primary">Primary</trailhand-button>
      <trailhand-button variant="secondary">Secondary</trailhand-button>
      <trailhand-button variant="alternate">Alternate</trailhand-button>
      <trailhand-button variant="destructive">Destructive</trailhand-button>
      <trailhand-button variant="confirmation">Confirmation</trailhand-button>
      <trailhand-button disabled>Disabled</trailhand-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;"
    >
      <trailhand-button size="small">Small Button</trailhand-button>
      <trailhand-button size="medium">Medium Button</trailhand-button>
      <trailhand-button size="large">Large Button</trailhand-button>
    </div>
  `,
};

export const WithClickHandler: Story = {
  render: (args) => html`
    <trailhand-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      type=${args.type}
      name="test-button"
      @button-click=${(e: CustomEvent) => {
        console.log('Button clicked!', e.detail);
        alert(`Button "${e.detail.name}" was clicked!`);
      }}
    >
      Click Me
    </trailhand-button>
  `,
};
