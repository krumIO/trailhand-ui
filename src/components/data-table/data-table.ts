import { LitElement, html, css, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../action-menu/action-menu';
import 'iconify-icon';
import { addIcon } from 'iconify-icon';
import chevronUp from '@iconify/icons-heroicons/chevron-up-20-solid';
import chevronDown from '@iconify/icons-heroicons/chevron-down-20-solid';
import chevronLeft from '@iconify/icons-heroicons/chevron-left-20-solid';
import chevronRight from '@iconify/icons-heroicons/chevron-right-20-solid';

// Pre-load icons to avoid CDN delay
addIcon('heroicons:chevron-up-20-solid', chevronUp);
addIcon('heroicons:chevron-down-20-solid', chevronDown);
addIcon('heroicons:chevron-left-20-solid', chevronLeft);
addIcon('heroicons:chevron-right-20-solid', chevronRight);

/**
 * Type definition for formatter functions
 */
type FormatterFunction = (value: any) => string;

/**
 * Type definition for sort functions
 */
type SortFunction = (
  a: RowData,
  b: RowData,
  direction: 'asc' | 'desc',
) => number;

/**
 * Type definition for link functions
 */
type LinkFunction = (row: RowData) => string;

/**
 * Type definition for row data
 */
interface RowData {
  [key: string]: any;
}

/**
 * Type definition for column configuration
 */
export interface DataTableColumn {
  field: string;
  label: string;
  width?: string;
  sortable?: boolean;
  searchable?: boolean;
  formatter?: string | ((value: any, row: RowData) => any);
  sortFn?: SortFunction;
  link?: string | LinkFunction;
  linkTarget?: '_self' | '_blank' | '_parent' | '_top';
}

/**
 * Data table formatters for common column types
 */
export const dataTableFormatters: Record<string, FormatterFunction> = {
  /**
   * Format a date value as relative time (e.g., "5d", "3h", "15m")
   */
  age: (value: any): string => {
    if (!value) return '-';
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMins > 0) return `${diffMins}m`;
    return 'Just now';
  },

  /**
   * Format a date as a localized date string
   */
  date: (value: any): string => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
  },

  /**
   * Format a date as a localized date and time string
   */
  dateTime: (value: any): string => {
    if (!value) return '-';
    return new Date(value).toLocaleString();
  },

  /**
   * Format memory bytes to human readable format (B, KB, MB, GB, TB)
   */
  memory: (value: any): string => {
    if (!value || value === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let val = Number(value);
    let unitIndex = 0;

    while (val >= 1024 && unitIndex < units.length - 1) {
      val = val / 1024;
      unitIndex++;
    }

    return `${Math.round(val)} ${units[unitIndex]}`;
  },

  /**
   * Format millicpus value
   */
  milliCPUs: (value: any): string => {
    if (!value || value === 0) return '0';

    const formatted = Math.round(Number(value)).toString();
    return formatted === '0' ? '0' : formatted;
  },
};

/**
 * A feature-rich data table component with sorting, filtering, and pagination.
 * Supports custom cell rendering, row actions, and various formatters.
 */
export class DataTable extends LitElement {
  @property({ type: Array })
  columns: DataTableColumn[] = [];

  @property({ type: Array })
  rows: RowData[] = [];

  @property({ type: Number, attribute: 'rows-per-page' })
  rowsPerPage = 10;

  @property({ type: Boolean })
  searchable = true;

  @property({ type: Boolean })
  sortable = true;

  @property({ type: Boolean })
  paginated = true;

  @property({ type: Boolean })
  loading = false;

  @property({ type: String, attribute: 'key-field' })
  keyField = 'id';

  @property({ type: Boolean, attribute: 'row-actions' })
  rowActions = true;

  @property({ type: Number, attribute: 'row-actions-width' })
  rowActionsWidth = 40;

  @property({ type: String, attribute: 'empty-message' })
  emptyMessage = 'No data available';

  @property({ type: String, attribute: 'no-results-message' })
  noResultsMessage = 'No results found';

  // Internal state
  @state()
  private _searchQuery = '';

  @state()
  private _currentPage = 1;

