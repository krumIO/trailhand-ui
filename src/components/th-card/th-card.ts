import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Card variant types for different visual styles
 */
export type CardVariant = 'default' | 'info' | 'outlined';

/**
 * Interface for the card-dismiss event detail
 */
interface CardDismissDetail {
  id: string;
}

/**
 * A flexible card component for displaying content in a contained box.
 * Supports multiple variants, dismissible mode, and various slots for content.
 *
 * @fires card-dismiss - Fired when the dismiss button is clicked (if dismissible)
 *
 * @slot icon - Slot for an icon in the header
 * @slot title - Slot for the card title
 * @slot subtitle - Slot for a subtitle (info variant)
 * @slot - Default slot for main body content
 * @slot action - Slot for action buttons
 * @slot footer - Slot for footer content (lists, links, etc.)
 */
export class ThCard extends LitElement {
  /**
   * Visual variant/style of the card
   */
  @property({ type: String })
  variant: CardVariant = 'default';

  /**
   * Whether the card can be dismissed/closed
   */
  @property({ type: Boolean })
  dismissible = false;

  /**
   * Unique identifier for the card (used in dismiss events)
   */
  @property({ type: String, attribute: 'card-id' })
  cardId = '';

  /**
   * Card title (alternative to using title slot)
   */
  @property({ type: String })
  cardTitle = '';

  /**
   * Card subtitle (alternative to using subtitle slot)
   */
  @property({ type: String })
  subtitle = '';

  /**
   * Card description/body text (alternative to using default slot)
   */
  @property({ type: String })
  description = '';

  /**
   * Icon class name (e.g., 'icon-namespace') - alternative to icon slot
   */
  @property({ type: String, attribute: 'icon-class' })
  iconClass = '';

  /**
   * Icon URL (for image icons) - alternative to icon slot
   */
  @property({ type: String, attribute: 'icon-src' })
  iconSrc = '';

  /**
   * Whether the card is in a loading state
   */
  @property({ type: Boolean })
  loading = false;

  static override styles = css`
    :host {
      display: block;
    }

    .card {
      display: flex;
      flex-direction: column;
      background: var(--th-card-bg, var(--color-background, #ffffff));
      border-radius: var(--th-card-radius, 8px);
      transition: box-shadow 0.2s ease;
      height: 100%;
    }

    /* Variant styles */
    .card--default {
      border: 1px solid var(--th-card-border, var(--color-border-light, #e5e7eb));
      padding: var(--th-card-padding, 20px);
    }

    .card--outlined {
      border: 1px solid var(--th-card-border, var(--color-border-light, #e5e7eb));
      padding: var(--th-card-padding, 20px);
    }

    .card--info {
      border: 1px solid var(--th-card-border, var(--color-border-light, #e5e7eb));
      padding: var(--th-card-padding, 16px 20px);
      flex-direction: row;
      align-items: center;
      gap: 12px;
    }

    .card:hover {
      box-shadow: var(--th-card-hover-shadow, 0 2px 8px var(--color-shadow, rgba(0, 0, 0, 0.08)));
    }

    /* Header section */
    .card__header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .card--info .card__header {
      margin-bottom: 0;
      flex: 1;
    }

    /* Icon styles */
    .card__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card__icon img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }

    .card__icon i {
      font-size: 24px;
      color: var(--th-card-icon-color, var(--color-primary, #3b82f6));
    }

    .card--info .card__icon img {
      width: 48px;
      height: 48px;
    }

    /* Title styles */
    .card__title-group {
      flex: 1;
      min-width: 0;
    }

    .card__title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--th-card-title-color, var(--color-text-primary, #111827));
      line-height: 1.3;
    }

    .card__title a {
      color: inherit;
      text-decoration: none;
    }

    .card__title a:hover {
      color: var(--th-primary, var(--color-primary, #3b82f6));
    }

    .card--info .card__title {
      font-size: 16px;
      color: var(--th-primary, var(--color-primary, #3b82f6));
    }

    .card__subtitle {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: var(--th-card-subtitle-color, var(--color-text-secondary, #6b7280));
      line-height: 1.4;
    }

    /* Body content */
    .card__body {
      flex: 1;
      font-size: 14px;
      line-height: 1.6;
      color: var(--th-card-text-color, var(--color-text-secondary, #4b5563));
      margin-bottom: 16px;
    }

    .card--info .card__body {
      display: none;
    }

    /* Action section */
    .card__action {
      margin-bottom: 16px;
    }

    .card__action ::slotted(a),
    .card__action ::slotted(button) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    /* Footer section */
    .card__footer {
      border-top: 1px solid var(--th-card-border, var(--color-border-light, #e5e7eb));
      padding-top: 16px;
      margin-top: auto;
    }

    .card__footer ::slotted(h3),
    .card__footer ::slotted(h4) {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--th-card-title-color, var(--color-text-primary, #111827));
    }

    /* Dismiss button */
    .card__dismiss {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--th-card-dismiss-color, var(--color-grey-400, #9ca3af));
      opacity: 0.7;
      transition: opacity 0.15s ease, color 0.15s ease;
      flex-shrink: 0;
    }

    .card__dismiss:hover {
      opacity: 1;
      color: var(--th-card-dismiss-hover-color, var(--color-text-secondary, #6b7280));
    }

    .card__dismiss svg {
      width: 20px;
      height: 20px;
    }

    /* Loading state */
    .card--loading {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card__spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--th-card-border, var(--color-border-light, #e5e7eb));
      border-top-color: var(--th-primary, var(--color-primary, #3b82f6));
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Empty slots handling */
    .card__action:empty,
    .card__footer:empty {
      display: none;
    }
  `;

