import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './popover';
import '../button/button';
import '../text-input/text-input';
import type { PopoverProps } from './popover';

const meta: Meta<PopoverProps> = {
  title: 'Components/Popover',
  component: 'trailhand-popover',
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the popover is open',
    },
    stayOpen: {
      control: 'boolean',
      description: 'When true, clicking outside will not close the popover',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Which side of the trigger the popover appears on',
    },
    title: {
      control: 'text',
      description: 'Optional header title',
    },
    subtitle: {
      control: 'text',
      description: 'Optional header subtitle, shown next to the title',
    },
  },
  args: {
    open: false,
    stayOpen: false,
    placement: 'bottom',
    title: '',
    subtitle: '',
  },
  render: (args) => html`
    <div style="display: flex; justify-content: center; padding: 80px;">
      <trailhand-popover
        ?open=${args.open}
        ?stay-open=${args.stayOpen}
        placement=${args.placement}
        title=${args.title}
        subtitle=${args.subtitle}
      >
        <trailhand-button slot="trigger">Open Popover</trailhand-button>
        <p style="margin: 0; font-size: 14px; color: var(--th-color-text-secondary);">
          Any content can go here.
        </p>
      </trailhand-popover>
    </div>
  `,
};

export default meta;
type Story = StoryObj<PopoverProps>;

export const Default: Story = {};

export const WithTitle: Story = {
  args: {
    title: 'Popover Title',
    subtitle: 'v1.0',
  },
  render: (args) => html`
    <div style="display: flex; justify-content: center; padding: 80px;">
      <trailhand-popover
        ?open=${args.open}
        placement=${args.placement}
        title=${args.title}
        subtitle=${args.subtitle}
      >
        <trailhand-button slot="trigger">Open Popover</trailhand-button>
        <p style="margin: 0; font-size: 14px; color: var(--th-color-text-secondary);">
          The header is rendered automatically when a title is provided.
        </p>
      </trailhand-popover>
    </div>
  `,
};

export const StayOpen: Story = {
  args: {
    stayOpen: true,
  },
  render: (args) => html`
    <div style="display: flex; justify-content: center; padding: 80px;">
      <trailhand-popover
        ?open=${args.open}
        ?stay-open=${args.stayOpen}
        placement=${args.placement}
      >
        <trailhand-button slot="trigger">Stay Open Popover</trailhand-button>
        <div>
          <p style="margin: 0 0 8px; font-weight: 600;">Stays Open</p>
          <p style="margin: 0; font-size: 14px; color: var(--th-color-text-secondary);">
            Clicking outside will not close this popover.
          </p>
        </div>
      </trailhand-popover>
    </div>
  `,
};

export const PlacementTop: Story = {
  args: { placement: 'top' },
  render: (args) => html`
    <div style="display: flex; justify-content: center; padding: 80px;">
      <trailhand-popover placement="top" ?open=${args.open}>
        <trailhand-button slot="trigger">Opens Above</trailhand-button>
        <p style="margin: 0; font-size: 14px;">Popover above the trigger.</p>
      </trailhand-popover>
    </div>
  `,
};

export const PlacementRight: Story = {
  args: { placement: 'right' },
  render: (args) => html`
    <div style="display: flex; justify-content: center; padding: 80px;">
      <trailhand-popover placement="right" ?open=${args.open}>
        <trailhand-button slot="trigger">Opens Right</trailhand-button>
        <p style="margin: 0; font-size: 14px;">Popover to the right.</p>
      </trailhand-popover>
    </div>
  `,
};

export const PlacementLeft: Story = {
  args: { placement: 'left' },
  render: (args) => html`
    <div style="display: flex; justify-content: center; padding: 80px;">
      <trailhand-popover placement="left" ?open=${args.open}>
        <trailhand-button slot="trigger">Opens Left</trailhand-button>
        <p style="margin: 0; font-size: 14px;">Popover to the left.</p>
      </trailhand-popover>
    </div>
  `,
};

export const WithForm: Story = {
  render: (args) => html`
    <div style="display: flex; justify-content: center; padding: 80px;">
      <trailhand-popover
        ?open=${args.open}
        ?stay-open=${args.stayOpen}
        placement=${args.placement}
        title="Filter"
      >
        <trailhand-button slot="trigger" variant="secondary">
          Filter Options
        </trailhand-button>
        <div style="display: flex; flex-direction: column; gap: 12px; min-width: 280px;">
          <trailhand-text-input
            label="Search"
            placeholder="e.g., my-container"
          ></trailhand-text-input>
          <trailhand-text-input
            label="Tail (number of lines)"
            placeholder="e.g., 100"
          ></trailhand-text-input>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <trailhand-button size="small">Apply</trailhand-button>
            <trailhand-button size="small" variant="secondary">Clear</trailhand-button>
          </div>
        </div>
      </trailhand-popover>
    </div>
  `,
};

export const DarkMode: Story = {
  render: (args) => html`
    <div
      data-theme="dark"
      style="background: #1a1a1a; padding: 80px; display: flex; justify-content: center; border-radius: 8px;"
    >
      <trailhand-popover
        ?open=${args.open}
        ?stay-open=${args.stayOpen}
        placement=${args.placement}
      >
        <trailhand-button slot="trigger">Open Popover</trailhand-button>
        <div>
          <p style="margin: 0 0 8px; font-weight: 600; color: var(--th-color-text-primary);">
            Dark Mode
          </p>
          <p style="margin: 0; font-size: 14px; color: var(--th-color-text-secondary);">
            Popover respects the dark theme.
          </p>
        </div>
      </trailhand-popover>
    </div>
  `,
};
