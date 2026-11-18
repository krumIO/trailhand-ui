import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './banner';
import type { BannerProps } from './banner';

const meta: Meta<BannerProps> = {
  title: 'Components/Banner',
  component: 'trailhand-banner',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'error', 'success', 'warning', 'info'],
      description: 'Sets the color and tone of the banner',
    },
    title: {
      control: 'text',
      description: 'Optional bold heading',
    },
    description: {
      control: 'text',
      description: 'Optional supporting text, shown below the title',
    },
    dismissable: {
      control: 'boolean',
      description:
        'Shows a close button. Dismissing hides the banner and fires `banner-dismiss`',
    },
  },
  args: {
    variant: 'primary',
    title: 'Heads up',
    description: 'This is a short message to let you know something.',
    dismissable: false,
  },
  render: (args) => html`
    <div style="padding: 24px; max-width: 640px;">
      <trailhand-banner
        variant=${args.variant}
        title=${args.title}
        description=${args.description}
        ?dismissable=${args.dismissable}
      ></trailhand-banner>
    </div>
  `,
};

export default meta;
type Story = StoryObj<BannerProps>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    variant: 'primary',
    title: 'New version available',
    description: 'Version 2.4 includes performance improvements and bug fixes.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Deployment failed',
    description: 'The container exited with code 137. Check the logs for details.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Changes saved',
    description: 'Your settings were updated successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Your trial ends soon',
    description: 'Add a payment method to keep access to your projects.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Did you know?',
    description: 'You can filter logs by container using the search field.',
  },
};

export const Dismissable: Story = {
  args: {
    variant: 'info',
    title: 'Dismiss me',
    description: 'Click the close button. The banner fades out and fires banner-dismiss.',
    dismissable: true,
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'success',
    title: 'Saved',
    description: '',
  },
};

export const DescriptionOnly: Story = {
  args: {
    variant: 'warning',
    title: '',
    description: 'Unsaved changes will be lost if you leave this page.',
  },
};

export const LongContent: Story = {
  args: {
    variant: 'error',
    title: 'We could not process your request',
    description:
      'The server returned an unexpected response while we were trying to apply your changes. ' +
      'This is usually temporary. Wait a moment and try again, and if the problem continues, ' +
      'contact support and include the time the error occurred so we can find it in the logs.',
    dismissable: true,
  },
};

export const AllVariants: Story = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 24px; max-width: 640px;">
      ${(['primary', 'error', 'success', 'warning', 'info'] as const).map(
        (variant) => html`
          <trailhand-banner
            variant=${variant}
            title=${variant.charAt(0).toUpperCase() + variant.slice(1)}
            description="This is the ${variant} variant."
            ?dismissable=${args.dismissable}
          ></trailhand-banner>
        `,
      )}
    </div>
  `,
};

export const DarkMode: Story = {
  render: (args) => html`
    <div
      data-theme="dark"
      style="background: #1a1a1a; padding: 24px; display: flex; flex-direction: column; gap: 12px; border-radius: 8px; max-width: 640px;"
    >
      ${(['primary', 'error', 'success', 'warning', 'info'] as const).map(
        (variant) => html`
          <trailhand-banner
            variant=${variant}
            title=${variant.charAt(0).toUpperCase() + variant.slice(1)}
            description="Banner respects the dark theme."
            ?dismissable=${args.dismissable}
          ></trailhand-banner>
        `,
      )}
    </div>
  `,
};