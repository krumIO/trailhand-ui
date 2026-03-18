import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './th-form-row';
import '../text-input/text-input';

interface ThFormRowProps {
  title: string;
  columns: number;
}

const meta: Meta<ThFormRowProps> = {
  title: 'Components/ThFormRow',
  component: 'trailhand-form-row',
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional section title displayed above the field grid',
    },
    columns: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Number of equal-width columns for the field grid',
    },
  },
  args: {
    title: '',
    columns: 1,
  },
  render: (args) => html`
    <trailhand-form-row .columns=${args.columns} .title=${args.title}>
      <trailhand-text-input label="Field 1" placeholder="Enter value 1"></trailhand-text-input>
      <trailhand-text-input label="Field 2" placeholder="Enter value 2"></trailhand-text-input>
    </trailhand-form-row>
  `,
};

export default meta;
type Story = StoryObj<ThFormRowProps>;

/** Single column, no title — the default */
export const Default: Story = {
  args: { columns: 1, title: '' },
};

/** Two equal columns */
export const TwoColumns: Story = {
  args: { columns: 2 },
  render: (args) => html`
    <trailhand-form-row .columns=${args.columns}>
      <trailhand-text-input label="Namespace" placeholder="Enter namespace"></trailhand-text-input>
      <trailhand-text-input label="Name" placeholder="Enter name"></trailhand-text-input>
    </trailhand-form-row>
  `,
};

/** Three equal columns */
export const ThreeColumns: Story = {
  args: { columns: 3 },
  render: (args) => html`
    <trailhand-form-row .columns=${args.columns}>
      <trailhand-text-input label="Namespace" placeholder="Enter namespace"></trailhand-text-input>
      <trailhand-text-input label="Name" placeholder="Enter name"></trailhand-text-input>
      <trailhand-text-input label="Instances" placeholder="1"></trailhand-text-input>
    </trailhand-form-row>
  `,
};

/** With a section title */
export const WithTitle: Story = {
  args: { columns: 1, title: 'Routes' },
  render: (args) => html`
    <trailhand-form-row .columns=${args.columns} .title=${args.title}>
      <trailhand-text-input label="Route URL" placeholder="Enter route URL"></trailhand-text-input>
    </trailhand-form-row>
  `,
};

/** Multi-column with a section title */
export const WithTitleAndColumns: Story = {
  args: { columns: 2, title: 'Config Data' },
  render: (args) => html`
    <trailhand-form-row .columns=${args.columns} .title=${args.title}>
      <trailhand-text-input label="Key" placeholder="Enter key"></trailhand-text-input>
      <trailhand-text-input label="Value" placeholder="Enter value"></trailhand-text-input>
    </trailhand-form-row>
  `,
};

/**
 * Intended usage: nest inside `trailhand-form-card` to compose multi-section forms.
 * Each row controls its own column count and optional section heading.
 */
export const ComposedInCard: Story = {
  render: () => html`
    <trailhand-form-card>
        <trailhand-form-row columns="3">
          <trailhand-text-input label="Namespace" placeholder="Create New Namespace" required></trailhand-text-input>
          <trailhand-text-input label="Name" placeholder="Test" required></trailhand-text-input>
          <trailhand-text-input label="Instances" placeholder="1" required></trailhand-text-input>
        </trailhand-form-row>
        <trailhand-form-row title="Routes">
          <trailhand-text-input placeholder="test.krum.io"></trailhand-text-input>
        </trailhand-form-row>
        <trailhand-form-row title="Application Variables">
          <trailhand-text-input placeholder="app.listeningport"></trailhand-text-input>
        </trailhand-form-row>
        <trailhand-form-row title="Environment Variables">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px;">
            <span style="font-size: 13px; font-weight: 500; color: #6b7280;">Name</span>
            <span style="font-size: 13px; font-weight: 500; color: #6b7280;">Value</span>
            <span style="font-size: 13px;">--</span>
            <span style="font-size: 13px;">--</span>
          </div>
        </trailhand-form-row>
      </trailhand-form-card>
  `,
};
