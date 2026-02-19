import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './checkbox';
import { CheckboxProps } from './checkbox';
import { Checkbox } from './checkbox';
import { expect, fn, userEvent } from 'storybook/test';

const meta: Meta<CheckboxProps> = {
  title: 'Components/Checkbox',
  component: 'trailhand-checkbox',
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is in indeterminate state',
    },
    name: {
      control: { type: 'text' },
      description: 'The name identifier for the checkbox',
    },
    value: {
      control: { type: 'text' },
      description: 'The value of the checkbox when checked',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the checkbox',
    },
  },
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    name: '',
    value: 'on',
    size: 'medium',
  },
  render: (args) => html`
    <trailhand-checkbox
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?indeterminate=${args.indeterminate}
      name=${args.name}
      value=${args.value}
      size=${args.size}
    >
      Checkbox Label
    </trailhand-checkbox>
  `,
};

export default meta;
type Story = StoryObj<CheckboxProps>;

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
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

export const IndeterminateDisabled: Story = {
  args: {
    indeterminate: true,
    disabled: true,
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

export const HandleChange: Story = {
  args: {
    checked: false,
    disabled: false,
    name: 'test-checkbox',
    value: 'test-value',
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('trailhand-checkbox');
    if (!checkbox) {
      throw new Error('Checkbox not found');
    }

    const onChangeMock = fn();
    checkbox.addEventListener('checkbox-change', onChangeMock);

    const label = checkbox.shadowRoot?.querySelector('label');
    if (!label) {
      throw new Error('Label element not found in shadow DOM');
    }

    await userEvent.click(label);
    await expect(onChangeMock).toHaveBeenCalled();

    const event = onChangeMock.mock.calls[0][0] as CustomEvent;
    await expect(event.detail.checked).toBe(true);
    await expect(event.detail.name).toBe('test-checkbox');
    await expect(event.detail.value).toBe('test-value');
  },
};

export const HandleDisabledChange: Story = {
  args: {
    checked: false,
    disabled: true,
    name: 'disabled-checkbox',
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('trailhand-checkbox');
    if (!checkbox) {
      throw new Error('Checkbox not found');
    }

    const onChangeMock = fn();
    checkbox.addEventListener('checkbox-change', onChangeMock);

    const label = checkbox.shadowRoot?.querySelector('label');
    if (!label) {
      throw new Error('Label element not found in shadow DOM');
    }

    await userEvent.click(label);
    await expect(onChangeMock).not.toHaveBeenCalled();
  },
};

export const IndeterminateToChecked: Story = {
  args: {
    indeterminate: true,
    name: 'indeterminate-checkbox',
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector(
      'trailhand-checkbox',
    ) as Checkbox;
    if (!checkbox) {
      throw new Error('Checkbox not found');
    }

    const onChangeMock = fn();
    checkbox.addEventListener('checkbox-change', onChangeMock);

    const label = checkbox.shadowRoot?.querySelector('label');
    if (!label) {
      throw new Error('Label element not found in shadow DOM');
    }

    // Verify indeterminate state initially
    await expect(checkbox.indeterminate).toBe(true);

    // Click should clear indeterminate and set checked
    await userEvent.click(label);

    await expect(onChangeMock).toHaveBeenCalled();
    const event = onChangeMock.mock.calls[0][0] as CustomEvent;
    await expect(event.detail.checked).toBe(true);
    await expect(event.detail.indeterminate).toBe(false);
  },
};
