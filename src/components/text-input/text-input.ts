import { LitElement, html, css, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export interface TextInputProps {
  name: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  size: 'small' | 'medium' | 'large';
  label?: string;
  required?: boolean;
  invalid?: boolean;
}

export class TextInput extends LitElement {
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

  private internals: ElementInternals;
  private _input: HTMLInputElement;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  static styles = css`
    :host {
      display: inline-block;
      font-family: 'Montserrat', system-ui, sans-serif;
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

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 14px;
    }

    input {
      width: 100%;
      padding: 0.75em 3em 0.75em 16px;
      border-radius: 8px;
      border: 1px solid var(--th-input-border, #d7d7d7);
      outline: none;
      background: transparent;
      transition: 0.2s ease;
      font-size: 14px;
      color: var(--th-input-text, #333);
      box-sizing: border-box;
    }

    input:disabled {
      background-color: var(--th-input-bg, transparent);
      opacity: 0.6;
    }

    input::placeholder {
      color: var(--th-input-placeholder, #d7d7d7);
    }

    input:focus {
      border-color: var(--th-input-focus-border, #005cb9);
    }

    .icon {
      position: absolute;
      right: 1em;
      pointer-events: none;
      color: var(--th-input-icon-color, #d7d7d7);
    }

    /* Sizes */
    :host([size='small']) .input-wrapper {
      font-size: 12px;
    }
    :host([size='small']) input {
      font-size: 12px;
    }
    :host([size='large']) .input-wrapper {
      font-size: 16px;
    }
    :host([size='large']) input {
      font-size: 16px;
    }

    /* Disabled */
    input:disabled {
      cursor: not-allowed;
    }
    :host([disabled]) label {
      color: var(--th-input-label-disabled, #999);
    }

    /* Invalid */
    :host([invalid]) input {
      border-color: var(--th-input-border-invalid, #9f3a3a);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Check if we're in a disabled fieldset on initial connection
    const fieldset = this.closest('fieldset');
    if (fieldset?.disabled) {
      this.disabled = true;
    }
  }

  focus() {
    this._input?.focus();
  }

  private emitChangeEvent() {
    // emit native change event for form integration
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    // emit a custom event with the current value of the input
    this.dispatchEvent(
      new CustomEvent('text-input-change', {
        detail: { value: this.value, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    if (this.value) {
      this.internals.setFormValue(this.value);
    } else {
      this.internals.setFormValue(null);
    }

    this.emitChangeEvent();
  }

  firstUpdated() {
    this._input = this.shadowRoot!.querySelector('input')!;

    this._input.addEventListener('input', () => {
      this._updateValidity();
    });
  }

  private _updateValidity() {
    const isValid = this._input.validity.valid;
    this.invalid = !isValid;
    if (isValid) {
      this.internals.setValidity({});
    } else {
      this.internals.setValidity(
        this._input.validity,
        this._input.validationMessage,
        this._input,
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
    return html`
      <div class="wrapper">
        <label for=${this.name} class="input-label"
          >${this.label}
          <span class="required-indicator"
            >${this.required ? '*' : ''}</span
          ></label
        >
        <div class="input-wrapper">
          <input
            type="text"
            name=${this.name}
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @input=${this.handleInput}
          />
          <span class="icon"><slot name="icon"></slot></span>
        </div>
      </div>
    `;
  }
}

customElements.define('trailhand-text-input', TextInput);
