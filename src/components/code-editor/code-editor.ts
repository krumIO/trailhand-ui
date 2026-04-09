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
  @property({ type: String, reflect: true }) size:
    | 'small'
    | 'medium'
    | 'large' = 'medium';

  @state() private _isMultiLine = false;
  @state() private _isFocused = false;

  @query('.input') private _codeInput!: HTMLInputElement;
  @query('.editor') private _editor!: HTMLTextAreaElement;
  @query('.editor-mirror') private _mirror!: HTMLDivElement;

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
      width: 100%;
      font-size: 14px;
    }

    /* Shared visual style for both modes */
    .code-input {
      width: 100%;
      padding: 0.75em 16px;
      border-radius: 8px;
      border: 1px solid var(--th-input-border, #d7d7d7);
      outline: none;
      background: transparent;
      transition: border-color 0.2s ease;
      font-family: 'Montserrat', system-ui, sans-serif;
      color: var(--th-input-text, #333);
      box-sizing: border-box;
      display: block;
      line-height: 1.7;
    }

    .code-input:disabled {
      background-color: var(--th-input-bg, transparent);
      opacity: 0.6;
      cursor: not-allowed;
    }

    .code-input::placeholder {
      color: var(--th-input-placeholder, #d7d7d7);
    }

    .code-input:focus {
      border-color: var(--th-input-focus-border, #005cb9);
    }

    :host([invalid]) .code-input {
      border-color: var(--th-input-border-invalid, #9f3a3a);
    }

    /* ── Single-line ── */
    .single-line {
      width: 100%;
    }

    /* ── Multi-line ── */
    .editor {
      resize: none;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: pre;
      color: transparent;
      caret-color: var(--th-input-text, #333);
      position: relative;
      z-index: 1;
    }

    .editor:disabled {
      color: var(--th-input-text, #333);
      opacity: 0.6;
    }

    .editor-mirror {
      position: absolute;
      inset: 0;
      padding: 0.75em 16px;
      font-family: 'Montserrat', system-ui, sans-serif;
      line-height: 1.7;
      white-space: pre;
      pointer-events: none;
      z-index: 0;
      color: var(--th-input-text, #333);
      box-sizing: border-box;
      border-radius: 8px;
    }

    :host([disabled]) .editor-mirror {
      display: none;
    }

    .editor-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: 8px;
    }

    /* Sizes */
    :host([size='small']) input {
      font-size: 12px;
    }
    :host([size='small']) textarea {
      font-size: 12px;
    }
    :host([size='small']) .editor-mirror {
      font-size: 12px;
    }

    :host([size='medium']) input {
      font-size: 14px;
    }
    :host([size='medium']) textarea {
      font-size: 14px;
    }
    :host([size='medium']) .editor-mirror {
      font-size: 14px;
    }

    :host([size='large']) input {
      font-size: 16px;
    }
    :host([size='large']) textarea {
      font-size: 16px;
    }
    :host([size='large']) .editor-mirror {
      font-size: 16px;
    }

    /* Whitespace indicators */
    .ws-space {
      position: relative;
      color: transparent;
      white-space: pre;
    }

    .ws-space::before {
      content: '·';
      position: absolute;
      width: 100%;
      text-align: center;
      color: var(--th-input-placeholder, #d7d7d7);
      pointer-events: none;
    }

    .ws-newline {
      color: transparent;
      position: relative;
      white-space: pre;
    }

    .ws-newline::before {
      content: '↵';
      position: absolute;
      color: var(--th-input-placeholder, #d7d7d7);
      pointer-events: none;
    }
  `;

  // When the component is added to the DOM, check if the initial value contains newlines
  connectedCallback() {
    super.connectedCallback();
    if (this.value?.includes('\n')) {
      this._isMultiLine = true;
      this._isFocused = false;
      this.updateComplete.then(() => {
        this._autosize();
        this._updateMirror();
        this._syncMirrorScroll();
      });
    }
    // Check if we're in a disabled fieldset on initial connection
    const fieldset = this.closest('fieldset');
    if (fieldset?.disabled) {
      this.disabled = true;
    }
  }

  // Autosize the textarea based on content, with a max height of 8 lines
  private _autosize() {
    const el = this._editor;
    if (!el) return;
    el.style.height = 'auto';
    const max = parseFloat(getComputedStyle(el).lineHeight) * 8;
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }

  // Sync scroll between editor and mirror
  private _syncMirrorScroll() {
    if (this._mirror && this._editor) {
      const x = this._editor.scrollLeft;
      const y = this._editor.scrollTop;
      this._mirror.style.transform = `translate(${-x}px, ${-y}px)`;
    }
  }

  // Normalize tabs to spaces for consistent rendering in the mirror
  private _normalizeTabs(text: string) {
    return text.replace(/\t/g, '  ');
  }

  // Escape HTML special characters to prevent rendering issues
  private _escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Render a line of text, replacing spaces and tabs with visible indicators
  private _renderLineWithSpaces(line: string): string {
    let out = '';
    for (const ch of line) {
      if (ch === ' ') {
        out += `<span class="ws-space"> </span>`;
      } else {
        out += this._escapeHtml(ch);
      }
    }
    return out;
  }

  // Render the entire content for the mirror, handling newlines and whitespace
  private _renderMirrorContent(text: string): string {
    if (!this._isFocused) {
      return this._escapeHtml(text);
    }

    return text
      .split('\n')
      .map((line, i, arr) => {
        const rendered = this._renderLineWithSpaces(line);
        const nl =
          i < arr.length - 1 ? `<span class="ws-newline">\n</span>` : '';
        return rendered + nl;
      })
      .join('');
  }

  // Update the mirror content whenever the value changes or focus state changes
  private _updateMirror() {
    if (this._mirror) {
      this._mirror.innerHTML = this._renderMirrorContent(this.value);
    }
  }

  // Switch to multi-line mode, initializing the textarea with the given content
  private _switchToMultiLine(initial: string) {
    this.value = initial;
    this._isMultiLine = true;
    this._isFocused = true;

    this.requestUpdate();

    this.updateComplete.then(() => {
      this._autosize();
      this._updateMirror();
      this._editor.focus();
      this._editor.value += '\n';
      this._editor.selectionStart = this._editor.selectionEnd =
        this._editor.value.length;
      this.value = this._editor.value;
      this._autosize();
      this._updateMirror();
      this._syncMirrorScroll();
    });
  }

  // Switch back to single-line mode, focusing the input and updating the value
  private _switchToSingleLine() {
    this._isMultiLine = false;
    this._isFocused = false;
    this.requestUpdate();
    this.updateComplete.then(() => {
      this._codeInput.focus();
    });
  }

  // Event handlers for input, keydown, paste, focus, and blur events

  private _onCodeInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._switchToMultiLine(this._codeInput.value);
    }
  }

  private _onCodeInputPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text') ?? '';
    const normalized = this._normalizeTabs(text);

    if (normalized.includes('\n')) {
      e.preventDefault();
      this._switchToMultiLine(normalized);
    }
  }

  private _onCodeInput() {
    this.value = this._codeInput.value;
    this._updateValidity();
    this._emitChange();
  }

  private _onEditorInput() {
    this.value = this._editor.value;
    this._autosize();
    this._updateMirror();
    this._syncMirrorScroll();
    this._updateValidity();
    this._emitChange();
  }

  private _onEditorKeydown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = this._editor.selectionStart;
      const v = this._editor.value;
      this._editor.value = v.slice(0, s) + '  ' + v.slice(s);
      this._editor.selectionStart = this._editor.selectionEnd = s + 2;
      this.value = this._editor.value;
      this._autosize();
      this._updateMirror();
      this._syncMirrorScroll();
      this._emitChange();
    }
  }

  private _onEditorKeyup(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      if (this._editor.value.split('\n').length === 1) {
        this.value = this._editor.value;
        this._switchToSingleLine();
      }
    }
  }

  private _onEditorPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text') ?? '';
    const normalized = text.replace(/\t/g, '  ');

    if (normalized !== text) {
      e.preventDefault();

      const start = this._editor.selectionStart;
      const end = this._editor.selectionEnd;
      const value = this._editor.value;

      this._editor.value =
        value.slice(0, start) + normalized + value.slice(end);

      const pos = start + normalized.length;
      this._editor.selectionStart = this._editor.selectionEnd = pos;
    }

    this.value = this._editor.value;

    this._autosize();
    this._updateMirror();
    this._syncMirrorScroll();
    this._emitChange();
  }

  private _onEditorFocus() {
    this._isFocused = true;
    this._updateMirror();
  }

  private _onEditorBlur() {
    this._isFocused = false;
    this._updateMirror();
  }

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

  focus() {
    this._isMultiLine ? this._editor?.focus() : this._codeInput?.focus();
  }

  private _updateValidity() {
    const isValid = this._isMultiLine
      ? this._editor.validity.valid
      : this._codeInput.validity.valid;
    this.invalid = !isValid;
    if (isValid) {
      this.internals.setValidity({});
    } else {
      this.internals.setValidity(
        this._isMultiLine ? this._editor.validity : this._codeInput.validity,
        this._isMultiLine
          ? this._editor.validationMessage
          : this._codeInput.validationMessage,
        this._isMultiLine ? this._editor : this._codeInput,
      );
    }
  }

  formResetCallback() {
    this._isMultiLine = false;
    this._isFocused = false;
    this.value = '';
    this.internals.setFormValue(null);
  }

  formDisableCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formAssociatedCallback(form: HTMLFormElement | null) {
    form?.addEventListener('submit', () => {
      this._updateValidity();
    });
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
                <div class="single-line">
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
                </div>
              `
            : html`
                <div class="editor-container">
                  <textarea
                    class="code-input editor"
                    name=${this.name}
                    .value=${this.value}
                    ?disabled=${this.disabled}
                    spellcheck="false"
                    @input=${this._onEditorInput}
                    @keydown=${this._onEditorKeydown}
                    @keyup=${this._onEditorKeyup}
                    @focus=${this._onEditorFocus}
                    @blur=${this._onEditorBlur}
                    @scroll=${this._syncMirrorScroll}
                    @paste=${this._onEditorPaste}
                  ></textarea>
                  <div class="editor-mirror"></div>
                </div>
              `}
        </div>
      </div>
    `;
  }
}

customElements.define('trailhand-code-editor', CodeEditor);
