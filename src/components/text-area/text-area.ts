import { LitElement, html, css, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

export interface TextAreaProps {
  name: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  size: 'small' | 'medium' | 'large';
  label?: string;
  required?: boolean;
  invalid?: boolean;
  rows?: number;
  maxlength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  showCount?: boolean;
}

export class TextArea extends LitElement {
  static formAssociated = true;

  @property({ type: String })
  name = '';

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = '';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: String })
  label = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ type: Number })
  rows = 4;

  @property({ type: Number })
  maxlength?: number;

  @property({ type: String })
  resize: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';

  @property({ type: Boolean })
  showCount = false;

  private internals: ElementInternals;
  private _textarea: HTMLTextAreaElement;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    label {
      font-size: 11px;
      color: var(--th-input-label, #000000);
    }

    label .required-indicator {
      color: var(--th-color-red, #bf1e1e);
    }

    .textarea-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      font-size: 14px;
    }

    textarea {
      width: 100%;
      padding: 0.75em 16px;
      border-radius: 8px;
      border: 1px solid var(--th-input-border, #d7d7d7);
      outline: none;
      background: transparent;
      transition: border-color 0.2s ease;
      font-size: 14px;
      color: var(--th-input-text, #333);
      box-sizing: border-box;
      font-family: var(--font-family, 'Poppins', sans-serif);
      line-height: 1.5;
      resize: var(--th-textarea-resize, vertical);
      min-height: 80px;
    }

    textarea:disabled {
      background-color: var(--th-input-bg, transparent);
      opacity: 0.6;
      cursor: not-allowed;
    }

    textarea::placeholder {
      color: var(--th-input-placeholder, #d7d7d7);
    }

    textarea:focus {
      border-color: var(--th-input-focus-border, #005cb9);
    }

    /* Character count */
    .count {
      align-self: flex-end;
      font-size: 11px;
      color: var(--th-input-label, #999);
      margin-top: 0.25rem;
      user-select: none;
    }

    .count.over-limit {
      color: var(--th-input-border-invalid, #9f3a3a);
    }

    /* Sizes */
    :host([size='small']) .textarea-wrapper {
      font-size: 12px;
    }
    :host([size='small']) textarea {
      font-size: 12px;
      min-height: 60px;
    }

    :host([size='large']) .textarea-wrapper {
      font-size: 16px;
    }
    :host([size='large']) textarea {
      font-size: 16px;
      min-height: 100px;
    }

    /* Disabled label */
    :host([disabled]) label {
      color: var(--th-input-label-disabled, #999);
    }

    /* Invalid */
    :host([invalid]) textarea {
      border-color: var(--th-input-border-invalid, #9f3a3a);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    const fieldset = this.closest('fieldset');
    if (fieldset?.disabled) {
      this.disabled = true;
    }
  }

  focus() {
    this._textarea?.focus();
  }

  private get _currentLength(): number {
    return this.value?.length ?? 0;
  }

  private get _isOverLimit(): boolean {
    return this.maxlength != null && this._currentLength > this.maxlength;
  }

  private emitChangeEvent() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent('text-area-change', {
        detail: { value: this.value, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;

    if (this.value) {
      this.internals.setFormValue(this.value);
    } else {
      this.internals.setFormValue(null);
    }

    this.emitChangeEvent();
    this._updateValidity();
  }

  firstUpdated() {
    this._textarea = this.shadowRoot!.querySelector('textarea')!;
    // Apply resize style via CSS custom property
    this._textarea.style.resize = this.resize;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('resize') && this._textarea) {
      this._textarea.style.resize = this.resize;
    }
  }

  private _updateValidity() {
    const isValid = this._textarea.validity.valid && !this._isOverLimit;
    this.invalid = !isValid;

    if (isValid) {
      this.internals.setValidity({});
    } else {
      this.internals.setValidity(
        this._textarea.validity,
        this._isOverLimit
          ? `Exceeded maximum length of ${this.maxlength}`
          : this._textarea.validationMessage,
        this._textarea,
      );
    }
  }

  formResetCallback() {
    this.value = '';
    this.internals.setFormValue(this.value);
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
    const countLabel = this.maxlength != null
      ? `${this._currentLength} / ${this.maxlength}`
      : `${this._currentLength}`;

    return html`
      <div class="wrapper">
        <label for=${this.name} class="input-label">
          ${this.label}
          <span class="required-indicator">${this.required ? '*' : ''}</span>
        </label>
        <div class="textarea-wrapper">
          <textarea
            name=${this.name}
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            rows=${this.rows}
            @input=${this.handleInput}
          ></textarea>
          ${this.showCount
            ? html`<span class="count ${this._isOverLimit ? 'over-limit' : ''}">${countLabel}</span>`
            : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('trailhand-text-area', TextArea);