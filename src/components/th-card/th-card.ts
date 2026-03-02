import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import '../icon/icon';

export type CardVariant = 'default' | 'info' | 'outlined';

interface CardDismissDetail {
  id: string;
}

/**
 * A flexible card component for displaying content in a contained box.
 *
 * @fires card-dismiss - Fired when the dismiss button is clicked
 * @fires card-click - Fired when card is clicked (if clickable)
 *
 * @slot icon - Slot for an icon in the header
 * @slot title - Slot for the card title
 * @slot subtitle - Slot for a subtitle
 * @slot - Default slot for main body content
 * @slot action - Slot for action buttons
 * @slot footer - Slot for footer content
 */
export class ThCard extends LitElement {
  @property({ type: String }) variant: CardVariant = 'default';
  @property({ type: Boolean }) dismissible = false;
  @property({ type: String, attribute: 'card-id' }) cardId = '';
  @property({ type: String, attribute: 'card-title' }) cardTitle = '';
  @property({ type: String }) subtitle = '';
  @property({ type: String }) description = '';
  @property({ type: String, attribute: 'icon-src' }) iconSrc = '';
  @property({ type: String, attribute: 'icon-name' }) iconName = '';
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean, reflect: true }) clickable = false;
  @property({ type: String }) href = '';
  @property({ type: String }) target = '';

  static override styles = css`
    :host {
      display: block;
    }

    .card {
      display: flex;
      flex-direction: column;
      font-family: var(--font-family, 'Poppins', sans-serif);
      background: var(--th-card-bg);
      border-radius: var(--th-card-radius, 8px);
      border: 1px solid var(--th-card-border, #e5e7eb);
      transition: box-shadow 0.2s ease;
    }

    .card--default,
    .card--outlined {
      padding: var(--th-card-padding, 20px);
    }

    .card--info {
      padding: 16px 20px;
      flex-direction: row;
      align-items: center;
      gap: 12px;
    }

    .card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    /* Clickable */
    :host([clickable]) .card,
    a.card {
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    /* Header */
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

    /* Icon */
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

    .card__icon trailhand-icon {
      font-size: 40px;
      color: var(--th-card-icon-color, var(--th-card-title-color, inherit));
    }

    .card--info .card__icon img {
      width: 48px;
      height: 48px;
    }

    .card--info .card__icon trailhand-icon {
      font-size: 48px;
    }

    /* Title */
    .card__title-group {
      flex: 1;
      min-width: 0;
    }

    .card__title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--th-card-title-color, inherit);
      line-height: 1.3;
    }

    .card--info .card__title {
      font-size: 16px;
    }

    .card__subtitle {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: var(--th-card-subtitle-color, inherit);
      line-height: 1.4;
    }

    /* Body */
    .card__body {
      flex: 1;
      font-size: 14px;
      line-height: 1.6;
      color: var(--th-card-text-color, inherit);
      margin-bottom: 16px;
    }

    .card--info .card__body {
      display: none;
    }

    /* Action & Footer */
    .card__action {
      margin-bottom: 16px;
    }

    .card__action:empty,
    .card__footer:empty {
      display: none;
    }

    .card__footer {
      display: none;
    }

    .card__footer--has-content {
      display: block;
      padding-top: 16px;
      margin-top: auto;
      border-top: 1px solid var(--th-card-border, #e5e7eb);
    }

    /* Dismiss */
    .card__dismiss {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--th-card-dismiss-color, var(--th-card-text-color, inherit));
      opacity: 0.7;
    }

    .card__dismiss:hover {
      opacity: 1;
    }

    .card__dismiss trailhand-icon {
      font-size: 20px;
    }

    /* Loading */
    .card--loading {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card__spinner {
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

  private _hasIcon(): boolean {
    return !!(this.iconName || this.iconSrc || this.querySelector('[slot="icon"]'));
  }

  private _renderIcon(): TemplateResult {
    if (this.iconName) {
      return html`<div class="card__icon"><trailhand-icon name=${this.iconName}></trailhand-icon></div>`;
    }
    if (this.iconSrc) {
      return html`<div class="card__icon"><img src=${this.iconSrc} alt="" /></div>`;
    }
    return html`<div class="card__icon"><slot name="icon"></slot></div>`;
  }

  private _handleDismiss(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent<CardDismissDetail>('card-dismiss', {
        bubbles: true,
        composed: true,
        detail: { id: this.cardId },
      }),
    );
  }

  private _handleCardClick(e: Event) {
    if (!this.clickable && !this.href) return;

    const path = e.composedPath() as HTMLElement[];
    if (path.some((el) => ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) {
      return;
    }

    this.dispatchEvent(new CustomEvent('card-click', { bubbles: true, composed: true }));

    if (this.href) {
      window.open(this.href, this.target || '_self');
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (!this.clickable && !this.href) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleCardClick(e);
    }
  }

  private _onFooterSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const footer = slot.parentElement;
    if (footer) {
      footer.classList.toggle('card__footer--has-content', slot.assignedNodes().length > 0);
    }
  }

  private _renderContent(): TemplateResult {
    const isInfo = this.variant === 'info';

    return html`
      ${isInfo && this._hasIcon() ? this._renderIcon() : nothing}

      <div class="card__header">
        ${!isInfo && this._hasIcon() ? this._renderIcon() : nothing}

        <div class="card__title-group">
          <h3 class="card__title" part="title">
            <slot name="title">${this.cardTitle}</slot>
          </h3>
          ${this.subtitle || this.querySelector('[slot="subtitle"]')
            ? html`<p class="card__subtitle" part="subtitle">
                <slot name="subtitle">${this.subtitle}</slot>
              </p>`
            : nothing}
        </div>

        ${this.dismissible
          ? html`<button class="card__dismiss" @click=${this._handleDismiss} aria-label="Dismiss">
              <trailhand-icon name="close"></trailhand-icon>
            </button>`
          : nothing}
      </div>

      ${!isInfo
        ? html`
            <div class="card__body" part="body">
              <slot name="description">${this.description}</slot>
            </div>
            <div class="card__action" part="action">
              <slot name="action"></slot>
            </div>
            <div class="card__footer" part="footer">
              <slot name="footer" @slotchange=${this._onFooterSlotChange}></slot>
            </div>
          `
        : nothing}
    `;
  }

  override render(): TemplateResult {
    const classes = `card card--${this.variant}${this.loading ? ' card--loading' : ''}`;

    if (this.loading) {
      return html`<div class=${classes}><div class="card__spinner"></div></div>`;
    }

    if (this.href) {
      return html`
        <a
          class=${classes}
          part="card"
          href=${this.href}
          target=${this.target || nothing}
          @click=${this._handleCardClick}
        >
          ${this._renderContent()}
        </a>
      `;
    }

    return html`
      <div
        class=${classes}
        part="card"
        tabindex=${this.clickable ? '0' : nothing}
        role=${this.clickable ? 'button' : nothing}
        @click=${this._handleCardClick}
        @keydown=${this._handleKeyDown}
      >
        ${this._renderContent()}
      </div>
    `;
  }
}

customElements.define('trailhand-card', ThCard);
