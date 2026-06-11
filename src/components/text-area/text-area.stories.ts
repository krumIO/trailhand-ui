import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './text-area';
import { TextAreaProps } from './text-area';
import { expect, userEvent } from 'storybook/test';

const meta: Meta<TextAreaProps> = {
  title: 'Components/TextArea',
  component: 'trailhand-text-area',
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'The name identifier for the textarea',
    },
    value: {
      control: { type: 'text' },
      description: 'The current value of the textarea',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is disabled',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is required',
    },
    label: {
      control: { type: 'text' },
      description: 'Label text',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the textarea',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Manually set invalid state',
    },
    rows: {
      control: { type: 'number' },
      description: 'Number of visible text rows',
    },
    maxlength: {
      control: { type: 'number' },
      description: 'Maximum character length',
    },
    resize: {
      control: { type: 'select' },
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'Resize behavior of the textarea',
    },
    showCount: {
      control: { type: 'boolean' },
      description: 'Whether to show the character count',
    },
  },
  args: {
    name: 'text-area',
    value: '',
    placeholder: 'Type something...',
    disabled: false,
    required: false,
    label: 'Text Area Label',
    size: 'medium',
    invalid: false,
    rows: 4,
    resize: 'vertical',
    showCount: false,
  },
  render: (args) => html`
    <trailhand-text-area
      style="width: 400px"
      name=${args.name}
      .value=${args.value}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
      size=${args.size}
      ?invalid=${args.invalid}
      label=${args.label ?? ''}
      rows=${args.rows}
      ?showCount=${args.showCount}
      resize=${args.resize}
      .maxlength=${args.maxlength}
    ></trailhand-text-area>
  `,
};

export default meta;
type Story = StoryObj<TextAreaProps>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: 'The quick brown fox jumps over the lazy dog.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'This field cannot be edited.',
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

export const WithCharacterCount: Story = {
  args: {
    showCount: true,
  },
};

export const WithMaxLength: Story = {
  args: {
    maxlength: 100,
    showCount: true,
  },
};

export const AtCharacterLimit: Story = {
  args: {
    maxlength: 50,
    showCount: true,
    value: 'This value is right at the fifty character limit!',
  },
};

export const OverCharacterLimit: Story = {
  args: {
    maxlength: 50,
    showCount: true,
    value: 'This value intentionally exceeds the fifty character limit to show the invalid state.',
  },
};

export const ResizeNone: Story = {
  args: {
    resize: 'none',
  },
};

export const ResizeBoth: Story = {
  args: {
    resize: 'both',
  },
};

export const TallRows: Story = {
  args: {
    rows: 8,
    placeholder: 'Lots of room to write...',
  },
};

export const HandleInput: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const textAreaComponent = canvasElement.querySelector('trailhand-text-area');
    if (!textAreaComponent) throw new Error('TextArea not found');

    const textarea = textAreaComponent.shadowRoot?.querySelector('textarea');
    if (!textarea) throw new Error('Internal textarea not found');

    await userEvent.type(textarea, 'Test value');

    await expect(textarea).toHaveValue('Test value');
  },
};

export const HandleInputWithMaxLength: Story = {
  args: {
    maxlength: 20,
    showCount: true,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const textAreaComponent = canvasElement.querySelector('trailhand-text-area');
    if (!textAreaComponent) throw new Error('TextArea not found');

    const textarea = textAreaComponent.shadowRoot?.querySelector('textarea');
    if (!textarea) throw new Error('Internal textarea not found');

    await userEvent.type(textarea, 'This string is definitely over twenty characters');

    const countEl = textAreaComponent.shadowRoot?.querySelector('.count');
    await expect(countEl).toHaveClass('over-limit');
  },
};