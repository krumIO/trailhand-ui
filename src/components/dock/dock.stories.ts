import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './dock';
import type { DockProps } from './dock';

const meta: Meta<DockProps> = {
  title: 'Components/Dock',
  component: 'trailhand-dock',
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dock is visible',
    },
    pin: {
      control: 'select',
      options: ['bottom', 'left', 'right'],
      description: 'Which edge the dock is docked to',
    },
    activeTab: {
      control: 'text',
      description: 'id of the currently active tab',
    },
    height: {
      control: 'number',
      description: "Height in px, used when pin is 'bottom'",
    },
    width: {
      control: 'number',
      description: "Width in px, used when pin is not 'bottom'",
    },
  },
  args: {
    open: true,
    pin: 'bottom',
    activeTab: 'logs',
    height: 260,
    width: 400,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<DockProps>;

const threeTabs = [
  { id: 'logs', label: 'App Logs' },
  { id: 'staging', label: 'Staging Log' },
  { id: 'shell', label: 'Shell' },
];

export const Default: Story = {
  render: (args) => html`
    <div style="height: 400px; display: flex; flex-direction: column; justify-content: flex-end;">
      <trailhand-dock
        ?open=${args.open}
        pin=${args.pin}
        active-tab=${args.activeTab}
        height=${args.height}
        width=${args.width}
        .tabs=${threeTabs}
      >
        <div slot="tab:logs" style="padding: 12px; font-family: monospace; font-size: 12px;">
          [12:00:01] app started<br />
          [12:00:02] listening on :8080
        </div>
        <div slot="tab:staging" style="padding: 12px; font-family: monospace; font-size: 12px;">
          Building image...<br />
          Pushing to registry...
        </div>
        <div slot="tab:shell" style="padding: 12px; font-family: monospace; font-size: 12px;">
          $ _
        </div>
      </trailhand-dock>
    </div>
  `,
};

export const SingleTab: Story = {
  args: { activeTab: 'logs' },
  render: (args) => html`
    <div style="height: 400px; display: flex; flex-direction: column; justify-content: flex-end;">
      <trailhand-dock
        ?open=${args.open}
        pin=${args.pin}
        active-tab=${args.activeTab}
        height=${args.height}
        .tabs=${[{ id: 'logs', label: 'App Logs' }]}
      >
        <div slot="tab:logs" style="padding: 12px; font-family: monospace; font-size: 12px;">
          A single tab has no other tabs to fall back to when closed.
        </div>
      </trailhand-dock>
    </div>
  `,
};

export const WithIcons: Story = {
  render: (args) => html`
    <div style="height: 400px; display: flex; flex-direction: column; justify-content: flex-end;">
      <trailhand-dock
        ?open=${args.open}
        pin=${args.pin}
        active-tab=${args.activeTab}
        height=${args.height}
        .tabs=${[
          { id: 'logs', label: 'App Logs', icon: 'list' },
          { id: 'shell', label: 'Shell', icon: 'codeBranch' },
        ]}
      >
        <div slot="tab:logs" style="padding: 12px;">Logs content</div>
        <div slot="tab:shell" style="padding: 12px;">Shell content</div>
      </trailhand-dock>
    </div>
  `,
};

export const NonClosableTab: Story = {
  args: { activeTab: 'logs' },
  render: (args) => html`
    <div style="height: 400px; display: flex; flex-direction: column; justify-content: flex-end;">
      <trailhand-dock
        ?open=${args.open}
        pin=${args.pin}
        active-tab=${args.activeTab}
        height=${args.height}
        .tabs=${[{ id: 'logs', label: 'App Logs', closable: false }]}
      >
        <div slot="tab:logs" style="padding: 12px;">
          This tab has no close button (closable: false).
        </div>
      </trailhand-dock>
    </div>
  `,
};

export const Empty: Story = {
  args: { open: false },
  render: (args) => html`
    <div style="height: 200px;">
      <trailhand-dock ?open=${args.open} pin=${args.pin} .tabs=${[]}>
      </trailhand-dock>
      <p style="font-size: 13px; color: var(--th-color-text-secondary, #666); padding: 12px;">
        Dock renders nothing when there are no open tabs.
      </p>
    </div>
  `,
};

export const PinLeft: Story = {
  args: { pin: 'left', activeTab: 'logs' },
  render: (args) => html`
    <div style="height: 400px; display: flex; justify-content: flex-end;">
      <trailhand-dock
        ?open=${args.open}
        pin="left"
        active-tab=${args.activeTab}
        width=${args.width}
        .tabs=${threeTabs}
      >
        <div slot="tab:logs" style="padding: 12px; font-family: monospace; font-size: 12px;">
          Left-pinned dock, sized by width instead of height.
        </div>
        <div slot="tab:staging" style="padding: 12px;">Staging content</div>
        <div slot="tab:shell" style="padding: 12px;">Shell content</div>
      </trailhand-dock>
    </div>
  `,
};

export const PinRight: Story = {
  args: { pin: 'right', activeTab: 'logs' },
  render: (args) => html`
    <div style="height: 400px; display: flex; justify-content: flex-start;">
      <trailhand-dock
        ?open=${args.open}
        pin="right"
        active-tab=${args.activeTab}
        width=${args.width}
        .tabs=${threeTabs}
      >
        <div slot="tab:logs" style="padding: 12px; font-family: monospace; font-size: 12px;">
          Right-pinned dock.
        </div>
        <div slot="tab:staging" style="padding: 12px;">Staging content</div>
        <div slot="tab:shell" style="padding: 12px;">Shell content</div>
      </trailhand-dock>
    </div>
  `,
};

export const ActiveTabStaging: Story = {
  args: { activeTab: 'staging' },
  render: Default.render,
};

export const ManyTabsOverflow: Story = {
  args: { activeTab: 'tab-1' },
  render: (args) => html`
    <div style="height: 400px; display: flex; flex-direction: column; justify-content: flex-end;">
      <trailhand-dock
        ?open=${args.open}
        pin=${args.pin}
        active-tab=${args.activeTab}
        height=${args.height}
        .tabs=${Array.from({ length: 12 }, (_, i) => ({
          id: `tab-${i + 1}`,
          label: `Instance ${i + 1} logs`,
        }))}
      >
        ${Array.from({ length: 12 }, (_, i) => html`
          <div slot="tab:tab-${i + 1}" style="padding: 12px;">
            Content for tab ${i + 1}
          </div>
        `)}
      </trailhand-dock>
    </div>
  `,
};

export const DarkMode: Story = {
  render: (args) => html`
    <div
      data-theme="dark"
      style="height: 400px; background: #1a1a1a; display: flex; flex-direction: column; justify-content: flex-end;"
    >
      <trailhand-dock
        ?open=${args.open}
        pin=${args.pin}
        active-tab=${args.activeTab}
        height=${args.height}
        width=${args.width}
        .tabs=${threeTabs}
      >
        <div slot="tab:logs" style="padding: 12px; font-family: monospace; font-size: 12px;">
          [12:00:01] app started<br />
          [12:00:02] listening on :8080
        </div>
        <div slot="tab:staging" style="padding: 12px; font-family: monospace; font-size: 12px;">
          Building image...<br />
          Pushing to registry...
        </div>
        <div slot="tab:shell" style="padding: 12px; font-family: monospace; font-size: 12px;">
          $ _
        </div>
      </trailhand-dock>
    </div>
  `,
};

export const ResizeKeyboardInteraction: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const dock = canvasElement.querySelector('trailhand-dock');
    if (!dock) throw new Error('Dock not found');

    const dockEl = dock as any;
    const startHeight = dockEl.height;
    const onResize = fn();
    dock.addEventListener('dock-resize', onResize);

    const resizer = dock.shadowRoot?.querySelector('.dock__resizer') as HTMLElement;
    if (!resizer) throw new Error('Resizer not found');
    resizer.focus();
    await userEvent.keyboard('{ArrowUp}');

    await expect(onResize).toHaveBeenCalled();
    await expect(dockEl.height).toBe(startHeight + 20);
  },
};

