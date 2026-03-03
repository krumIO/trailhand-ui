import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './text-input';
import '../icon/icon';
import { TextInputProps } from './text-input';
import { expect, fn, userEvent } from 'storybook/test';

const meta: Meta<TextInputProps> = {
  title: 'Components/TextInput',
  component: 'trailhand-text-input',
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'The name identifier for the input',
    },
    value: {
      control: { type: 'text' },
      description: 'The current value of the input',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the input is required',
    },
    label: {
      control: { type: 'text' },
      description: 'Label text',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the input',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Manually set invalid state',
    },
  },
  args: {
    name: 'text-input',
    value: '',
    placeholder: 'Type something...',
    disabled: false,
    required: false,
    label: 'Text Input Label',
    size: 'medium',
    invalid: false,
  },
  render: (args) => html`
    <trailhand-text-input
      name=${args.name}
      .value=${args.value}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
      size=${args.size}
      ?invalid=${args.invalid}
      label=${args.label ? args.label : ''}
    ></trailhand-text-input>
  `,
};

export default meta;
type Story = StoryObj<TextInputProps>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: 'Hello world',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};

export const WithIcon: Story = {
  render: (args) => html`
    <trailhand-text-input
      name=${args.name}
      .value=${args.value}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
      size=${args.size}
      ?invalid=${args.invalid}
      label=${args.label ? args.label : ''}
    >
      <trailhand-icon name="globe" slot="icon"></trailhand-icon>
    </trailhand-text-input>
  `,
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

export const HandleInput: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const inputComponent = canvasElement.querySelector('trailhand-text-input');
    if (!inputComponent) throw new Error('TextInput not found');

    const input = inputComponent.shadowRoot?.querySelector('input');
    if (!input) throw new Error('Internal input not found');

    await userEvent.type(input, 'Test value');

    await expect(input).toHaveValue('Test value');
  },
};
