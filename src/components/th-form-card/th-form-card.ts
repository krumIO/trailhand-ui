import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import '../button/button';
import './th-form-row';

export type FormCardButtonVariant = 'primary' | 'secondary' | 'alternate' | 'destructive' | 'confirmation';

/**
 * A form layout card for use inside a modal (or standalone).
 *
 * Compose with `trailhand-form-row` for multi-section forms with optional
 * section titles and per-row column counts. For simple flat forms, slot fields
 * directly and use the `columns` prop.
 *
 * @fires form-card-submit - Fired when the primary action button is clicked
 * @fires form-card-cancel - Fired when the cancel button is clicked
 *
 * @slot - `trailhand-form-row` elements or direct form fields
 */
export class ThFormCard extends LitElement {
  /** Number of equal-width columns for the form content grid */
  @property({ type: Number }) columns = 1;

  /** Show a box shadow (useful when used outside a modal) */
  @property({ type: Boolean, reflect: true }) shadow = false;

  /** Show a loading spinner and hide content */
  @property({ type: Boolean }) loading = false;

  /** Primary action button label. If empty, no button row is rendered. */
  @property({ type: String, attribute: 'button-label' }) buttonLabel = '';

  /** Variant for the primary action button */
  @property({ type: String, attribute: 'button-variant' }) buttonVariant: FormCardButtonVariant = 'primary';

  /** Disables the primary action button */
  @property({ type: Boolean, attribute: 'button-disabled' }) buttonDisabled = false;

  /** Cancel button label. If empty, no cancel button is rendered. */
  @property({ type: String, attribute: 'cancel-label' }) cancelLabel = '';

  static override styles = css`
    :host {
      display: block;
    }

    .form-card {
      display: flex;
      flex-direction: column;
      font-family: var(--font-family, 'Poppins', sans-serif);
      background: var(--th-form-card-bg, transparent);
      border-radius: var(--th-form-card-radius, 8px);
      border: none;
      margin: 0;
      padding: 0;
    }

    :host([shadow]) .form-card {
      background: var(--th-form-card-shadow-bg, #ffffff);
      padding: var(--th-form-card-padding, 24px);
      box-shadow: var(--th-form-card-shadow, 0 4px 16px rgba(0, 0, 0, 0.1));
    }

    /* Default: stack rows vertically when using trailhand-form-row children */
    .form-card__content {
      display: flex;
      flex-direction: column;
      gap: var(--th-form-card-gap, 24px);
    }

    /* Flat mode: direct fields without rows — driven by the columns prop */
    .form-card__content--grid {
      display: grid;
      grid-template-columns: repeat(var(--_columns), 1fr);
      gap: var(--th-form-card-gap, 16px);
    }

    .form-card__actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    /* Loading */
    .form-card--loading {
      min-height: 160px;
      align-items: center;
      justify-content: center;
    }

    .form-card__spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  private _handleSubmit() {
    this.dispatchEvent(new CustomEvent('form-card-submit', { bubbles: true, composed: true }));
  }

  private _handleCancel() {
    this.dispatchEvent(new CustomEvent('form-card-cancel', { bubbles: true, composed: true }));
  }

  override render(): TemplateResult {
    if (this.loading) {
      return html`
        <div class="form-card form-card--loading" part="card">
          <div class="form-card__spinner"></div>
        </div>
      `;
    }

    return html`
      <form class="form-card" part="card" @submit=${(e: Event) => e.preventDefault()}>
        <div
          class=${`form-card__content${this.columns > 1 ? ' form-card__content--grid' : ''}`}
          part="content"
          style=${this.columns > 1 ? `--_columns: ${this.columns}` : ''}
        >
          <slot></slot>
        </div>
        ${this.buttonLabel || this.cancelLabel
          ? html`
              <div class="form-card__actions" part="actions">
                ${this.cancelLabel
                  ? html`<trailhand-button variant="secondary" @button-click=${this._handleCancel}>${this.cancelLabel}</trailhand-button>`
                  : nothing}
                ${this.buttonLabel
                  ? html`<trailhand-button variant=${this.buttonVariant} ?disabled=${this.buttonDisabled} @button-click=${this._handleSubmit}>${this.buttonLabel}</trailhand-button>`
                  : nothing}
              </div>
            `
          : nothing}
      </form>
    `;
  }
}

customElements.define('trailhand-form-card', ThFormCard);
