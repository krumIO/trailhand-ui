import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './loading-spinner';
import { LoadingSpinnerProps } from './loading-spinner';
import { ifDefined } from 'lit/directives/if-defined.js';

const meta: Meta<LoadingSpinnerProps> = {
  title: 'Components/LoadingSpinner',
  component: 'trailhand-loading-spinner',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Optional label displayed below the spinner',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the spinner',
    },
  },
  args: {
    label: '',
    size: 'medium',
  },
  render: (args) => html`
    <trailhand-loading-spinner
      size=${ifDefined(args.size)}
      label=${args.label ?? ''}
    ></trailhand-loading-spinner>
  `,
};

export default meta;
type Story = StoryObj<LoadingSpinnerProps>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Loading...',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const SmallWithLabel: Story = {
  args: {
    size: 'small',
    label: 'Loading...',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const MediumWithLabel: Story = {
  args: {
    size: 'medium',
    label: 'Loading...',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const LargeWithLabel: Story = {
  args: {
    size: 'large',
    label: 'Loading...',
  },
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 2rem;">
      <trailhand-loading-spinner size="small"></trailhand-loading-spinner>
      <trailhand-loading-spinner size="medium"></trailhand-loading-spinner>
      <trailhand-loading-spinner size="large"></trailhand-loading-spinner>
    </div>
  `,
};

export const AllSizesWithLabels: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 2rem;">
      <trailhand-loading-spinner size="small" label="Small"></trailhand-loading-spinner>
      <trailhand-loading-spinner size="medium" label="Medium"></trailhand-loading-spinner>
      <trailhand-loading-spinner size="large" label="Large"></trailhand-loading-spinner>
    </div>
  `,
};