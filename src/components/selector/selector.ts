import { LitElement, html, css, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../icon/icon';

export interface SelectorProps {
  text: string;
  subtext: string;
  description: string;
  disabled: boolean;
  checked: boolean;
  name: string;
  value: string;
}

export class Selector extends LitElement {
  static formAssociated = true;

  @property({ type: String })
  text = '';

  @property({ type: String })
  subtext = '';

  @property({ type: String })
  description = '';

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  name = '';

  @property({ type: String, reflect: true })
  value = '';

  // ElementInternals for form integration
  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .wrapper {
      cursor: pointer;
    }

    /* Hide native Selector */
    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    /* Custom box */
    .control {
      border-radius: 8px;
      padding: 16px;
      border: 1px solid var(--th-selector-border, #d7d7d7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      transition: all 0.15s ease;
      background-color: transparent;
      gap: 8px;
    }

    .text {
      font-size: 14px;
      color: var(--th-selector-text-color, #000000);
      font-weight: 500;
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin: 0;
    }

    .subtext {
      font-size: 11px;
      font-weight: 600;
      color: var(--th-selector-subtext-color, #666666);
    }

    .description {
      font-size: 12px;
      color: var(--th-selector-description-color, #666666);
      font-weight: 500;
      margin: 0;
    }

    .icon {
      color: var(--th-selector-icon-color, #333333);
    }

    /* Focus */
    input:focus-visible + .control {
      outline: 2px solid var(--th-selector-checked-bg, #005cb9);
      outline-offset: 2px;
    }

    /* Checked state */
    :host([checked]) .control {
      background-color: color-mix(
        in srgb,
        var(--th-selector-checked-bg, #005cb9) 10%,
        transparent
      );
      border-color: var(--th-selector-checked-bg, #005cb9);
    }

    /* Disabled */
    :host([disabled]) .control {
      color: var(--th-selector-disabled-color);
      opacity: 0.6;
      background-color: color-mix(
        in srgb,
        var(--th-selector-disabled-bg, #d7d7d7) 10%,
        transparent
      );
    }
    :host([disabled]) .text,
    :host([disabled]) .subtext,
    :host([disabled]) .description,
    :host([disabled]) .icon {
      color: var(--th-selector-disabled-color);
    }
    :host([disabled]) .wrapper {
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
    // emit native change event for form integration
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    // emit a custom event with the current state of the selector
    this.dispatchEvent(
      new CustomEvent('selector-change', {
        bubbles: true,
        composed: true,
        detail: {
          checked: this.checked,
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

    // Uncheck all other selectors with the same name in the same root
    if (this.checked) {
      const root = this.getRootNode() as Document | ShadowRoot;
      root
        .querySelectorAll<Selector>(`trailhand-selector[name="${this.name}"]`)
        .forEach((el) => {
          if (el !== this) el.checked = false;
        });
    }

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
  }

  render(): TemplateResult {
    return html`
      <label class="wrapper">
        <input
          type="radio"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          aria-checked=${this.checked ? 'true' : 'false'}
          @change=${this.handleChange}
        />

        <div class="control">
          <span class="icon"><slot name="icon"></slot></span>
          <p class="text">
            ${this.text}<span class="subtext">${this.subtext}</span>
          </p>
          <p class="description">${this.description}</p>
        </div>
      </label>
    `;
  }
}

customElements.define('trailhand-selector', Selector);
