import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './modal';
import '../button/button';
import type { Modal } from './modal';
import { expect, fn, userEvent } from 'storybook/test';
import { ModalProps } from './modal';

const meta: Meta<ModalProps> = {
  title: 'Components/Modal',
  component: 'trailhand-modal',
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    title: {
      control: 'text',
      description: 'Modal heading text',
    },
    subtitle: {
      control: 'text',
      description: 'Modal subtitle text',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the modal can be dismissed',
    },
  },
  args: {
    open: false,
    title: 'Modal Title',
    subtitle: '',
    dismissible: true,
  },
  render: (args) => {
    const openModal = (e: Event) => {
      const container = (e.currentTarget as HTMLElement).closest('div');
      const modal = container?.querySelector('trailhand-modal') as Modal;
      modal.open = true;
    };

    return html`
      <trailhand-button @click=${openModal}>Open Modal</trailhand-button>
      <trailhand-modal
        ?open=${args.open}
        .title=${args.title}
        .subtitle=${args.subtitle}
        .dismissible=${args.dismissible}
      >
        <p>Modal body content goes here.</p>
      </trailhand-modal>
    `;
  },
};

export default meta;
type Story = StoryObj<ModalProps>;

export const Default: Story = {};

export const NonDismissible: Story = {
  args: {
    title: 'Non-Dismissible Modal',
    dismissible: false,
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Modal with Subtitle',
    subtitle: 'Subtitle',
  },
};

export const CustomFooter: Story = {
  render: (args) => {
    const openModal = (e: Event) => {
      const container = (e.currentTarget as HTMLElement).closest('div');
      const modal = container?.querySelector('trailhand-modal') as Modal;
      modal.open = true;
    };
    return html`
      <trailhand-button @click=${openModal}>Open Modal</trailhand-button>
      <trailhand-modal
        ?open=${args.open}
        title=${args.title}
        ?dismissible=${args.dismissible}
      >
        <p>Modal body content goes here.</p>
        <div slot="footer">
          <trailhand-button @click=${() => alert('Action 1')}
            >Action 1</trailhand-button
          >
          <trailhand-button @click=${() => alert('Action 2')}
            >Action 2</trailhand-button
          >
        </div>
      </trailhand-modal>
    `;
  },
};

export const CustomHeader: Story = {
  render: (args) => {
    const openModal = (e: Event) => {
      const container = (e.currentTarget as HTMLElement).closest('div');
      const modal = container?.querySelector('trailhand-modal') as Modal;
      modal.open = true;
    };
    return html`
      <trailhand-button @click=${openModal}>Open Modal</trailhand-button>
      <trailhand-modal ?open=${args.open} ?dismissible=${args.dismissible}>
        <div slot="heading">
          <h2>Custom Heading</h2>
          <p>Custom subtitle</p>
        </div>
        <p>Modal body content goes here.</p>
      </trailhand-modal>
    `;
  },
};

export const LargeBodyContent: Story = {
  render: (args) => {
    const openModal = (e: Event) => {
      const container = (e.currentTarget as HTMLElement).closest('div');
      const modal = container?.querySelector('trailhand-modal') as Modal;
      modal.open = true;
    };
    return html`
      <trailhand-button @click=${openModal}>Open Modal</trailhand-button>
      <trailhand-modal
        ?open=${args.open}
        title="Modal with Large Content"
        ?dismissible=${args.dismissible}
      >
        <div
          style="height: 800px; width: 800px; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0;"
        >
          800 x 800
        </div>
      </trailhand-modal>
    `;
  },
};

export const DispatchesOpenEvent: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const modal = canvasElement.querySelector('trailhand-modal') as Modal;
    const button = canvasElement.querySelector(
      'trailhand-button',
    ) as HTMLElement;

    const onOpenMock = fn();
    modal.addEventListener('modal-open', onOpenMock);

    await userEvent.click(button);
    await expect(onOpenMock).toHaveBeenCalled();
  },
};

export const DispatchesCloseEventOnClose: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    open: true,
  },
  play: async ({ canvasElement }) => {
    const modal = canvasElement.querySelector('trailhand-modal') as Modal;
    const closeButton = modal.shadowRoot?.querySelector(
      '.close-button',
    ) as HTMLElement;

    const onCloseMock = fn();
    modal.addEventListener('modal-close', onCloseMock);

    await userEvent.click(closeButton);
    await expect(onCloseMock).toHaveBeenCalled();
  },
};

export const DispatchesCloseEventOnOutsidePress: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    open: true,
  },
  play: async ({ canvasElement }) => {
    const modal = canvasElement.querySelector('trailhand-modal') as Modal;
    const dialog = modal.shadowRoot?.querySelector('dialog') as HTMLElement;

    const rect = dialog.getBoundingClientRect();

    const onCloseMock = fn();
    modal.addEventListener('modal-close', onCloseMock);

    const clickEvent = new MouseEvent('click', {
      clientX: rect.right + 10,
      clientY: rect.top,
      bubbles: true,
      composed: true,
    });

    dialog.dispatchEvent(clickEvent);

    await expect(modal.open).toBe(false);
    await expect(onCloseMock).toHaveBeenCalled();
  },
};

export const DispatchesCloseEventOnEscape: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    open: true,
    dismissible: true,
  },
  play: async ({ canvasElement }) => {
    const modal = canvasElement.querySelector('trailhand-modal') as Modal;
    const dialog = modal.shadowRoot?.querySelector(
      'dialog',
    ) as HTMLDialogElement;

    const onCloseMock = fn();
    modal.addEventListener('modal-close', onCloseMock);

    const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
    dialog.dispatchEvent(cancelEvent);

    await expect(modal.open).toBe(false);
    await expect(onCloseMock).toHaveBeenCalled();
  },
};

export const NonDismissibleIgnoresOutsidePress: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    open: true,
    dismissible: false,
  },
  play: async ({ canvasElement }) => {
    const modal = canvasElement.querySelector('trailhand-modal') as Modal;
    const dialog = modal.shadowRoot?.querySelector('dialog') as HTMLElement;

    const rect = dialog.getBoundingClientRect();

    const clickEvent = new MouseEvent('click', {
      clientX: rect.right + 10,
      clientY: rect.top,
      bubbles: true,
      composed: true,
    });

    dialog.dispatchEvent(clickEvent);

    await expect(modal.open).toBe(true);
  },
};

export const NonDismissibleHasNoCloseButton: Story = {
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    open: true,
    dismissible: false,
  },
  play: async ({ canvasElement }) => {
    const modal = canvasElement.querySelector('trailhand-modal') as Modal;
    const closeButton = modal.shadowRoot?.querySelector('.close-button');

    await expect(closeButton).toBeNull();
  },
};
