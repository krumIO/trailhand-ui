import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './selector';
import '../icon/icon';
import type { SelectorProps } from './selector';
import { Selector } from './selector';
import { expect, fn, userEvent } from 'storybook/test';

const meta: Meta<SelectorProps> = {
  title: 'Components/Selector',
  component: 'trailhand-selector',
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Primary text',
    },
    subtext: {
      control: 'text',
      description: 'Secondary inline text',
    },
    description: {
      control: 'text',
      description: 'Supporting description',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the selector is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the selector is disabled',
    },
    name: {
      control: 'text',
      description: 'Radio group name',
    },
    value: {
      control: 'text',
      description: 'Form value when selected',
    },
  },
  args: {
    text: 'Standard',
    subtext: 'Subtext',
    description: 'This is a selector option',
    checked: false,
    disabled: false,
    name: 'example',
    value: 'standard',
  },
  render: (args) => html`
    <div style="width: 300px">
      <trailhand-selector
        text=${args.text}
        subtext=${args.subtext}
        description=${args.description}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        name=${args.name}
        value=${args.value}
      >
        <trailhand-icon slot="icon" name="globe"></trailhand-icon>
      </trailhand-selector>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SelectorProps>;

export const OnlyText: Story = {
  args: {
    subtext: 'Text',
    description: '',
  },
  render: (args) => html`
    <div style="width: 300px">
      <trailhand-selector
        text=${args.text}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        name=${args.name}
        value=${args.value}
      ></trailhand-selector>
    </div>
  `,
};

export const WithSubtext: Story = {
  args: {
    subtext: 'Subtext',
    description: '',
  },
  render: (args) => html`
    <div style="width: 300px">
      <trailhand-selector
        text=${args.text}
        subtext=${args.subtext}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        name=${args.name}
        value=${args.value}
      ></trailhand-selector>
    </div>
  `,
};

export const WithDescription: Story = {
  args: {
    subtext: 'Subtext',
    description: 'This is a description.',
  },
  render: (args) => html`
    <div style="width: 300px">
      <trailhand-selector
        text=${args.text}
        subtext=${args.subtext}
        description=${args.description}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        name=${args.name}
        value=${args.value}
      ></trailhand-selector>
    </div>
  `,
};

export const WithIcon: Story = {
  render: (args) => html`
    <div style="width: 300px">
      <trailhand-selector
        text=${args.text}
        subtext=${args.subtext}
        description=${args.description}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        name=${args.name}
        value=${args.value}
      >
        <trailhand-icon slot="icon" name="globe"></trailhand-icon>
      </trailhand-selector>
    </div>
  `,
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const GroupedSelectors: Story = {
  render: () => html`
    <div style="display: grid; gap: 12px; max-width: 300px;">
      <trailhand-selector
        name="plan"
        value="basic"
        text="Basic"
        description="For individuals"
      ></trailhand-selector>

      <trailhand-selector
        name="plan"
        value="pro"
        text="Pro"
        description="For small teams"
        checked
      ></trailhand-selector>

      <trailhand-selector
        name="plan"
        value="enterprise"
        text="Enterprise"
        description="For large organizations"
      ></trailhand-selector>
    </div>
  `,
};

export const HandleChange: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    name: 'change-test',
    value: 'option-1',
  },
  play: async ({ canvasElement }) => {
    const selector = canvasElement.querySelector(
      'trailhand-selector',
    ) as Selector;

    if (!selector) {
      throw new Error('Selector not found');
    }

    const onChangeMock = fn();
    selector.addEventListener('selector-change', onChangeMock);

    const label = selector.shadowRoot?.querySelector('label');
    if (!label) {
      throw new Error('Label not found');
    }

    await userEvent.click(label);

    await expect(onChangeMock).toHaveBeenCalled();

    const event = onChangeMock.mock.calls[0][0] as CustomEvent;
    await expect(event.detail.checked).toBe(true);
    await expect(event.detail.name).toBe('change-test');
    await expect(event.detail.value).toBe('option-1');
  },
};

export const HandleDisabledChange: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    disabled: true,
    name: 'disabled-test',
    value: 'disabled',
  },
  play: async ({ canvasElement }) => {
    const selector = canvasElement.querySelector(
      'trailhand-selector',
    ) as Selector;

    if (!selector) {
      throw new Error('Selector not found');
    }

    const onChangeMock = fn();
    selector.addEventListener('selector-change', onChangeMock);

    const label = selector.shadowRoot?.querySelector('label');
    if (!label) {
      throw new Error('Label not found');
    }

    await userEvent.click(label);

    await expect(onChangeMock).not.toHaveBeenCalled();
  },
};

export const ExclusiveSelection: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => html`
    <div style="display: grid; gap: 12px; max-width: 300px;">
      <trailhand-selector
        name="exclusive"
        value="one"
        text="Option One"
      ></trailhand-selector>

      <trailhand-selector
        name="exclusive"
        value="two"
        text="Option Two"
      ></trailhand-selector>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const selectors =
      canvasElement.querySelectorAll<Selector>('trailhand-selector');

    const [one, two] = Array.from(selectors);

    const labelOne = one.shadowRoot!.querySelector('label')!;
    const labelTwo = two.shadowRoot!.querySelector('label')!;

    await userEvent.click(labelOne);
    await expect(one.checked).toBe(true);
    await expect(two.checked).toBe(false);

    await userEvent.click(labelTwo);
    await expect(one.checked).toBe(false);
    await expect(two.checked).toBe(true);
  },
};
