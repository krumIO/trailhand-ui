import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Tag variant types for different visual styles
 */
export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

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
   * Optional icon to display before the label (iconify icon name)
   */
  @property({ type: String })
  icon = '';

  /**
   * Value passed in the dismiss event (useful for identifying which tag was dismissed)
   */
  @property({ type: String })
  value = '';

  static override styles = css`
    :host {
      display: inline-flex;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 9999px;
      font-weight: 500;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    /* Size variants */
    .tag--sm {
      padding: 2px 8px;
      font-size: 12px;
      line-height: 16px;
    }

    .tag--md {
      padding: 4px 12px;
      font-size: 14px;
      line-height: 20px;
    }

    .tag--lg {
      padding: 6px 16px;
      font-size: 16px;
      line-height: 24px;
    }

    /* Color variants - soft pastel backgrounds with colored text */
    .tag--default {
      background-color: var(--th-tag-default-bg, #f3f4f6);
      color: var(--th-tag-default-text, #4b5563);
    }

    .tag--primary {
      background-color: var(--th-tag-primary-bg, #dbeafe);
      color: var(--th-tag-primary-text, #1d4ed8);
    }

    .tag--success {
      background-color: var(--th-tag-success-bg, #dcfce7);
      color: var(--th-tag-success-text, #15803d);
    }

    .tag--warning {
      background-color: var(--th-tag-warning-bg, #fef3c7);
      color: var(--th-tag-warning-text, #b45309);
    }

    .tag--error {
      background-color: var(--th-tag-error-bg, #fee2e2);
      color: var(--th-tag-error-text, #dc2626);
    }

    .tag--info {
      background-color: var(--th-tag-info-bg, #e0f2fe);
      color: var(--th-tag-info-text, #0284c7);
    }

    /* Outlined variants */
    .tag--outlined {
      background-color: transparent;
      border: 1px solid currentColor;
    }

    .tag--outlined.tag--default {
      background-color: transparent;
      color: var(--th-tag-default-text, #4b5563);
      border-color: var(--th-tag-default-border, #d1d5db);
    }

    .tag--outlined.tag--primary {
      background-color: transparent;
      color: var(--th-tag-primary-text, #1d4ed8);
    }

    .tag--outlined.tag--success {
      background-color: transparent;
      color: var(--th-tag-success-text, #15803d);
    }

    .tag--outlined.tag--warning {
      background-color: transparent;
      color: var(--th-tag-warning-text, #b45309);
    }

    .tag--outlined.tag--error {
      background-color: transparent;
      color: var(--th-tag-error-text, #dc2626);
    }

    .tag--outlined.tag--info {
      background-color: transparent;
      color: var(--th-tag-info-text, #0284c7);
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

    .tag__dismiss svg {
      width: 1em;
      height: 1em;
    }

    /* Size-specific dismiss button adjustments */
    .tag--sm .tag__dismiss svg {
      width: 12px;
      height: 12px;
    }

    .tag--md .tag__dismiss svg {
      width: 14px;
      height: 14px;
    }

    .tag--lg .tag__dismiss svg {
      width: 16px;
      height: 16px;
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
              <iconify-icon icon=${this.icon}></iconify-icon>
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
customElements.define('th-tag', ThTag);
