import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './code-editor';
import { expect, userEvent, waitFor } from 'storybook/test';

interface CodeEditorProps {
  name: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  label: string;
  size: 'small' | 'medium' | 'large';
  invalid: boolean;
}

const meta: Meta<CodeEditorProps> = {
  title: 'Components/CodeEditor',
  component: 'trailhand-code-editor',
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'The name identifier for the input',
    },
    value: {
      control: { type: 'text' },
      description: 'The current value of the editor',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown in single-line mode',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the editor is disabled',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the editor is required',
    },
    label: {
      control: { type: 'text' },
      description: 'Label text',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the editor',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Manually set invalid state',
    },
  },
  args: {
    name: 'code-editor',
    value: '',
    placeholder: 'Enter value…',
    disabled: false,
    required: false,
    label: 'Code Editor Label',
    size: 'medium',
    invalid: false,
  },
  render: (args) => html`
    <trailhand-code-editor
      name=${args.name}
      .value=${args.value}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
      size=${args.size}
      ?invalid=${args.invalid}
      label=${args.label ?? ''}
    ></trailhand-code-editor>
  `,
};

export default meta;
type Story = StoryObj<CodeEditorProps>;

export const Default: Story = {};

export const WithSingleLineValue: Story = {
  args: {
    value: 'hello world',
  },
};

export const WithMultiLineValue: Story = {
  args: {
    value: JSON.stringify({ name: 'Jane', age: 30, active: true }, null, 2),
  },
};

export const WithLongMultiLineValue: Story = {
  name: 'Scrollable (8+ lines)',
  args: {
    value: JSON.stringify(
      {
        id: 101,
        name: 'Jane Doe',
        isActive: true,
        roles: ['admin', 'editor'],
        profile: {
          email: 'jane.doe@example.com',
          joined: '2023-01-15',
        },
        preferences: null,
        metadata: {
          createdBy: 'system',
          version: 3,
        },
      },
      null,
      2,
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: JSON.stringify({ name: 'Jane', active: true }, null, 2),
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    value: 'bad value',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    value: JSON.stringify({ name: 'Jane' }, null, 2),
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    value: JSON.stringify({ name: 'Jane' }, null, 2),
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    value: JSON.stringify({ name: 'Jane' }, null, 2),
  },
};

// ── Interaction tests ──

export const TypeSingleLine: Story = {
  name: 'Interaction: type in single-line mode',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('trailhand-code-editor');
    if (!editor) throw new Error('CodeEditor not found');

    const input =
      editor.shadowRoot?.querySelector<HTMLInputElement>('input.input');
    if (!input) throw new Error('Internal input not found');

    await userEvent.type(input, 'hello world');
    await expect(input).toHaveValue('hello world');
  },
};

export const EnterExpandsToMultiLine: Story = {
  name: 'Interaction: Enter switches to multi-line',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('trailhand-code-editor');
    if (!editor) throw new Error('CodeEditor not found');

    const input =
      editor.shadowRoot?.querySelector<HTMLInputElement>('input.input');
    if (!input) throw new Error('Internal input not found');

    await userEvent.type(input, 'first line');
    await userEvent.keyboard('{Enter}');

    await expect(
      editor.shadowRoot?.querySelector('textarea.editor'),
    ).toBeTruthy();
  },
};

export const TabInsertsSpaces: Story = {
  name: 'Interaction: Tab inserts two spaces',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('trailhand-code-editor');
    if (!editor) throw new Error('CodeEditor not found');

    const input =
      editor.shadowRoot?.querySelector<HTMLInputElement>('input.input');
    if (!input) throw new Error('Internal input not found');

    await userEvent.type(input, 'line one');
    await userEvent.keyboard('{Enter}');

    // Wait for the mode switch to complete and textarea to appear
    const textarea = await waitFor(() => {
      const el =
        editor.shadowRoot?.querySelector<HTMLTextAreaElement>(
          'textarea.editor',
        );
      if (!el) throw new Error('textarea not yet rendered');
      return el;
    });

    await userEvent.keyboard('{Tab}');
    await expect(textarea.value).toContain('  ');
  },
};

export const BackspaceCollapsesToSingleLine: Story = {
  name: 'Interaction: Backspace collapses to single-line when one line remains',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('trailhand-code-editor');
    if (!editor) throw new Error('CodeEditor not found');

    const input =
      editor.shadowRoot?.querySelector<HTMLInputElement>('input.input');
    if (!input) throw new Error('Internal input not found');

    await userEvent.type(input, 'only line');
    await userEvent.keyboard('{Enter}');

    const textarea =
      editor.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea.editor');
    if (!textarea) throw new Error('Internal textarea not found');

    // Delete the empty second line to collapse back
    await userEvent.keyboard('{Backspace}');

    await expect(editor.shadowRoot?.querySelector('input.input')).toBeTruthy();
  },
};

export const PasteMultiLine: Story = {
  name: 'Interaction: pasting multi-line content expands editor',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('trailhand-code-editor');
    if (!editor) throw new Error('CodeEditor not found');

    const input =
      editor.shadowRoot?.querySelector<HTMLInputElement>('input.input');
    if (!input) throw new Error('Internal input not found');

    await userEvent.click(input);

    // Dispatch a real ClipboardEvent with actual clipboardData
    const pastedText = '{\n  "name": "Jane"\n}';
    const clipboardEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: new DataTransfer(),
    });
    clipboardEvent.clipboardData!.setData('text/plain', pastedText);
    input.dispatchEvent(clipboardEvent);

    await waitFor(() => {
      const el = editor.shadowRoot?.querySelector('textarea.editor');
      if (!el) throw new Error('textarea not yet rendered');
      return el;
    });

    const textarea =
      editor.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea.editor');
    await expect(textarea).toBeTruthy();
    await expect(textarea?.value).toContain('"name": "Jane"');
  },
};
