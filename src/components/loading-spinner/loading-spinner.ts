import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * A loading spinner component that indicates ongoing activity.
 *
 * @example
 * ```html
 * <trailhand-loading-spinner label="Loading..." size="large"></trailhand-loading-spinner>
 * ```
 */

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'small' | 'medium' | 'large';
}   

export class LoadingSpinner extends LitElement {
  /**
   * Optional label displayed above the spinner
   */
  @property({ type: String })
  label = '';

  /**
   * Size of the spinner (e.g., 'small', 'medium', 'large')
   */
  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  static override styles = css`
    :host {
      display: block;
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .loading-spinner__container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .loading-spinner__spinner {
      border: 4px solid var(--th-loading-spinner-background-color, #f3f3f3);
      border-top: 4px solid var(--th-loading-spinner-color, #3498db);
      border-radius: 50%;
      width: var(--th-loading-spinner-size-medium, 40px);
      height: var(--th-loading-spinner-size-medium, 40px);
      animation: spin 1s linear infinite;
    }

    .loading-spinner__label {
      margin-top: 8px;
      font-size: var(--th-loading-spinner-label-font-size, 14px);
      color: var(--th-loading-spinner-label-color, #212121);
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    :host([size='small']) .loading-spinner__spinner {
      width: var(--th-loading-spinner-size-small, 20px);
      height: var(--th-loading-spinner-size-small, 20px);
      border-width: 2px;
    }

    :host([size='large']) .loading-spinner__spinner {
      width: var(--th-loading-spinner-size-large, 60px);
      height: var(--th-loading-spinner-size-large, 60px);
      border-width: 6px;
    }
  `;

  override render(): TemplateResult {
    return html`
        <div class="loading-spinner__container">
            <div class="loading-spinner__spinner" part="spinner"></div>
            ${this.label
              ? html`<div class="loading-spinner__label" part="label">${this.label}</div>`
              : nothing}
        </div>
    `;
  }
}

customElements.define('trailhand-loading-spinner', LoadingSpinner);
