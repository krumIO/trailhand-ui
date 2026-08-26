import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../icon/icon';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  open: boolean;
  stayOpen: boolean;
  placement: PopoverPlacement;
  title: string;
  subtitle: string;
  escapeBoundary: boolean;
}

/**
 * A popover component that appears on click of a trigger element.
 * Pass any content via the default slot and a custom trigger via the `trigger` slot.
 * Use the `heading` slot to override the title/subtitle with custom markup.
 */
export class Popover extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * When true, clicking outside the popover will not close it.
   */
  @property({ type: Boolean, attribute: 'stay-open' })
  stayOpen = false;

  /**
   * Controls which side of the trigger the popover appears on.
   */
  @property({ type: String, reflect: true })
  placement: PopoverPlacement = 'bottom';

  @property({ type: String })
  title = '';

  @property({ type: String })
  subtitle = '';

  // When true, the popover is positioned via `position: fixed` computed from the trigger, 
  // so it escapes a clipping ancestor (overflow: hidden/auto) instead of being cut off by it.
  @property({ type: Boolean, attribute: 'escape-boundary' })
  escapeBoundary = false;

  @state() private _hasHeadingSlot = false;

  private _boundHandleClickOutside: (e: Event) => void;

  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .trigger-wrapper {
      display: inline-block;
      cursor: pointer;
    }

    .popover-content {
      position: absolute;
      z-index: 1000;
      min-width: 200px;
      background-color: var(--th-color-background, #ffffff);
      border: 1px solid var(--th-color-border, #d7d7d7);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.2s ease-in-out,
        transform 0.2s ease-in-out,
        visibility 0.2s ease-in-out;
    }

    .popover-content--open {
      opacity: 1;
      visibility: visible;
    }

    .popover-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--th-color-border, #d7d7d7);
    }

    .heading-content {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .popover-title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--th-color-text-primary, #212121);
    }

    .popover-subtitle {
      margin: 0;
      font-size: 12px;
      font-weight: 400;
      color: var(--th-color-text-secondary, #666666);
    }

    .popover-body {
      padding: 16px;
    }

    /* Placement: bottom (default) */
    :host([placement='bottom']) .popover-content,
    :host(:not([placement])) .popover-content {
      top: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(-6px);
    }

    :host([placement='bottom']) .popover-content--open,
    :host(:not([placement])) .popover-content--open {
      transform: translateX(-50%) translateY(0);
    }

    /* Placement: top */
    :host([placement='top']) .popover-content {
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(6px);
    }

    :host([placement='top']) .popover-content--open {
      transform: translateX(-50%) translateY(0);
    }

    /* Placement: right */
    :host([placement='right']) .popover-content {
      left: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%) translateX(-6px);
    }

    :host([placement='right']) .popover-content--open {
      transform: translateY(-50%) translateX(0);
    }

    /* Placement: left */
    :host([placement='left']) .popover-content {
      right: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%) translateX(6px);
    }

    :host([placement='left']) .popover-content--open {
      transform: translateY(-50%) translateX(0);
    }

    /* Dark mode */
    :host-context([data-theme='dark']) .popover-content {
      background-color: var(--th-color-background, #2a2a2a);
      border-color: var(--th-color-border, #444444);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }
  `;

  constructor() {
    super();
    this._boundHandleClickOutside = this._handleClickOutside.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this._boundHandleClickOutside);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._boundHandleClickOutside);
  }

  private _handleClickOutside(e: Event): void {
    if (this.stayOpen) return;
    const target = e.target as Node;
    if (this.open && !this.contains(target)) {
      this._close();
    }
  }

  private _handleTriggerClick(e: Event): void {
    e.stopPropagation();
    if (this.open) {
      this._close();
    } else {
      this._open();
    }
  }

  private _open(): void {
    this.open = true;
    this.dispatchEvent(
      new CustomEvent('popover-open', { bubbles: true, composed: true }),
    );
  }

  private _computeFixedPosition(): Record<string, string> {
    const gap = 8;
    const rect = this.getBoundingClientRect();
    let style: Record<string, string>;

    switch (this.placement) {
      case 'top':
        style = {
          position:  'fixed',
          left:      `${rect.left + rect.width / 2}px`,
          bottom:    `${window.innerHeight - rect.top + gap}px`,
          transform: 'translateX(-50%)',
        };
        break;
      case 'left':
        style = {
          position:  'fixed',
          top:       `${rect.top + rect.height / 2}px`,
          right:     `${window.innerWidth - rect.left + gap}px`,
          transform: 'translateY(-50%)',
        };
        break;
      case 'right':
        style = {
          position:  'fixed',
          top:       `${rect.top + rect.height / 2}px`,
          left:      `${rect.right + gap}px`,
          transform: 'translateY(-50%)',
        };
        break;
      default:
        style = {
          position:  'fixed',
          left:      `${rect.left + rect.width / 2}px`,
          top:       `${rect.bottom + gap}px`,
          transform: 'translateX(-50%)',
        };
    }

    return style;
  }

  private _close(): void {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('popover-close', { bubbles: true, composed: true }),
    );
  }

  private _handleHeadingSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    this._hasHeadingSlot = slot.assignedNodes({ flatten: true }).length > 0;
  }

  private _renderHeader(): TemplateResult | typeof nothing {
    const hasTitle = this.title || this._hasHeadingSlot;
    if (!hasTitle) return nothing;

    return html`
      <div class="popover-header" part="header">
        <slot name="heading" @slotchange=${this._handleHeadingSlotChange}>
          <div class="heading-content">
            <p class="popover-title">${this.title}</p>
            ${this.subtitle
              ? html`<p class="popover-subtitle">${this.subtitle}</p>`
              : nothing}
          </div>
        </slot>
      </div>
    `;
  }

  override render(): TemplateResult {
    // Computed fresh on every render rather than cached in state: caching it
    // meant a stale value could briefly apply whenever open/escapeBoundary/
    // placement changed together, since state set during `updated()` only
    // takes effect on the render after next.
    const fixedStyle =
      this.open && this.escapeBoundary
        ? styleMap(this._computeFixedPosition())
        : nothing;

    return html`
      <div
        class="trigger-wrapper"
        @click=${this._handleTriggerClick}
        aria-haspopup="true"
        aria-expanded=${this.open}
      >
        <slot name="trigger"></slot>
      </div>

      <div
        class="popover-content ${this.open ? 'popover-content--open' : ''}"
        style=${fixedStyle}
        role="dialog"
        aria-hidden=${!this.open}
      >
        ${this._renderHeader()}
        <div class="popover-body" part="body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('trailhand-popover', Popover);
