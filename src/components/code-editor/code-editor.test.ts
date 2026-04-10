import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './code-editor';
import type { CodeEditor } from './code-editor';

describe('CodeEditor', () => {
  let el: CodeEditor;

  beforeEach(async () => {
    el = document.createElement('trailhand-code-editor') as CodeEditor;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const getInput = () =>
    el.shadowRoot!.querySelector<HTMLInputElement>('input.input');
  const getTextarea = () =>
    el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea.editor');
  const getMirror = () =>
    el.shadowRoot!.querySelector<HTMLDivElement>('.editor-mirror');

  const switchToMultiLine = async () => {
    const input = getInput()!;
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    await el.updateComplete;
    // wait for the updateComplete.then() inside _switchToMultiLine
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  };

  describe('Mode switching', () => {
    it('starts in single-line mode', () => {
      expect(getInput()).toBeTruthy();
      expect(getTextarea()).toBeNull();
    });

    it('switches to multi-line mode on Enter', async () => {
      await switchToMultiLine();
      expect(getTextarea()).toBeTruthy();
      expect(getInput()).toBeNull();
    });

    it('preserves value when switching to multi-line', async () => {
      el.value = 'hello';
      await el.updateComplete;
      await switchToMultiLine();
      expect(getTextarea()!.value).toContain('hello');
    });

    it('appends a newline when switching to multi-line', async () => {
      el.value = 'hello';
      await el.updateComplete;
      await switchToMultiLine();
      expect(getTextarea()!.value).toBe('hello\n');
    });

    it('switches back to single-line on Backspace when one line remains', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      // Clear to a single line
      textarea.value = 'oneliner';
      textarea.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Backspace', bubbles: true }),
      );
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;

      expect(getInput()).toBeTruthy();
      expect(getTextarea()).toBeNull();
    });

    it('preserves value when collapsing back to single-line', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = 'preserved';
      textarea.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Backspace', bubbles: true }),
      );
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;

      expect(el.value).toBe('preserved');
    });

    it('starts in multi-line mode when initial value contains newlines', async () => {
      document.body.innerHTML = '';
      const fresh = document.createElement(
        'trailhand-code-editor',
      ) as CodeEditor;
      fresh.value = 'line one\nline two';
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      await fresh.updateComplete;

      expect(fresh.shadowRoot!.querySelector('textarea.editor')).toBeTruthy();
    });
  });

  describe('Paste handling', () => {
    it('switches to multi-line when pasting text with newlines', async () => {
      const input = getInput()!;

      const dt = new DataTransfer();
      dt.setData('text/plain', 'line one\nline two');
      input.dispatchEvent(
        new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: dt,
        }),
      );

      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;

      expect(getTextarea()).toBeTruthy();
    });

    it('stays in single-line mode when pasting text without newlines', async () => {
      const input = getInput()!;

      const dt = new DataTransfer();
      dt.setData('text/plain', 'no newlines here');
      input.dispatchEvent(
        new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: dt,
        }),
      );

      await el.updateComplete;

      expect(getInput()).toBeTruthy();
      expect(getTextarea()).toBeNull();
    });

    it('normalizes tabs to spaces when pasting into single-line input', async () => {
      const input = getInput()!;

      const dt = new DataTransfer();
      dt.setData('text/plain', 'line one\n\tindented');
      input.dispatchEvent(
        new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: dt,
        }),
      );

      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;

      expect(el.value).not.toContain('\t');
      expect(el.value).toContain('  ');
    });

    it('normalizes tabs to spaces when pasting into the editor', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      const dt = new DataTransfer();
      dt.setData('text/plain', '\tindented line');
      textarea.dispatchEvent(
        new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: dt,
        }),
      );

      await el.updateComplete;

      expect(el.value).not.toContain('\t');
    });
  });

  describe('Tab key', () => {
    it('inserts two spaces on Tab', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = 'hello';
      textarea.selectionStart = textarea.selectionEnd = 5;

      textarea.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        }),
      );
      await el.updateComplete;

      expect(textarea.value).toBe('hello  ');
    });

    it('inserts spaces at cursor position, not always at end', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = 'helloworld';
      textarea.selectionStart = textarea.selectionEnd = 5;

      textarea.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        }),
      );
      await el.updateComplete;

      expect(textarea.value).toBe('hello  world');
    });

    it('moves cursor two positions forward after Tab', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = 'ab';
      textarea.selectionStart = textarea.selectionEnd = 2;

      textarea.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        }),
      );
      await el.updateComplete;

      expect(textarea.selectionStart).toBe(4);
      expect(textarea.selectionEnd).toBe(4);
    });
  });

  describe('Mirror rendering', () => {
    it('mirror is present in multi-line mode', async () => {
      await switchToMultiLine();
      expect(getMirror()).toBeTruthy();
    });

    it('mirror reflects current value', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = 'hello world';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(getMirror()!.textContent).toContain('hello');
    });

    it('mirror renders space indicators when focused', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = 'a b';
      textarea.dispatchEvent(new Event('focus', { bubbles: true }));
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(getMirror()!.querySelector('.ws-space')).toBeTruthy();
    });

    it('mirror renders newline indicators when focused', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = 'line one\nline two';
      textarea.dispatchEvent(new Event('focus', { bubbles: true }));
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(getMirror()!.querySelector('.ws-newline')).toBeTruthy();
    });

    it('mirror hides whitespace indicators when blurred', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = 'a b\nc d';
      textarea.dispatchEvent(new Event('focus', { bubbles: true }));
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      textarea.dispatchEvent(new Event('blur', { bubbles: true }));
      await el.updateComplete;

      expect(getMirror()!.querySelector('.ws-space')).toBeNull();
      expect(getMirror()!.querySelector('.ws-newline')).toBeNull();
    });

    it('mirror escapes HTML characters to prevent injection', async () => {
      await switchToMultiLine();

      const textarea = getTextarea()!;
      textarea.value = '<script>alert("xss")</script>';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(getMirror()!.querySelector('script')).toBeNull();
      expect(getMirror()!.innerHTML).toContain('&lt;script&gt;');
    });
  });

  describe('Reactive properties', () => {
    it('syncs value to internal input in single-line mode', async () => {
      el.value = 'hello';
      await el.updateComplete;
      expect(getInput()!.value).toBe('hello');
    });

    it('syncs disabled to internal input', async () => {
      el.disabled = true;
      await el.updateComplete;
      expect(getInput()!.disabled).toBe(true);
    });

    it('syncs disabled to textarea in multi-line mode', async () => {
      await switchToMultiLine();
      el.disabled = true;
      await el.updateComplete;
      expect(getTextarea()!.disabled).toBe(true);
    });

    it('reflects invalid as attribute', async () => {
      el.invalid = true;
      await el.updateComplete;
      expect(el.hasAttribute('invalid')).toBe(true);
    });

    it('renders label text', async () => {
      el.label = 'My Label';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('label')!.textContent).toContain(
        'My Label',
      );
    });

    it('renders required indicator when required', async () => {
      el.required = true;
      await el.updateComplete;
      expect(
        el.shadowRoot!.querySelector('.required-indicator')!.textContent,
      ).toBe('*');
    });
  });

  describe('Events', () => {
    it('emits code-input-change with value and name in single-line mode', async () => {
      el.name = 'my-editor';
      await el.updateComplete;

      let detail: any;
      el.addEventListener('code-input-change', (e) => {
        detail = (e as CustomEvent).detail;
      });

      const input = getInput()!;
      input.value = 'typed';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(detail.value).toBe('typed');
      expect(detail.name).toBe('my-editor');
    });

    it('emits code-input-change in multi-line mode', async () => {
      await switchToMultiLine();

      let detail: any;
      el.addEventListener('code-input-change', (e) => {
        detail = (e as CustomEvent).detail;
      });

      const textarea = getTextarea()!;
      textarea.value = 'line one\nline two';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      expect(detail.value).toBe('line one\nline two');
    });

    it('emits native change event', async () => {
      let fired = false;
      el.addEventListener('change', () => {
        fired = true;
      });

      const input = getInput()!;
      input.value = 'hello';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(fired).toBe(true);
    });

    it('emits composed events that cross shadow DOM boundary', async () => {
      let composed = false;
      el.addEventListener('code-input-change', (e) => {
        composed = (e as CustomEvent).composed;
      });

      const input = getInput()!;
      input.value = 'hello';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(composed).toBe(true);
    });
  });

  describe('Form integration', () => {
    it('sets form value when typing in single-line mode', async () => {
      const input = getInput()!;
      input.value = 'formval';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // internals.setFormValue is called — confirm value is synced
      expect(el.value).toBe('formval');
    });

    it('resets to single-line mode on formResetCallback', async () => {
      await switchToMultiLine();
      (el as any).formResetCallback();
      await el.updateComplete;

      expect(getInput()).toBeTruthy();
      expect(el.value).toBe('');
    });

    it('clears value on formResetCallback', async () => {
      el.value = 'something';
      await el.updateComplete;
      (el as any).formResetCallback();
      await el.updateComplete;

      expect(el.value).toBe('');
    });

    it('disables via formDisableCallback', async () => {
      (el as any).formDisableCallback(true);
      await el.updateComplete;

      expect(el.disabled).toBe(true);
    });
  });

  describe('Focus delegation', () => {
    it('focuses internal input in single-line mode', async () => {
      let focused = false;
      getInput()!.addEventListener('focus', () => {
        focused = true;
      });
      el.focus();
      expect(focused).toBe(true);
    });

    it('focuses textarea in multi-line mode', async () => {
      (el as any)._isMultiLine = true;
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;

      let focused = false;
      getTextarea()!.addEventListener('focus', () => {
        focused = true;
      });
      el.focus();

      expect(focused).toBe(true);
    });
  });
});
