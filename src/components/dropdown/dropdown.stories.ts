import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './dropdown';
import { DropdownProps } from './dropdown';

const NAMESPACES = [
  { label: 'All Namespaces', value: 'all' },
  { label: 'namespace-1',    value: 'namespace-1' },
  { label: 'namespace-2',    value: 'namespace-2' },
  { label: 'namespace-3',    value: 'namespace-3' },
  { label: 'namespace-4',    value: 'namespace-4' },
  { label: 'namespace-5',    value: 'namespace-5' },
  { label: 'namespace-6',    value: 'namespace-6' },
];

const meta: Meta<DropdownProps> = {
  title: 'Components/Dropdown',
  component: 'trailhand-dropdown',
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'The name identifier for the field',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text when nothing is selected',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the dropdown',
    },
    multiselect: {
      control: { type: 'boolean' },
      description: 'Allows multiple selections',
    },
    label: {
      control: { type: 'text' },
      description: 'Label text above the dropdown',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the field is required',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Marks the field as invalid',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the dropdown',
    },
  },
  args: {
    name: 'namespace',
    placeholder: 'Select a namespace...',
    disabled: false,
    multiselect: false,
    label: 'Namespace',
    required: false,
    invalid: false,
    size: 'medium',
  },
  render: (args) => html`
    <trailhand-dropdown
      name=${args.name}
      .options=${NAMESPACES}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?multiselect=${args.multiselect}
      label=${args.label ?? ''}
      ?required=${args.required}
      ?invalid=${args.invalid}
      size=${args.size}
    ></trailhand-dropdown>
  `,
};

export default meta;
type Story = StoryObj<DropdownProps>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  size="medium"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
};

/** Pre-populate a single selected value by setting the `value` property. */
export const WithPreselectedValue: Story = {
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  size="medium"
></trailhand-dropdown>

<script>
  const dropdown = document.querySelector('trailhand-dropdown');

  dropdown.options = [
    { label: 'All Namespaces', value: 'all' },
    { label: 'namespace-1',    value: 'namespace-1' },
    { label: 'namespace-2',    value: 'namespace-2' },
  ];

  dropdown.value = 'namespace-1';
</script>
        `.trim(),
      },
    },
  },
  render: (args) => html`
    <trailhand-dropdown
      name=${args.name}
      .options=${NAMESPACES}
      .value=${'namespace-1'}
      placeholder=${args.placeholder}
      label=${args.label ?? ''}
      size=${args.size}
    ></trailhand-dropdown>
  `,
};

/** Enable `multiselect` to allow multiple options to be chosen at once. */
export const Multiselect: Story = {
  args: {
    multiselect: true,
    label: 'Namespaces',
    placeholder: 'Select namespaces...',
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespaces"
  label="Namespaces"
  placeholder="Select namespaces..."
  multiselect
  size="medium"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
  render: (args) => html`
    <trailhand-dropdown
      name=${args.name}
      .options=${NAMESPACES}
      ?multiselect=${args.multiselect}
      placeholder=${args.placeholder}
      label=${args.label ?? ''}
      size=${args.size}
    ></trailhand-dropdown>
  `,
};

/**
 * Set `clearOthers: true` on any option to give it "All" behavior, selecting it
 * deselects every other option, and selecting any specific option automatically
 * removes the "All" selection.
 */
export const MultiselectWithClearAll: Story = {
  args: {
    multiselect: true,
    label: 'Namespaces',
    placeholder: 'Select namespaces...',
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespaces"
  label="Namespaces"
  placeholder="Select namespaces..."
  multiselect
  size="medium"
></trailhand-dropdown>

<script>
  const dropdown = document.querySelector('trailhand-dropdown');

  dropdown.options = [
    // clearOthers: true, selecting this clears all others,
    // and selecting any other option removes this one.
    { label: 'All Namespaces', value: 'all', clearOthers: true },
    { label: 'namespace-1',    value: 'namespace-1' },
    { label: 'namespace-2',    value: 'namespace-2' },
    { label: 'namespace-3',    value: 'namespace-3' },
    { label: 'namespace-4',    value: 'namespace-4' },
    { label: 'namespace-5',    value: 'namespace-5' },
    { label: 'namespace-6',    value: 'namespace-6' },
  ];
</script>
        `.trim(),
      },
    },
  },
  render: (args) => html`
    <trailhand-dropdown
      name=${args.name}
      .options=${[
        { label: 'All Namespaces', value: 'all', clearOthers: true },
        { label: 'namespace-1',    value: 'namespace-1' },
        { label: 'namespace-2',    value: 'namespace-2' },
        { label: 'namespace-3',    value: 'namespace-3' },
        { label: 'namespace-4',    value: 'namespace-4' },
        { label: 'namespace-5',    value: 'namespace-5' },
        { label: 'namespace-6',    value: 'namespace-6' },
      ]}
      ?multiselect=${args.multiselect}
      placeholder=${args.placeholder}
      label=${args.label ?? ''}
      size=${args.size}
    ></trailhand-dropdown>
  `,
};

