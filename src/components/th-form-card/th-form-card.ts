import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import '../icon/icon';
import '../button/button';

export type FormCardButtonVariant = 'primary' | 'secondary' | 'alternate' | 'destructive' | 'confirmation';

interface FormCardDismissDetail {
  id: string;
}

/**
 * A form card component for displaying form content in a contained, configurable layout.
 *
 * @fires form-card-submit - Fired when the primary action button is clicked
 * @fires form-card-cancel - Fired when the cancel button is clicked
 * @fires card-dismiss - Fired when the dismiss button is clicked
 *
 * @slot - Default slot for form content (laid out in a grid based on the `columns` prop)
 * @slot title - Slot for custom title content
 * @slot actions - Slot for custom action buttons (replaces built-in buttons)
 */
export class ThFormCard extends LitElement {
  @property({ type: String, attribute: 'card-title' }) cardTitle = '';
  @property({ type: String }) badge = '';
  @property({ type: Number }) columns = 1;
  @property({ type: Boolean, reflect: true }) shadow = false;
  @property({ type: Boolean }) dismissible = false;
  @property({ type: String, attribute: 'card-id' }) cardId = '';
  @property({ type: Boolean }) loading = false;

  /** Label for the primary action button. If empty, no built-in actions are rendered. */
  @property({ type: String, attribute: 'button-label' }) buttonLabel = '';
  @property({ type: String, attribute: 'button-variant' }) buttonVariant: FormCardButtonVariant = 'primary';
  @property({ type: Boolean, attribute: 'button-disabled' }) buttonDisabled = false;
  @property({ type: String, attribute: 'cancel-label' }) cancelLabel = 'Cancel';

  static override styles = css`
    :host {
      display: block;
    }

    .form-card {
      display: flex;
      flex-direction: column;
      font-family: var(--font-family, 'Poppins', sans-serif);
      background: var(--th-form-card-bg, #ffffff);
      border-radius: var(--th-form-card-radius, 8px);
      border: none;
      padding: var(--th-form-card-padding, 24px);
      transition: box-shadow 0.2s ease;
    }

    :host([shadow]) .form-card {
      box-shadow: var(--th-form-card-shadow, 0 4px 16px rgba(0, 0, 0, 0.1));
    }

    /* Header */
    .form-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .form-card__title-group {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .form-card__title {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: var(--th-form-card-title-color, #111827);
      line-height: 1.3;
    }

    .form-card__badge {
      font-size: 13px;
      font-weight: 500;
      color: var(--th-form-card-badge-color);
      white-space: nowrap;
    }

    /* Dismiss */
    .form-card__dismiss {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--th-form-card-dismiss-color, #6b7280);
      flex-shrink: 0;
      line-height: 1;
    }

    .form-card__dismiss:hover {
      color: var(--th-form-card-title-color, #111827);
    }

    .form-card__dismiss trailhand-icon {
      font-size: 20px;
    }

    /* Content grid */
    .form-card__content {
      display: grid;
      grid-template-columns: repeat(var(--_columns), 1fr);
      gap: var(--th-form-card-gap, 16px);
      flex: 1;
    }

    /* Actions */
    .form-card__actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .form-card__actions:empty {
      display: none;
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

  private _handleDismiss(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent<FormCardDismissDetail>('card-dismiss', {
        bubbles: true,
        composed: true,
        detail: { id: this.cardId },
      }),
    );
  }

  private _handleSubmit() {
    this.dispatchEvent(new CustomEvent('form-card-submit', { bubbles: true, composed: true }));
  }

  private _handleCancel() {
    this.dispatchEvent(new CustomEvent('form-card-cancel', { bubbles: true, composed: true }));
  }

  private _hasActionsSlot(): boolean {
    return !!this.querySelector('[slot="actions"]');
  }

  private _renderHeader(): TemplateResult {
    const hasTitle = this.cardTitle || this.querySelector('[slot="title"]');
    if (!hasTitle && !this.dismissible) return html``;

    return html`
      <div class="form-card__header" part="header">
        <div class="form-card__title-group">
          <h3 class="form-card__title" part="title">
            <slot name="title">${this.cardTitle}</slot>
          </h3>
          ${this.badge ? html`<span class="form-card__badge" part="badge">${this.badge}</span>` : nothing}
        </div>
        ${this.dismissible
          ? html`<button class="form-card__dismiss" @click=${this._handleDismiss} aria-label="Dismiss">
              <trailhand-icon name="xmark"></trailhand-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  private _renderActions(): TemplateResult {
    if (this._hasActionsSlot()) {
      return html`<div class="form-card__actions" part="actions"><slot name="actions"></slot></div>`;
    }
    if (!this.buttonLabel) return html``;

    return html`
      <div class="form-card__actions" part="actions">
        <trailhand-button variant="secondary" @button-click=${this._handleCancel}>
          ${this.cancelLabel}
        </trailhand-button>
        <trailhand-button
          variant=${this.buttonVariant}
          ?disabled=${this.buttonDisabled}
          @button-click=${this._handleSubmit}
        >
          ${this.buttonLabel}
        </trailhand-button>
      </div>
    `;
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
      <div class="form-card" part="card">
        ${this._renderHeader()}
        <div
          class="form-card__content"
          part="content"
          style="--_columns: ${this.columns}"
        >
          <slot></slot>
        </div>
        ${this._renderActions()}
      </div>
    `;
  }
}

customElements.define('trailhand-form-card', ThFormCard);
