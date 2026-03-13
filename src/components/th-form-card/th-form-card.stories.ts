import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, fn } from 'storybook/test';
import './th-form-card';
import '../text-input/text-input';
import type { FormCardButtonVariant } from './th-form-card';
import type { ThFormCard } from './th-form-card';

interface ThFormCardProps {
  columns: number;
  shadow: boolean;
  loading: boolean;
  buttonLabel: string;
  buttonVariant: FormCardButtonVariant;
  buttonDisabled: boolean;
  cancelLabel: string;
}

const meta: Meta<ThFormCardProps> = {
  title: 'Components/ThFormCard',
  component: 'trailhand-form-card',
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Number of equal-width columns for the form content grid',
    },
    shadow: {
      control: 'boolean',
      description: 'Show a box shadow (useful when used outside a modal)',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner and hides content',
    },
    buttonLabel: {
      control: 'text',
      description: 'Primary action button label. Leave empty to hide the button.',
    },
    buttonVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'alternate', 'destructive', 'confirmation'],
      description: 'Variant for the primary action button',
    },
    buttonDisabled: {
      control: 'boolean',
      description: 'Disables the primary action button',
    },
    cancelLabel: {
      control: 'text',
      description: 'Cancel button label. Leave empty to hide the cancel button.',
    },
  },
  args: {
    columns: 2,
    shadow: false,
    loading: false,
    buttonLabel: '',
    buttonVariant: 'primary',
    buttonDisabled: false,
    cancelLabel: '',
  },
  render: (args) => html`
    <trailhand-form-card
      .columns=${args.columns}
      ?shadow=${args.shadow}
      ?loading=${args.loading}
      button-label=${args.buttonLabel}
      button-variant=${args.buttonVariant}
      ?button-disabled=${args.buttonDisabled}
      cancel-label=${args.cancelLabel}
    >
      <trailhand-text-input label="Namespace" placeholder="Create New Namespace" required></trailhand-text-input>
      <trailhand-text-input label="Name" placeholder="A Unique Name" required></trailhand-text-input>
      <trailhand-text-input label="Value" placeholder="A Value" required></trailhand-text-input>
    </trailhand-form-card>
  `,
};

export default meta;
type Story = StoryObj<ThFormCardProps>;

export const Default: Story = {};

/** Both cancel and primary buttons */
export const WithBothButtons: Story = {
  args: {
    columns: 2,
    buttonLabel: 'Create',
    cancelLabel: 'Cancel',
  },
};

/** Primary button only, no cancel */
export const WithPrimaryOnly: Story = {
  args: {
    columns: 2,
    buttonLabel: 'Save',
  },
};

/** Cancel button only, no primary */
export const WithCancelOnly: Story = {
  args: {
    columns: 2,
    cancelLabel: 'Cancel',
  },
};

export const ThreeColumns: Story = {
  args: { columns: 3 },
  render: (args) => html`
    <trailhand-form-card .columns=${args.columns} ?shadow=${args.shadow} ?loading=${args.loading}>
      <trailhand-text-input label="Namespace" placeholder="Create New Namespace" required></trailhand-text-input>
      <trailhand-text-input label="Name" placeholder="Test" required></trailhand-text-input>
      <trailhand-text-input label="Instances" placeholder="1" required></trailhand-text-input>
    </trailhand-form-card>
  `,
};

export const WithShadow: Story = {
  args: { shadow: true },
};

export const Loading: Story = {
  args: { loading: true },
};

export const DispatchesSubmitEvent: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    buttonLabel: 'Create',
    cancelLabel: 'Cancel',
    columns: 2,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('trailhand-form-card') as ThFormCard;
    const onSubmitMock = fn();
    card.addEventListener('form-card-submit', onSubmitMock);

    const submitBtn = card.shadowRoot?.querySelector('trailhand-button[variant="primary"]') as HTMLElement;
    submitBtn.dispatchEvent(new CustomEvent('button-click', { bubbles: true, composed: true }));
    await expect(onSubmitMock).toHaveBeenCalled();
  },
};

export const DispatchesCancelEvent: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    buttonLabel: 'Create',
    cancelLabel: 'Cancel',
    columns: 2,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('trailhand-form-card') as ThFormCard;
    const onCancelMock = fn();
    card.addEventListener('form-card-cancel', onCancelMock);

    const cancelBtn = card.shadowRoot?.querySelector('trailhand-button[variant="secondary"]') as HTMLElement;
    cancelBtn.dispatchEvent(new CustomEvent('button-click', { bubbles: true, composed: true }));
    await expect(onCancelMock).toHaveBeenCalled();
  },
};

/** Shows the complete submit → loading → done cycle, mirroring real API call usage */
export const SubmitWithLoadingState: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    buttonLabel: 'Create',
    cancelLabel: 'Cancel',
    columns: 2,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('trailhand-form-card') as ThFormCard;
    card.addEventListener('form-card-submit', async () => {
      card.loading = true;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      card.loading = false;
    });

    const submitBtn = card.shadowRoot?.querySelector('trailhand-button[variant="primary"]') as HTMLElement;
    submitBtn.dispatchEvent(new CustomEvent('button-click', { bubbles: true, composed: true }));
    await expect(card.loading).toBe(true);
  },
};
