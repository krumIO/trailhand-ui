import { LitElement, html, css, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../icon/icon';

export interface CheckboxProps {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  name: string;
  value: string;
  size: 'small' | 'medium' | 'large';
}

export class Checkbox extends LitElement {
  static formAssociated = true;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  @property({ type: String })
  name = '';

  @property({ type: String })
  value = 'on';

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  // ElementInternals for form integration
  private internals: ElementInternals;

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
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      cursor: pointer;
      font-weight: 500;
    }

    /* Hide native checkbox */
    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .label {
      color: var(--th-color-text-primary, #000000);
    }

    /* Custom box */
    .control {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1.5px solid var(--th-checkbox-border, #d7d7d7);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      background-color: transparent;
    }

    .control trailhand-icon {
      opacity: 0;
    }

    /* Size */
    :host([size='small']) .control {
      width: 12px;
      height: 12px;
    }
    :host([size='small']) .wrapper {
      font-size: 12px;
    }
    :host([size='medium']) .control {
      width: 14px;
      height: 14px;
    }
    :host([size='medium']) .wrapper {
      font-size: 14px;
    }
    :host([size='large']) .control {
      width: 16px;
      height: 16px;
    }
    :host([size='large']) .wrapper {
      font-size: 16px;
    }

    /* Focus */
    input:focus-visible + .control {
      outline: 2px solid var(--th-checkbox-checked-bg, #005cb9);
      outline-offset: 2px;
    }

    /* Checked state */
    :host([checked]) .control {
      background: var(--th-checkbox-checked-bg, #005cb9);
      border-color: var(--th-checkbox-checked-bg, #005cb9);
      color: white;
    }
    :host([checked]) .control trailhand-icon[name='check'] {
      opacity: 1;
    }

    /* Indeterminate state */
    :host([indeterminate]) .control {
      background: var(--th-checkbox-checked-bg, #005cb9);
      border-color: var(--th-checkbox-checked-bg, #005cb9);
      color: white;
    }
    :host([indeterminate]) .control trailhand-icon[name='minus'] {
      opacity: 1;
    }

    /* Disabled */
    :host([disabled]) .control {
      background: var(--th-checkbox-disabled-bg, #e0e0e0);
      border-color: var(--th-checkbox-disabled-border, #c0c0c0);
      color: var(--th-checkbox-disabled-check, #8d8d8d);
    }
    :host([disabled]) .wrapper {
      color: var(--th-checkbox-disabled-check, #8d8d8d);
      cursor: not-allowed;
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

  private emitChangeEvent() {
    // emit native change events for form integration
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    // emit a custom event with the current state of the checkbox
    this.dispatchEvent(
      new CustomEvent('checkbox-change', {
        bubbles: true,
        composed: true,
        detail: {
          checked: this.checked,
          indeterminate: this.indeterminate,
          name: this.name,
          value: this.value,
        },
      }),
    );
  }

  private handleChange(e: Event) {
    if (this.disabled) return;

    const input = e.target as HTMLInputElement;

    this.checked = input.checked;
    this.indeterminate = false;

    this.updateFormValue();

    this.emitChangeEvent();
  }

  private updateFormValue() {
    if (this.checked) {
      this.internals.setFormValue(this.value);
    } else {
      this.internals.setFormValue(null);
    }
  }

  formResetCallback() {
    this.checked = false;
    this.indeterminate = false;
    this.updateFormValue();
  }

  formDisableCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  updated(changedProperties: Map<string, any>) {
    // Update form value whenever checked or value changes
    if (changedProperties.has('checked') || changedProperties.has('value')) {
      this.updateFormValue();
    }

    // Sync indeterminate to native input
    if (changedProperties.has('indeterminate')) {
      const input = this.shadowRoot?.querySelector('input');
      if (input) input.indeterminate = this.indeterminate;
    }
  }

  render(): TemplateResult {
    return html`
      <label class="wrapper">
        <input
          type="checkbox"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          aria-checked=${this.indeterminate
            ? 'mixed'
            : this.checked
              ? 'true'
              : 'false'}
          @change=${this.handleChange}
        />

        <span class="control">
          <trailhand-icon
            name=${this.indeterminate ? 'minus' : 'check'}
          ></trailhand-icon>
        </span>

        <span class="label">
          <slot></slot>
        </span>
      </label>
    `;
  }
}

customElements.define('trailhand-checkbox', Checkbox);