export const ResizePointerInteraction: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const dock = canvasElement.querySelector('trailhand-dock');
    if (!dock) throw new Error('Dock not found');

    const dockEl = dock as any;
    const startHeight = dockEl.height;
    const resizer = dock.shadowRoot?.querySelector('.dock__resizer') as HTMLElement;
    if (!resizer) throw new Error('Resizer not found');

    resizer.dispatchEvent(new PointerEvent('pointerdown', { clientY: 500, pointerId: 1, bubbles: true }));
    resizer.dispatchEvent(new PointerEvent('pointermove', { clientY: 460, pointerId: 1, bubbles: true }));
    resizer.dispatchEvent(new PointerEvent('pointerup', { clientY: 460, pointerId: 1, bubbles: true }));

    // dragging up grows a bottom-pinned dock
    await expect(dockEl.height).toBe(startHeight + 40);
  },
};

export const TabSwitchInteraction: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const dock = canvasElement.querySelector('trailhand-dock');
    if (!dock) throw new Error('Dock not found');

    const onSwitch = fn();
    dock.addEventListener('dock-tab-switch', onSwitch);

    const stagingTab = dock.shadowRoot?.querySelector('#tab-staging');
    if (!stagingTab) throw new Error('Staging tab not found');
    await userEvent.click(stagingTab);

    await expect(onSwitch).toHaveBeenCalled();
    await expect(dock.getAttribute('active-tab')).toBe('staging');
  },
};

export const TabCloseInteraction: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const dock = canvasElement.querySelector('trailhand-dock');
    if (!dock) throw new Error('Dock not found');

    const onClose = fn();
    dock.addEventListener('dock-tab-close', onClose);

    const closeButton = dock.shadowRoot?.querySelector(
      '#tab-shell .dock__tab-close',
    );
    if (!closeButton) throw new Error('Close button not found');

    await userEvent.click(closeButton);

    await expect(onClose).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { id: 'shell' } }),
    );
  },
};