  /**
   * Handle dismiss button click
   */
  private _handleDismiss(e: Event): void {
    e.stopPropagation();

    const event = new CustomEvent<CardDismissDetail>('card-dismiss', {
      bubbles: true,
      composed: true,
      detail: { id: this.cardId },
    });
    this.dispatchEvent(event);
  }

  /**
   * Render the dismiss button SVG icon
   */
  private _renderDismissIcon(): TemplateResult {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    `;
  }

  /**
   * Render the icon based on iconClass, iconSrc, or slot
   */
  private _renderIcon(): TemplateResult {
    if (this.iconSrc) {
      return html`
        <div class="card__icon" part="icon">
          <img src=${this.iconSrc} alt="" />
        </div>
      `;
    }

    if (this.iconClass) {
      return html`
        <div class="card__icon" part="icon">
          <i class=${this.iconClass}></i>
        </div>
      `;
    }

    return html`
      <div class="card__icon" part="icon">
        <slot name="icon"></slot>
      </div>
    `;
  }

  /**
   * Check if icon slot or props have content
   */
  private _hasIcon(): boolean {
    return !!(this.iconSrc || this.iconClass || this.querySelector('[slot="icon"]'));
  }

  /**
   * Render the component
   */
  override render(): TemplateResult {
    const classes = [
      'card',
      `card--${this.variant}`,
      this.loading ? 'card--loading' : '',
    ].filter(Boolean).join(' ');

    if (this.loading) {
      return html`
        <div class=${classes} part="card">
          <div class="card__spinner"></div>
        </div>
      `;
    }

    // Info variant - horizontal layout
    if (this.variant === 'info') {
      return html`
        <div class=${classes} part="card">
          ${this._hasIcon() ? this._renderIcon() : nothing}
          <div class="card__header">
            <div class="card__title-group">
              <h3 class="card__title" part="title">
                ${this.cardTitle || html`<slot name="title"></slot>`}
              </h3>
              ${this.subtitle
                ? html`<p class="card__subtitle" part="subtitle">${this.subtitle}</p>`
                : html`<slot name="subtitle"></slot>`}
            </div>
          </div>
          ${this.dismissible
            ? html`
                <button
                  class="card__dismiss"
                  part="dismiss"
                  type="button"
                  aria-label="Dismiss card"
                  @click=${this._handleDismiss}
                >
                  ${this._renderDismissIcon()}
                </button>
              `
            : nothing}
        </div>
      `;
    }

    // Default/outlined variant - vertical layout
    return html`
      <div class=${classes} part="card">
        <div class="card__header">
          ${this._hasIcon() ? this._renderIcon() : nothing}
          <div class="card__title-group">
            <h3 class="card__title" part="title">
              ${this.cardTitle || html`<slot name="title"></slot>`}
            </h3>
          </div>
          ${this.dismissible
            ? html`
                <button
                  class="card__dismiss"
                  part="dismiss"
                  type="button"
                  aria-label="Dismiss card"
                  @click=${this._handleDismiss}
                >
                  ${this._renderDismissIcon()}
                </button>
              `
            : nothing}
        </div>

        <div class="card__body" part="body">
          ${this.description || html`<slot></slot>`}
        </div>

        <div class="card__action" part="action">
          <slot name="action"></slot>
        </div>

        <div class="card__footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

// Register the element
customElements.define('trailhand-card', ThCard);
