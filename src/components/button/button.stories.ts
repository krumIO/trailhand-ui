import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './button';
import { ButtonProps } from './button';
import '../icon/icon';
import { expect, fn, userEvent } from 'storybook/test';

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

export const HandleClick: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    type: 'button',
    name: 'clickable-button',
  },
  play: async ({ canvasElement }) => {
    const thButton = canvasElement.querySelector('trailhand-button');
    if (!thButton) {
      throw new Error('Button not found');
    }
    const onClickMock = fn();
    thButton.addEventListener('button-click', onClickMock);
    const button = thButton.shadowRoot?.querySelector('button');
    if (!button) {
      throw new Error('Button element not found in shadow DOM');
    }
    await userEvent.click(button);
    await expect(onClickMock).toHaveBeenCalled();
  },
};

export const HandleDisabledClick: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: true,
    type: 'button',
    name: 'disabled-button',
  },
  play: async ({ canvasElement }) => {
    const thButton = canvasElement.querySelector('trailhand-button');
    if (!thButton) {
      throw new Error('Button not found');
    }
    const onClickMock = fn();
    thButton.addEventListener('button-click', onClickMock);
    const button = thButton.shadowRoot?.querySelector('button');
    if (!button) {
      throw new Error('Button element not found in shadow DOM');
    }
    await userEvent.click(button);
    await expect(onClickMock).not.toHaveBeenCalled();
  },
};