/** Pre-populate multiple selected values by setting the `values` property. */
export const MultiselectWithPreselected: Story = {
  args: {
    multiselect: true,
    label: 'Namespaces',
    placeholder: 'Select namespaces...',
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespaces"
  label="Namespaces"
  placeholder="Select namespaces..."
  multiselect
  size="medium"
></trailhand-dropdown>

<script>
  const dropdown = document.querySelector('trailhand-dropdown');

  dropdown.options = [
    { label: 'All Namespaces', value: 'all' },
    { label: 'namespace-1',    value: 'namespace-1' },
    { label: 'namespace-2',    value: 'namespace-2' },
  ];

  dropdown.values = ['namespace-1', 'namespace-2'];
</script>
        `.trim(),
      },
    },
  },
  render: (args) => html`
    <trailhand-dropdown
      name=${args.name}
      .options=${NAMESPACES}
      .values=${['namespace-1', 'namespace-2']}
      ?multiselect=${args.multiselect}
      placeholder=${args.placeholder}
      label=${args.label ?? ''}
      size=${args.size}
    ></trailhand-dropdown>
  `,
};

/** Mark individual options with `disabled: true` to make them unselectable.*/
export const WithDisabledOptions: Story = {
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  size="medium"
></trailhand-dropdown>

<script>
  const dropdown = document.querySelector('trailhand-dropdown');

  dropdown.options = [
    { label: 'All Namespaces', value: 'all' },
    { label: 'namespace-1',    value: 'namespace-1' },
    { label: 'namespace-2',    value: 'namespace-2' },
    { label: 'namespace-3',    value: 'namespace-3', disabled: true },
    { label: 'namespace-4',    value: 'namespace-4' },
    { label: 'namespace-5',    value: 'namespace-5' },
  ];
</script>
        `.trim(),
      },
    },
  },
  render: (args) => html`
    <trailhand-dropdown
      name=${args.name}
      .options=${[
        { label: 'All Namespaces', value: 'all' },
        { label: 'namespace-1',    value: 'namespace-1' },
        { label: 'namespace-2',    value: 'namespace-2' },
        { label: 'namespace-3',    value: 'namespace-3', disabled: true },
        { label: 'namespace-4',    value: 'namespace-4' },
        { label: 'namespace-5',    value: 'namespace-5' },
      ]}
      placeholder=${args.placeholder}
      label=${args.label ?? ''}
      size=${args.size}
    ></trailhand-dropdown>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  disabled
  size="medium"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
  render: (args) => html`
    <trailhand-dropdown
      name=${args.name}
      .options=${NAMESPACES}
      .value=${'namespace-1'}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      label=${args.label ?? ''}
      size=${args.size}
    ></trailhand-dropdown>
  `,
};

export const Required: Story = {
  args: { required: true },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  required
  size="medium"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
};

export const Invalid: Story = {
  args: { invalid: true },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  invalid
  size="medium"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
};

export const Small: Story = {
  args: { size: 'small' },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  size="small"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
};

export const Medium: Story = {
  args: { size: 'medium' },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  size="medium"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
};

export const Large: Story = {
  args: { size: 'large' },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  label="Namespace"
  placeholder="Select a namespace..."
  size="large"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
};

export const NoLabel: Story = {
  args: { label: '' },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: `
<trailhand-dropdown
  name="namespace"
  placeholder="Select a namespace..."
  size="medium"
></trailhand-dropdown>
        `.trim(),
      },
    },
  },
};
