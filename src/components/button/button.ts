import { LitElement, html, css, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export interface ButtonProps {
  variant:
    | 'primary'
    | 'secondary'
    | 'alternate'
    | 'destructive'
    | 'confirmation';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  type: 'button' | 'submit' | 'reset';
  name: string;
}

export class Button extends LitElement {
  static formAssociated = true;

  @property({ type: String })
  variant:
    | 'primary'
    | 'secondary'
    | 'alternate'
    | 'destructive'
    | 'confirmation' = 'primary';

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: String })
  name = '';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  static override styles = css`
    :host {
      display: inline-block;
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .trailhand-button {
      font-weight: 600;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      line-height: 1;
      width: 100%;
    }

    .trailhand-button:disabled {
      cursor: not-allowed;
      background-color: var(--th-button-disabled-bg, #e0e0e0);
      color: var(--th-button-disabled-color, #a8a8a8);
      border: none;
    }

    .trailhand-button--primary {
      color: var(--th-button-primary-color, #fff);
      background-color: var(--th-button-primary-bg, #005cb9);
    }

    .trailhand-button--primary:not(:disabled):hover {
      background-color: var(--th-button-primary-bg-hover, #00478e);
    }

    .trailhand-button--secondary {
      color: var(--th-button-secondary-color, #005cb9);
      background-color: var(--th-button-secondary-bg, #ffffff);
      border: 1px solid var(--th-button-secondary-border, #005cb9);
    }

    .trailhand-button--secondary:not(:disabled):hover {
      background-color: var(--th-button-secondary-bg-hover, #f5faff);
    }

    .trailhand-button--alternate {
      color: var(--th-button-alternate-color, #ffffff);
      background-color: var(--th-button-alternate-bg, #3492f1);
    }

    .trailhand-button--alternate:not(:disabled):hover {
      background-color: var(--th-button-alternate-bg-hover, #156ec8);
    }

    .trailhand-button--destructive {
      color: var(--th-button-destructive-color, #fff);
      background-color: var(--th-button-destructive-bg, #9f3a3a);
    }

    .trailhand-button--destructive:not(:disabled):hover {
      background-color: var(--th-button-destructive-bg-hover, #731616);
    }

    .trailhand-button--confirmation {
      color: var(--th-button-confirmation-color, #fff);
      background-color: var(--th-button-confirmation-bg, #30ac66);
    }

    .trailhand-button--confirmation:not(:disabled):hover {
      background-color: var(--th-button-confirmation-bg-hover, #0f8240);
    }

    .trailhand-button--small {
      font-size: 11px;
      padding: 12px 8px;
      height: 32px;
    }

    .trailhand-button--medium {
      font-size: 12px;
      padding: 12px 16px;
      height: 40px;
    }

    .trailhand-button--large {
      font-size: 14px;
      padding: 16px 32px;
      height: 48px;
    }

    .icon {
      display: inline-flex;
      align-items: center;
    }

    .icon.left {
      margin-right: 0.25rem;
    }

    .icon.right {
      margin-left: 0.25rem;
    }

    .label {
      display: inline-flex;
      align-items: center;
    }
  `;

  updated() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }
  }

  private handleClick(e: Event): void {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Handle form submission for type="submit"
    if (this.type === 'submit') {
      const form = this.internals.form;
      if (form) {
        // Request form submission
        form.requestSubmit();
      }
    } else if (this.type === 'reset') {
      const form = this.internals.form;
      if (form) {
        form.reset();
      }
    }

    this.dispatchEvent(
      new CustomEvent('button-click', {
        bubbles: true,
        composed: true,
        detail: {
          name: this.name,
          originalEvent: e,
        },
      }),
    );
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  override render(): TemplateResult {
    return html`
      <button
        type=${this.type}
        class="trailhand-button trailhand-button--${this
          .variant} trailhand-button--${this.size}"
        ?disabled=${this.disabled}
        @click=${this.handleClick}
      >
        <span class="icon left">
          <slot name="icon-left"></slot>
        </span>

        <span class="label">
          <slot></slot>
        </span>

        <span class="icon right">
          <slot name="icon-right"></slot>
        </span>
      </button>
    `;
  }
}

customElements.define('trailhand-button', Button);