  @state()
  private _sortColumn: string | null = null;

  @state()
  private _sortDirection: 'asc' | 'desc' = 'asc';

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .data-table {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .data-table__search {
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem 0;
    }

    .data-table__search-input {
      width: 100%;
      max-width: 300px;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border, var(--color-border, #D7D7D7));
      border-radius: 4px;
      background-color: var(--input-bg, var(--color-white, #FFFFFF));
      color: var(--input-text, var(--color-text-primary, #212121));
      font-size: 14px;
    }

    .data-table__search-input:focus {
      outline: none;
      border-color: var(--primary, var(--color-primary, #3d98d3));
    }

    .data-table__search-input::placeholder {
      color: var(--input-placeholder, var(--color-text-muted, #8D8D8D));
    }

    .data-table__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;
      color: var(--body-text, var(--color-text-primary, #212121));
    }

    .data-table__spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border, var(--color-border, #D7D7D7));
      border-top-color: var(--primary, var(--color-primary, #3d98d3));
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .data-table__wrapper {
      border: 1px solid var(--border, var(--color-border, #D7D7D7));
      border-radius: 4px;
    }

    .data-table__table {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--body-bg, var(--color-white, #FFFFFF));
    }

    .data-table__thead {
      background-color: var(--sortable-table-header-bg, var(--color-grey-100, #FAFAFA));
      border-bottom: 1px solid var(--border, var(--color-border, #D7D7D7));
    }

    .data-table__th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--body-text, var(--color-text-primary, #212121));
      white-space: nowrap;
      border-bottom: 1px solid var(--border, var(--color-border, #D7D7D7));
    }

    .data-table__th--sortable {
      cursor: pointer;
      user-select: none;
    }

    .data-table__th--sortable:hover {
      background-color: var(--sortable-table-header-hover-bg, var(--color-grey-200, #EBEBEB));
    }

    .data-table__th--sorted {
      background-color: var(--sortable-table-header-sorted-bg, var(--color-grey-200, #EBEBEB));
    }

    .data-table__th--actions {
      width: 40px;
      padding: 0.75rem 0.5rem;
    }

    .data-table__th-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .data-table__sort-icon {
      display: inline-flex;
      align-items: center;
      color: var(--muted, var(--color-text-muted, #8D8D8D));
      width: 16px;
      height: 16px;
      font-size: 16px;
    }

    .data-table__tbody {
      background-color: var(--body-bg, var(--color-white, #FFFFFF));
    }

    .data-table__tr {
      border-bottom: 1px solid var(--border, var(--color-border, #D7D7D7));
    }

    .data-table__tr:hover {
      background-color: var(--sortable-table-row-hover-bg, var(--color-grey-100, #FAFAFA));
    }

    .data-table__tr:last-child {
      border-bottom: none;
    }

    .data-table__td {
      padding: 0.75rem 1rem;
      color: var(--body-text, var(--color-text-primary, #212121));
    }

    .data-table__td a {
      color: var(--link, var(--color-primary, #3d98d3));
      text-decoration: none;
    }

    .data-table__td a:hover {
      text-decoration: underline;
    }

    .data-table__td--empty {
      text-align: center;
      padding: 2rem;
      color: var(--muted, var(--color-text-muted, #8D8D8D));
    }

    .data-table__td--actions {
      width: 40px;
      padding: 0.5rem;
      text-align: center;
      vertical-align: middle;
    }

    .data-table__pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .data-table__pagination-info {
      color: var(--muted, var(--color-text-muted, #8D8D8D));
      font-size: 13px;
    }

    .data-table__pagination-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .data-table__pagination-current {
      color: var(--body-text, var(--color-text-primary, #212121));
      font-size: 13px;
      min-width: 60px;
      text-align: center;
    }

    .data-table__pagination-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 1px solid var(--border, var(--color-border, #D7D7D7));
      border-radius: 4px;
      background-color: var(--body-bg, var(--color-white, #FFFFFF));
      color: var(--body-text, var(--color-text-primary, #212121));
      cursor: pointer;
      transition: all 0.2s;
    }

    .data-table__pagination-btn:hover:not(:disabled) {
      background-color: var(--sortable-table-row-hover-bg, var(--color-grey-100, #FAFAFA));
      border-color: var(--link, var(--color-primary, #3d98d3));
    }

    .data-table__pagination-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .data-table__pagination-icon {
      width: 16px;
      height: 16px;
    }
  `;

  /**
   * Get nested value from object using dot notation
   * @param obj - The object to extract value from
   * @param path - The path (e.g., 'user.name')
   * @returns The value at the path
   * @private
   */
  private _getNestedValue(obj: RowData, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Format a cell value using column formatter
   * @param row - The row data
   * @param column - The column definition
   * @returns The formatted value
   * @private
   */
  private _formatValue(row: RowData, column: DataTableColumn): any {
    const value = this._getNestedValue(row, column.field);

    if (column.formatter) {
      // If formatter is a string, use dataTableFormatters
      if (typeof column.formatter === 'string') {
        const formatter = dataTableFormatters[column.formatter];
        if (formatter) {
          return formatter(value);
        }
      } else if (typeof column.formatter === 'function') {
        // Otherwise, use custom formatter function
        return column.formatter(value, row);
      }
    }

    return value;
  }

  /**
   * Get link URL for a cell if column has link property
   * @param row - The row data
   * @param column - The column definition
   * @returns The link URL or null
   * @private
   */
  private _getLinkUrl(row: RowData, column: DataTableColumn): string | null {
    if (!column.link) {
      return null;
    }

    if (typeof column.link === 'string') {
      // Link is a field name in the row data
      return this._getNestedValue(row, column.link);
    } else if (typeof column.link === 'function') {
      // Link is a function that takes the row and returns a URL
      return column.link(row);
    }

    return null;
  }

  /**
   * Render cell content with optional link
   * @param row - The row data
   * @param column - The column definition
   * @returns The rendered cell content
   * @private
   */
  private _renderCellContent(
    row: RowData,
    column: DataTableColumn,
  ): TemplateResult | any {
    const value = this._formatValue(row, column);
    const linkUrl = this._getLinkUrl(row, column);

    if (linkUrl) {
      const target = column.linkTarget || '_self';

      // For external links or _blank target, use regular <a> tag
      if (
        target === '_blank' ||
        linkUrl.startsWith('http://') ||
        linkUrl.startsWith('https://')
      ) {
        const rel = target === '_blank' ? 'noopener noreferrer' : '';
        return html`<a href="${linkUrl}" target="${target}" rel="${rel}"
          >${value}</a
        >`;
      }

      // For internal links, use a clickable element that emits a navigation event
      return html`<a
        href="${linkUrl}"
        @click="${(e: Event) => this._handleLinkClick(e, linkUrl, row)}"
        >${value}</a
      >`;
    }

    return value;
  }

  /**
   * Handle link click - emit navigation event instead of following link
   * @param event - The click event
   * @param url - The URL to navigate to
   * @param row - The row data
   * @private
   */
  private _handleLinkClick(event: Event, url: string, row: RowData): void {
    event.preventDefault();

    // Emit custom event for navigation
    this.dispatchEvent(
      new CustomEvent('navigate', {
        detail: { url, row },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Get filtered rows based on search query
   * @returns Filtered rows
   * @private
   */
  private get _filteredRows(): RowData[] {
    if (!this._searchQuery || !this.searchable) {
      return this.rows;
    }

    const query = this._searchQuery.toLowerCase();
    return this.rows.filter((row) => {
      return this.columns.some((column) => {
        if (column.searchable === false) {
          return false;
        }
        const value = this._getNestedValue(row, column.field);
        return String(value).toLowerCase().includes(query);
      });
    });
  }

  /**
   * Get sorted rows
   * @returns Sorted rows
   * @private
   */
  private get _sortedRows(): RowData[] {
    if (!this._sortColumn || !this.sortable) {
      return this._filteredRows;
    }

    const column = this.columns.find((col) => col.field === this._sortColumn);
    if (!column || column.sortable === false) {
      return this._filteredRows;
    }

    return [...this._filteredRows].sort((a, b) => {
      const aValue = this._getNestedValue(a, this._sortColumn!);
      const bValue = this._getNestedValue(b, this._sortColumn!);

      // Handle custom sort function
      if (column.sortFn) {
        return column.sortFn(a, b, this._sortDirection);
      }

      // Default sorting logic
      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return this._sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Get paginated rows
   * @returns Paginated rows
   * @private
   */
  private get _paginatedRows(): RowData[] {
    if (!this.paginated) {
      return this._sortedRows;
    }

    const start = (this._currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this._sortedRows.slice(start, end);
  }

  /**
   * Get total number of pages
   * @returns Total pages
   * @private
   */
  private get _totalPages(): number {
    if (!this.paginated) {
      return 1;
    }
    return Math.ceil(this._sortedRows.length / this.rowsPerPage);
  }

  /**
   * Get pagination info
   * @returns Pagination info
   * @private
   */
  private get _paginationInfo(): { start: number; end: number; total: number } {
    const start = (this._currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(
      this._currentPage * this.rowsPerPage,
      this._sortedRows.length,
    );
    return {
      start,
      end,
      total: this._sortedRows.length,
    };
  }

  /**
   * Handle search input
   * @param e - The input event
   * @private
   */
  private _handleSearch(e: Event): void {
    const target = e.target as HTMLInputElement;
    this._searchQuery = target.value;
    this._currentPage = 1;
  }

  /**
   * Handle column sort
   * @param columnField - The column field to sort by
   * @private
   */
  private _handleSort(columnField: string): void {
    const column = this.columns.find((col) => col.field === columnField);
    if (!column || column.sortable === false || !this.sortable) {
      return;
    }

    if (this._sortColumn === columnField) {
      // Toggle direction
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this._sortColumn = columnField;
      this._sortDirection = 'asc';
    }
    this._currentPage = 1;
  }

  /**
   * Navigate to a specific page
   * @param page - The page number
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this._totalPages) {
      this._currentPage = page;
    }
  }

  /**
   * Navigate to the next page
   */
  nextPage(): void {
    this.goToPage(this._currentPage + 1);
  }

  /**
   * Navigate to the previous page
   */
  prevPage(): void {
    this.goToPage(this._currentPage - 1);
  }

  /**
   * Reset search query
   */
  resetSearch(): void {
    this._searchQuery = '';
  }

  /**
   * Reset sort to default state
   */
  resetSort(): void {
    this._sortColumn = null;
    this._sortDirection = 'asc';
  }

  /**
   * Render sort icon
   * @param column - The column definition
   * @returns TemplateResult
   * @private
   */
  private _renderSortIcon(column: DataTableColumn): TemplateResult | string {
    if (!this.sortable || column.sortable === false) {
      return '';
    }

    const isSorted = this._sortColumn === column.field;

    if (isSorted) {
      if (this._sortDirection === 'asc') {
        return html`
          <iconify-icon
            class="data-table__sort-icon"
            icon="heroicons:chevron-up-20-solid"
          ></iconify-icon>
        `;
      } else {
        return html`
          <iconify-icon
            class="data-table__sort-icon"
            icon="heroicons:chevron-down-20-solid"
          ></iconify-icon>
        `;
      }
    }

    return html`
      <iconify-icon
        class="data-table__sort-icon"
        icon="heroicons:chevron-up-20-solid"
        style="opacity: 0.3"
      ></iconify-icon>
    `;
  }

  /**
   * Render chevron left icon
   * @returns TemplateResult
   * @private
   */
  private _renderChevronLeft(): TemplateResult {
    return html`
      <iconify-icon
        class="data-table__pagination-icon"
        icon="heroicons:chevron-left-20-solid"
      ></iconify-icon>
    `;
  }

  /**
   * Render chevron right icon
   * @returns TemplateResult
   * @private
   */
  private _renderChevronRight(): TemplateResult {
    return html`
      <iconify-icon
        class="data-table__pagination-icon"
        icon="heroicons:chevron-right-20-solid"
      ></iconify-icon>
    `;
  }

  /**
   * Render the component
   * @returns TemplateResult
   */
  override render(): TemplateResult {
    return html`
      <div class="data-table">
        <!-- Search bar -->
        ${this.searchable
          ? html`
              <div class="data-table__search">
                <input
                  type="text"
                  class="data-table__search-input"
                  placeholder="Search..."
                  .value=${this._searchQuery}
                  @input=${this._handleSearch}
                />
              </div>
            `
          : ''}

        <!-- Loading state -->
        ${this.loading
          ? html`
              <div class="data-table__loading">
                <div class="data-table__spinner"></div>
                <span>Loading...</span>
              </div>
            `
          : html`
              <!-- Table -->
              <div class="data-table__wrapper">
                <table class="data-table__table">
                  <thead class="data-table__thead">
                    <tr>
                      ${this.columns.map(
                        (column) => html`
                          <th
                            class="data-table__th ${this.sortable &&
                            column.sortable !== false
                              ? 'data-table__th--sortable'
                              : ''} ${this._sortColumn === column.field
                              ? 'data-table__th--sorted'
                              : ''}"
                            style=${column.width
                              ? `width: ${column.width}`
                              : ''}
                            @click=${() => this._handleSort(column.field)}
                          >
                            <div class="data-table__th-content">
                              <span>${column.label}</span>
                              ${this._renderSortIcon(column)}
                            </div>
                          </th>
                        `,
                      )}
                      ${this.rowActions
                        ? html`
                            <th
                              class="data-table__th data-table__th--actions"
                              style="width: ${this.rowActionsWidth}px"
                            ></th>
                          `
                        : ''}
                    </tr>
                  </thead>
                  <tbody class="data-table__tbody">
                    ${this._paginatedRows.length === 0
                      ? html`
                          <tr class="data-table__tr">
                            <td
                              class="data-table__td data-table__td--empty"
                              colspan=${this.rowActions
                                ? this.columns.length + 1
                                : this.columns.length}
                            >
                              <slot name="empty">
                                ${this._searchQuery
                                  ? this.noResultsMessage
                                  : this.emptyMessage}
                              </slot>
                            </td>
                          </tr>
                        `
                      : this._paginatedRows.map(
                          (row) => html`
                            <tr class="data-table__tr">
                              ${this.columns.map(
                                (column) => html`
                                  <td class="data-table__td">
                                    <slot
                                      name="cell:${column.field}"
                                      .row=${row}
                                      .value=${this._getNestedValue(
                                        row,
                                        column.field,
                                      )}
                                      .column=${column}
                                    >
                                      ${this._renderCellContent(row, column)}
                                    </slot>
                                  </td>
                                `,
                              )}
                              ${this.rowActions
                                ? html`
                                    <td
                                      class="data-table__td data-table__td--actions"
                                    >
                                      <slot name="actions" .row=${row}>
                                        <action-menu
                                          .resource=${row}
                                        ></action-menu>
                                      </slot>
                                    </td>
                                  `
                                : ''}
                            </tr>
                          `,
                        )}
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              ${this.paginated && !this.loading && this._totalPages > 1
                ? html`
                    <div class="data-table__pagination">
                      <div class="data-table__pagination-info">
                        ${this._paginationInfo.start}-${this._paginationInfo
                          .end}
                        of ${this._paginationInfo.total}
                      </div>
                      <div class="data-table__pagination-controls">
                        <button
                          class="data-table__pagination-btn"
                          ?disabled=${this._currentPage === 1}
                          @click=${this.prevPage}
                          aria-label="Previous page"
                        >
                          ${this._renderChevronLeft()}
                        </button>

                        <span class="data-table__pagination-current">
                          ${this._currentPage} / ${this._totalPages}
                        </span>

                        <button
                          class="data-table__pagination-btn"
                          ?disabled=${this._currentPage === this._totalPages}
                          @click=${this.nextPage}
                          aria-label="Next page"
                        >
                          ${this._renderChevronRight()}
                        </button>
                      </div>
                    </div>
                  `
                : ''}
            `}
      </div>
    `;
  }
}

// Register the element
customElements.define('data-table', DataTable);
