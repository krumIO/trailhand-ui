import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import '../icon/icon';
import type { IconProps } from '../icon/icon';

/**
 * Tag variant types for different visual styles
 */
export type TagVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Tag size options
 */
export type TagSize = 'sm' | 'md' | 'lg';

/**
 * Interface for the tag-dismiss event detail
 */
interface TagDismissDetail {
  value: string;
}

/**
 * A tag/badge component for displaying labels, statuses, or categories.
 * Can be used for status indicators, category labels, or dismissible chips.
 *
 * @fires tag-dismiss - Fired when the dismiss button is clicked (if dismissible)
 *
 * @slot - Default slot for tag content (alternative to label prop)
 */
export class ThTag extends LitElement {
  /**
   * The text label to display in the tag
   */
  @property({ type: String })
  label = '';

  /**
   * Visual variant/color scheme
   */
  @property({ type: String })
  variant: TagVariant = 'default';

  /**
   * Size of the tag
   */
  @property({ type: String })
  size: TagSize = 'md';

  /**
   * Whether the tag can be dismissed/closed
   */
  @property({ type: Boolean })
  dismissible = false;

  /**
   * Whether the tag is disabled
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Whether to use outlined style (border instead of filled background)
   */
  @property({ type: Boolean })
  outlined = false;

  /**
   * Optional icon to display before the label (trailhand-icon name)
   */
  @property({ type: String })
  icon: IconProps['name'] | '' = '';

  /**
   * Value passed in the dismiss event (useful for identifying which tag was dismissed)
   */
  @property({ type: String })
  value = '';

  static override styles = css`
    :host {
      display: inline-flex;
      align-self: center;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .tag {
      padding: 6px 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 9999px;
      font-feature-settings: 'liga' off, 'clig' off;
      font-family: var(--font-family, 'Poppins', sans-serif);
      font-size: 10px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    /* Size variants */
    .tag--sm {
      padding: 3px 9px;
      font-size: 11px;
      line-height: 16px;
    }

    .tag--md {
      padding: 4px 12px;
      font-size: 13px;
      line-height: 18px;
    }

    .tag--lg {
      padding: 6px 16px;
      font-size: 15px;
      line-height: 20px;
    }

    /* Color variants - soft pastel backgrounds with colored text */
    .tag--default {
      background-color: var(--th-color-background-hover, var(--th-color-grey-200, #EBEBEB));
      color: var(--th-color-text-secondary, var(--th-color-grey-600, #636363));
    }

    .tag--info {
      background-color: var(--th-color-info-fill, var(--th-color-light-blue, #e6f3ff));
      color: var(--th-color-info-outline, var(--th-color-blue, #0085ff));
    }

    .tag--success {
      background-color: var(--th-color-success-fill, var(--th-color-light-green, #d2fdd2));
      color: var(--th-color-success-outline, var(--th-color-green, #097409));
    }

    .tag--warning {
      background-color: var(--th-color-warning-fill, var(--th-color-light-yellow, #fffeb4));
      color: var(--th-color-warning-outline, var(--th-color-dark-yellow, #a89939));
    }

    .tag--error {
      background-color: var(--th-color-error-fill, var(--th-color-light-red, #fee2e2));
      color: var(--th-color-error-outline, var(--th-color-red, #9F3A3A));
    }

    /* Outlined variants */
    .tag--outlined {
      background-color: transparent;
      border: 1px solid currentColor;
    }

    .tag--outlined.tag--default {
      background-color: transparent;
      color: var(--th-color-text-secondary, var(--th-color-grey-600, #4b5563));
    }

    .tag--outlined.tag--info {
      background-color: transparent;
      color: var(--th-color-info-outline, var(--th-color-blue, #0085ff));
    }

    .tag--outlined.tag--success {
      background-color: transparent;
      color: var(--th-color-success-outline, var(--th-color-green, #097409));
    }

    .tag--outlined.tag--warning {
      background-color: transparent;
      color: var(--th-color-warning-outline, var(--th-color-dark-yellow, #a89939));
    }

    .tag--outlined.tag--error {
      background-color: transparent;
      color: var(--th-color-error-outline, var(--th-color-red, #9F3A3A));
    }

    /* Icon styling */
    .tag__icon {
      display: flex;
      align-items: center;
      font-size: 1em;
    }

    /* Dismiss button */
    .tag__dismiss {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0;
      margin-left: 2px;
      cursor: pointer;
      color: inherit;
      opacity: 0.7;
      transition: opacity 0.15s ease;
      line-height: 1;
    }

    .tag__dismiss:hover {
      opacity: 1;
    }

    .tag__dismiss:focus {
      outline: none;
      opacity: 1;
    }

    .tag__dismiss trailhand-icon {
      font-size: 1em;
    }

    /* Size-specific dismiss button adjustments */
    .tag--sm .tag__dismiss trailhand-icon {
      font-size: 12px;
    }

    .tag--md .tag__dismiss trailhand-icon {
      font-size: 14px;
    }

    .tag--lg .tag__dismiss trailhand-icon {
      font-size: 16px;
    }
  `;

  /**
   * Handle dismiss button click
   */
  private _handleDismiss(e: Event): void {
    e.stopPropagation();

    const event = new CustomEvent<TagDismissDetail>('tag-dismiss', {
      bubbles: true,
      composed: true,
      detail: { value: this.value || this.label },
    });
    this.dispatchEvent(event);
  }

  /**
   * Render the dismiss button icon
   */
  private _renderDismissIcon(): TemplateResult {
    return html`<trailhand-icon name="close"></trailhand-icon>`;
  }

  /**
   * Render the component
   */
  override render(): TemplateResult {
    const classes = [
      'tag',
      `tag--${this.variant}`,
      `tag--${this.size}`,
      this.outlined ? 'tag--outlined' : '',
    ].filter(Boolean).join(' ');

    return html`
      <span class=${classes} part="tag">
        ${this.icon
          ? html`<span class="tag__icon" part="icon">
              <trailhand-icon name=${this.icon}></trailhand-icon>
            </span>`
          : nothing}
        <span class="tag__label" part="label">
          ${this.label || html`<slot></slot>`}
        </span>
        ${this.dismissible
          ? html`
              <button
                class="tag__dismiss"
                part="dismiss"
                type="button"
                aria-label="Remove tag"
                @click=${this._handleDismiss}
              >
                ${this._renderDismissIcon()}
              </button>
            `
          : nothing}
      </span>
    `;
  }
}

// Register the element
customElements.define('trailhand-tag', ThTag);
