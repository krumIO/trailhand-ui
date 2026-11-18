import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../icon';

export type BannerVariant =
  | 'primary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info';

export interface BannerProps {
  variant: BannerVariant;
  title: string;
  description: string;
  dismissable: boolean;
}

/**
 * A banner for surfacing inline messages. Set the tone with `variant`,
 * and add a close button with `dismissable`.
 *
 * @fires banner-dismiss - Fired after the user dismisses the banner.
 */
export class Banner extends LitElement {
  @property({ type: String, reflect: true })
  variant: BannerVariant = 'primary';

  @property({ type: String })
  title = '';

  @property({ type: String })
  description = '';

  /**
   * When true, a close button is shown. Dismissing hides the banner
   * and fires `banner-dismiss`.
   */
  @property({ type: Boolean })
  dismissable = false;

  @state() private _leaving = false;
  @state() private _dismissed = false;

  static override styles = css`
    :host {
      display: block;
      font-family: var(--font-family, 'Poppins', sans-serif);

      --bg: var(--th-color-primary-fill);
      --border: var(--th-color-primary-outline);
      --accent: var(--th-color-primary-outline);
      --text: var(--th-color-primary-outline);
      --text-muted: var(--th-color-primary-outline);
    }

    :host([variant='primary']) {
      --bg: var(--th-color-primary-fill);
      --border: var(--th-color-primary-outline);
      --accent: var(--th-color-primary-outline);
      --text: var(--th-color-primary-outline, );
      --text-muted: var(--th-color-primary-outline);
    }

    :host([variant='error']) {
      --bg: var(--th-color-error-fill);
      --border: var(--th-color-error-outline);
      --accent: var(--th-color-error-outline);
      --text: var(--th-color-error-outline);
      --text-muted: var(--th-color-error-outline);
    }

    :host([variant='success']) {
      --bg: var(--th-color-success-fill);
      --border: var(--th-color-success-outline);
      --accent: var(--th-color-success-outline);
      --text: var(--th-color-success-outline);
      --text-muted: var(--th-color-success-outline);
    }

    :host([variant='warning']) {
      --bg: var(--th-color-warning-fill);
      --border: var(--th-color-warning-outline);
      --accent: var(--th-color-warning-outline);
      --text: var(--th-color-warning-outline);
      --text-muted: var(--th-color-warning-outline);
    }

    :host([variant='info']) {
      --bg: var(--th-color-info-fill);
      --border: var(--th-color-info-outline);
      --accent: var(--th-color-info-outline);
      --text: var(--th-color-info-outline);
      --text-muted: var(--th-color-info-outline);
    }

    .banner {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--border);
      border-left: 4px solid var(--accent);
      border-radius: 6px;
      font-size: 0.9375rem;
      line-height: 1.5;
      transition:
        opacity 0.15s ease,
        transform 0.15s ease;
    }

    .banner--leaving {
      opacity: 0;
      transform: translateY(-4px);
    }

    .banner-body {
      flex: 1;
      min-width: 0;
    }

    .banner-title {
      margin: 0;
      font-weight: 600;
    }

    .banner-description {
      margin: 0;
      color: var(--text-muted);
    }

    .banner-title + .banner-description {
      margin-top: 0.125rem;
    }

    .banner-close {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      margin: -0.25rem -0.375rem -0.25rem 0;
      padding: 0;
      color: var(--text-muted);
      background: transparent;
      border: 0;
      border-radius: 4px;
      cursor: pointer;
    }

    .banner-close:hover {
      background: color-mix(in srgb, var(--accent) 15%, transparent);
    }

    .banner-close:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 1px;
    }

    @media (prefers-reduced-motion: reduce) {
      .banner {
        transition: none;
      }
    }
  `;

  private _handleDismiss(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      this._finishDismiss();
    } else {
      this._leaving = true;
    }
  }

  private _handleTransitionEnd(e: TransitionEvent): void {
    if (this._leaving && e.propertyName === 'opacity') {
      this._finishDismiss();
    }
  }

  private _finishDismiss(): void {
    this._dismissed = true;
    this.dispatchEvent(
      new CustomEvent('banner-dismiss', { bubbles: true, composed: true }),
    );
  }

  private _renderClose(): TemplateResult | typeof nothing {
    if (!this.dismissable) return nothing;

    return html`
      <button
        type="button"
        class="banner-close"
        part="close"
        aria-label="Dismiss"
        @click=${this._handleDismiss}
      >
        <trailhand-icon name='x'></trailhand-icon>
      </button>
    `;
  }

  override render(): TemplateResult | typeof nothing {
    if (this._dismissed) return nothing;

    // Errors and warnings interrupt screen readers; everything else is polite.
    const role =
      this.variant === 'error' || this.variant === 'warning' ? 'alert' : 'status';

    return html`
      <div
        class="banner ${this._leaving ? 'banner--leaving' : ''}"
        part="banner"
        role=${role}
        @transitionend=${this._handleTransitionEnd}
      >
        <div class="banner-body">
          ${this.title
            ? html`<p class="banner-title" part="title">${this.title}</p>`
            : nothing}
          ${this.description
            ? html`<p class="banner-description" part="description">${this.description}</p>`
            : nothing}
        </div>
        ${this._renderClose()}
      </div>
    `;
  }
}

customElements.define('trailhand-banner', Banner);