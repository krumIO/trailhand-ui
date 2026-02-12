import { LitElement, html, css, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

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

  static override styles = css`
    :host {
      display: inline-block;
    }

    .trailhand-button {
      font-family: 'Montserrat', system-ui, sans-serif;
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
      background-color: var(--button-disabled-bg, #e0e0e0);
      color: var(--button-disabled-color, #a8a8a8);
      border: none;
    }

    .trailhand-button--primary {
      color: var(--button-primary-color, #fff);
      background-color: var(--button-primary-bg, #005cb9);
    }

    .trailhand-button--primary:not(:disabled):hover {
      background-color: var(--button-primary-bg-hover, #00478e);
    }

    .trailhand-button--secondary {
      color: var(--button-secondary-color, #005cb9);
      background-color: var(--button-secondary-bg, #ffffff);
      border: 1px solid var(--button-secondary-border, #005cb9);
    }

    .trailhand-button--secondary:not(:disabled):hover {
      background-color: var(--button-secondary-bg-hover, #f5faff);
    }

    .trailhand-button--alternate {
      color: var(--button-alternate-color, #ffffff);
      background-color: var(--button-alternate-bg, #3492f1);
    }

    .trailhand-button--alternate:not(:disabled):hover {
      background-color: var(--button-alternate-bg-hover, #156ec8);
    }

    .trailhand-button--destructive {
      color: var(--button-destructive-color, #fff);
      background-color: var(--button-destructive-bg, #9f3a3a);
    }

    .trailhand-button--destructive:not(:disabled):hover {
      background-color: var(--button-destructive-bg-hover, #731616);
    }

    .trailhand-button--confirmation {
      color: var(--button-confirmation-color, #fff);
      background-color: var(--button-confirmation-bg, #30ac66);
    }

    .trailhand-button--confirmation:not(:disabled):hover {
      background-color: var(--button-confirmation-bg-hover, #0f8240);
    }

    .trailhand-button--small {
      font-size: 11px;
      padding: 12px 8px;
    }

    .trailhand-button--medium {
      font-size: 12px;
      padding: 12px 16px;
    }

    .trailhand-button--large {
      font-size: 14px;
      padding: 16px 32px;
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

  override render(): TemplateResult {
    const styles = {};

    return html`
      <button
        type=${this.type}
        class="trailhand-button trailhand-button--${this
          .variant} trailhand-button--${this.size}"
        style=${styleMap(styles)}
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
