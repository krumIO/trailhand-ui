import { LitElement, html, css, TemplateResult } from 'lit';
import { property, state, query } from 'lit/decorators.js';

export class CodeEditor extends LitElement {
  static formAssociated = true;

  @property({ type: String }) name = '';
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = 'Enter value…';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private _isMultiLine = false;

  @query('.input') private _codeInput!: HTMLInputElement;
  @query('.editor') private _editor!: HTMLTextAreaElement;

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: 'Montserrat', system-ui, sans-serif;
      min-width: 0;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
    }

    label {
      font-size: 11px;
      color: var(--th-input-label, #000000);
    }

    .required-indicator {
      color: var(--th-color-red, #bf1e1e);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      font-size: 14px;
    }

    .code-input {
      width: 100%;
      padding: 0.75em 3em 0.75em 16px;
      border-radius: 8px;
      border: 1px solid var(--th-input-border, #d7d7d7);
      outline: none;
      background: transparent;
      transition: 0.2s ease;
      font-size: 14px;
      color: var(--th-input-text, #333);
      font-family: inherit;
      box-sizing: border-box;
      display: block;
      width: 100%;
    }

    .code-input:disabled {
      background-color: var(--th-input-bg, transparent);
    }

    .code-input::placeholder {
      color: var(--th-input-placeholder, #d7d7d7);
    }

    .code-input:focus {
      border-color: var(--th-input-focus-border, #005cb9);
    }

    /* Single-line */
    .single-line {
      display: flex;
      align-items: center;
    }

    /* Multi-line */
    .editor {
      resize: none;
      overflow-x: auto;
      overflow-y: hidden;
      line-height: 1.7;
      white-space: pre;
    }
  `;

  // Automatically adjust the height of the textarea based on its content
  private _autosize() {
    const el = this._editor;
    if (!el) return;
    el.style.height = 'auto';
    const max = parseFloat(getComputedStyle(el).lineHeight) * 8;
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }

  // Switch to multi-line mode
  private _switchToMultiLine(initial: string) {
    this.value = initial;
    this._isMultiLine = true;

    this.requestUpdate();

    this.updateComplete.then(() => {
      this._autosize();
      this._editor.focus();

      this._editor.value += '\n';
      this._editor.selectionStart = this._editor.selectionEnd =
        this._editor.value.length;

      this._autosize();
    });
  }

  // Switch to single-line mode
  private _switchToSingleLine() {
    this._isMultiLine = false;
    this.requestUpdate();
    this.updateComplete.then(() => {
      this._codeInput.focus();
    });
  }

  // Handle keydown events on the ghost input
  private _onCodeInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._switchToMultiLine(this._codeInput.value);
    }
  }

  // Handle paste events on the ghost input
  private _onCodeInputPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text') ?? '';
    if (text.includes('\n')) {
      e.preventDefault();
      this._switchToMultiLine(text);
    }
  }

  // Handle input events on the code input
  private _onCodeInput() {
    this.value = this._codeInput.value;
    this._emitChange();
  }

  // Handle input events on the editor textarea
  private _onEditorInput() {
    this.value = this._editor.value;
    this._autosize();
    this._emitChange();
  }

  // Handle keydown events on the editor textarea
  private _onEditorKeydown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = this._editor.selectionStart;
      const v = this._editor.value;
      this._editor.value = v.slice(0, s) + '  ' + v.slice(s);
      this._editor.selectionStart = this._editor.selectionEnd = s + 2;
      this._autosize();
    }
  }

  private _onEditorKeyup(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      // if the current value is one line, switch to single-line after backspace
      if (this._editor.value.split('\n').length === 1) {
        this._switchToSingleLine();
      }
    }
  }

  // Emit change events
  private _emitChange() {
    this.internals.setFormValue(this.value || null);
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent('code-input-change', {
        detail: { value: this.value, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Focus the appropriate input element
  focus() {
    this._isMultiLine ? this._editor?.focus() : this._codeInput?.focus();
  }

  // Handle form reset
  formResetCallback() {
    this._isMultiLine = false;
    this.value = '';
    this.internals.setFormValue(null);
  }

  // Handle form disable
  formDisableCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  render(): TemplateResult {
    return html`
      <div class="wrapper">
        <label>
          ${this.label}
          <span class="required-indicator">${this.required ? '*' : ''}</span>
        </label>

        <div class="input-wrapper">
          ${!this._isMultiLine
            ? html`
                <input
                  class="code-input input"
                  type="text"
                  name=${this.name}
                  .value=${this.value}
                  placeholder=${this.placeholder}
                  ?disabled=${this.disabled}
                  ?required=${this.required}
                  @keydown=${this._onCodeInputKeydown}
                  @paste=${this._onCodeInputPaste}
                  @input=${this._onCodeInput}
                />
              `
            : html`
                <textarea
                  class="code-input editor"
                  name=${this.name}
                  .value=${this.value}
                  ?disabled=${this.disabled}
                  spellcheck="false"
                  @input=${this._onEditorInput}
                  @keydown=${this._onEditorKeydown}
                  @keyup=${this._onEditorKeyup}
                ></textarea>
              `}
        </div>
      </div>
    `;
  }
}

customElements.define('trailhand-code-editor', CodeEditor);
