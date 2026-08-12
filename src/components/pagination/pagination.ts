import { LitElement, html, css, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import 'iconify-icon';
import { addIcon } from 'iconify-icon';
import chevronLeft from '@iconify/icons-heroicons/chevron-left-20-solid';
import chevronRight from '@iconify/icons-heroicons/chevron-right-20-solid';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  showInfo: boolean;
  disabled: boolean;
}

// Pre-load icons to avoid CDN delay
addIcon('heroicons:chevron-left-20-solid', chevronLeft);
addIcon('heroicons:chevron-right-20-solid', chevronRight);

/**
 * A reusable pagination control: previous/next buttons, a "current / total"
 * page indicator, and an optional "start-end of total" info string.
 *
 * This component does not track page state itself.
 * The consumer passes `current-page` / `total-pages` (and, if `show-info`
 * is enabled, the item-range props) and listens for the `page-change`
 * event to apply the new page.
 *
 * @fires page-change - Detail: `{ page: number }`. Fired when the user
 *   clicks the previous or next button with a valid target page. The
 *   consumer owns page state and is responsible for applying it (and, for
 *   server-side pagination, fetching the corresponding data).
 *
 * @example
 * ```html
 * <trailhand-pagination
 *   current-page="2"
 *   total-pages="8"
 *   start-item="11"
 *   end-item="20"
 *   total-items="76"
 *   @page-change=${(e) => this.goToPage(e.detail.page)}
 * ></trailhand-pagination>
 * ```
 */
export class Pagination extends LitElement {
  /** The current page number (1-indexed). */
  @property({ type: Number, attribute: 'current-page' })
  currentPage = 1;

  /** Total number of pages. */
  @property({ type: Number, attribute: 'total-pages' })
  totalPages = 1;

  /** First item index (1-indexed) shown on the current page. Used in the info text. */
  @property({ type: Number, attribute: 'start-item' })
  startItem = 0;

  /** Last item index (1-indexed) shown on the current page. Used in the info text. */
  @property({ type: Number, attribute: 'end-item' })
  endItem = 0;

  /** Total number of items across all pages. Used in the info text. */
  @property({ type: Number, attribute: 'total-items' })
  totalItems = 0;

  /** Whether to show the "start-end of total" info text. */
  @property({ type: Boolean, attribute: 'show-info' })
  showInfo = true;

  /** Disables both buttons, e.g. while a page fetch is in flight. */
  @property({ type: Boolean })
  disabled = false;

  static override styles = css`
    :host {
      display: block;
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .pagination__info {
      color: var(--muted, var(--th-color-text-muted, #8D8D8D));
      font-size: 13px;
    }

    .pagination__controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .pagination__current {
      color: var(--body-text, var(--th-color-text-primary, #212121));
      font-size: 13px;
      min-width: 60px;
      text-align: center;
    }

    .pagination__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 1px solid var(--border, var(--th-color-border, #D7D7D7));
      border-radius: 4px;
      background-color: var(--body-bg, var(--th-color-white, #FFFFFF));
      color: var(--body-text, var(--th-color-text-primary, #212121));
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination__btn:hover:not(:disabled) {
      background-color: var(--sortable-table-row-hover-bg, var(--th-color-grey-100, #FAFAFA));
      border-color: var(--link, var(--th-color-primary, #3d98d3));
    }

    .pagination__btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .pagination__icon {
      width: 16px;
      height: 16px;
    }
  `;

  /**
   * Emit a `page-change` event for the given target page.
   * @param page - The page number to request.
   * @private
   */
  private _emitPageChange(page: number): void {
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { page },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handlePrev(): void {
    if (this.currentPage > 1 && !this.disabled) {
      this._emitPageChange(this.currentPage - 1);
    }
  }

  private _handleNext(): void {
    if (this.currentPage < this.totalPages && !this.disabled) {
      this._emitPageChange(this.currentPage + 1);
    }
  }

  private _renderChevronLeft(): TemplateResult {
    return html`
      <iconify-icon
        class="pagination__icon"
        icon="heroicons:chevron-left-20-solid"
      ></iconify-icon>
    `;
  }

  private _renderChevronRight(): TemplateResult {
    return html`
      <iconify-icon
        class="pagination__icon"
        icon="heroicons:chevron-right-20-solid"
      ></iconify-icon>
    `;
  }

  override render(): TemplateResult {
    return html`
      <div class="pagination">
        ${this.showInfo
          ? html`
              <div class="pagination__info">
                ${this.startItem}-${this.endItem} of ${this.totalItems}
              </div>
            `
          : ''}
        <div class="pagination__controls">
          <button
            class="pagination__btn"
            ?disabled=${this.currentPage === 1 || this.disabled}
            @click=${this._handlePrev}
            aria-label="Previous page"
          >
            ${this._renderChevronLeft()}
          </button>

          <span class="pagination__current">
            ${this.currentPage} / ${this.totalPages}
          </span>

          <button
            class="pagination__btn"
            ?disabled=${this.currentPage === this.totalPages || this.disabled}
            @click=${this._handleNext}
            aria-label="Next page"
          >
            ${this._renderChevronRight()}
          </button>
        </div>
      </div>
    `;
  }
}

// Register the element
customElements.define('trailhand-pagination', Pagination);