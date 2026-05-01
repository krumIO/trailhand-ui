import { LitElement, html, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import '../icon/icon';

export interface ModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  dismissible: boolean;
  position: 'center' | 'top';
}

export class Modal extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  title = '';

  @property({ type: String })
  subtitle = '';

  @property({ type: Boolean })
  dismissible = true;

  @property({ type: Boolean })
  inline = false;

  @property({ type: String, reflect: true })
  position: 'center' | 'top' = 'center';

  @query('dialog') private dialog!: HTMLDialogElement;

  @state() private hasFooter = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    dialog {
      position: fixed;
      margin: 0;
      inset: auto;
      left: 50%;
      transform: translateX(-50%);
      border: none;
      border-radius: 12px;
      padding: 0;
      min-width: 360px;
      max-width: 90vw;
      max-height: 90vh;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      background: var(--th-color-background, #ffffff);
    }

    :host(:not([position='top'])) dialog {
      top: 50%;
      transform: translate(-50%, -50%);
    }

    :host([position='top']) dialog {
      top: var(--th-modal-top, 80px);
      transform: translateX(-50%);
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--th-color-text-primary, #000000);
      padding: 24px 32px;
      border-bottom: 1px solid var(--th-color-border, #d7d7d7);
      gap: 16px;
    }

    .heading-content {
      display: flex;
      gap: 12px;
      align-items: baseline;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 500;
      color: var(--th-color-text-primary, #000000);
      margin: 0;
    }

    .modal-subtitle {
      font-size: 14px;
      font-weight: 500;
      color: var(--th-color-primary, #666666);
      margin: 0;
    }

    .modal-body {
      color: var(--th-color-text-secondary, #666666);
      padding: 32px;
    }

    .modal-footer {
      padding: 24px 32px;
      display: flex;
      justify-content: flex-end;
      color: var(--th-color-text-secondary, #666666);
    }

    .modal-footer--empty {
      display: none;
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      padding: 0;
      color: var(--th-color-text-secondary, #666666);
      height: 24px;
      width: 24px;
    }

    .close-button:focus-visible {
      outline: 2px solid var(--th-color-primary, #666666);
      border-radius: 4px;
    }
  `;

  private openerElement: HTMLElement | null = null;

  updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this.openerElement = document.activeElement as HTMLElement;
        this.dialog.showModal();
        this.dispatchEvent(
          new CustomEvent('modal-open', { bubbles: true, composed: true }),
        );
      } else {
        this.dialog.close();
        this.dispatchEvent(
          new CustomEvent('modal-close', { bubbles: true, composed: true }),
        );
        this.openerElement?.focus(); // restore focus to whatever opened it
      }
    }
  }

  private handleFooterSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
  }

  private handleClose() {
    this.open = false;
  }

  private handleBackdropClick(e: MouseEvent) {
    if (!this.dismissible) return;
    const rect = this.dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedOutside) this.handleClose();
  }

  render() {
    return html`
      <dialog
        @click=${this.handleBackdropClick}
        @cancel=${this.handleClose}
        aria-labelledby="modal-title"
        aria-modal="true"
        part="dialog"
      >
        <div class="modal-header" part="header">
          <slot name="heading">
            <div class="heading-content">
              <h2 class="modal-title" id="modal-title">${this.title}</h2>
              ${this.subtitle
                ? html`<p class="modal-subtitle">${this.subtitle}</p>`
                : ''}
            </div>
          </slot>
          ${this.dismissible
            ? html`<button
                class="close-button"
                @click=${this.handleClose}
                aria-label="Close"
              >
                <trailhand-icon name="x"></trailhand-icon>
              </button>`
            : ''}
        </div>
        <div class="modal-body" part="body">
          <slot></slot>
        </div>
        <div
          class="modal-footer ${this.hasFooter ? '' : 'modal-footer--empty'}"
          part="footer"
        >
          <slot name="footer" @slotchange=${this.handleFooterSlotChange}></slot>
        </div>
      </dialog>
    `;
  }
}

customElements.define('trailhand-modal', Modal);
