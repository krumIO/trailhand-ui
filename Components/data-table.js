import { LitElement, html, css } from 'lit';
import './action-menu.js';
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
 * Data table formatters for common column types
 */
export const dataTableFormatters = {
  /**
   * Format a date value as relative time (e.g., "5d", "3h", "15m")
   */
  age: (value) => {
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
  date: (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
  },

  /**
   * Format a date as a localized date and time string
   */
  dateTime: (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString();
  }
};

/**
 * A feature-rich data table component with sorting, filtering, and pagination.
 * Supports custom cell rendering, row actions, and various formatters.
 */
export class DataTable extends LitElement {
  static properties = {
    columns: { type: Array },
    rows: { type: Array },
    rowsPerPage: { type: Number, attribute: 'rows-per-page' },
    searchable: { type: Boolean },
    sortable: { type: Boolean },
    paginated: { type: Boolean },
    loading: { type: Boolean },
    keyField: { type: String, attribute: 'key-field' },
    rowActions: { type: Boolean, attribute: 'row-actions' },
    rowActionsWidth: { type: Number, attribute: 'row-actions-width' },
    emptyMessage: { type: String, attribute: 'empty-message' },
    noResultsMessage: { type: String, attribute: 'no-results-message' },

    // Internal state
    _searchQuery: { type: String, state: true },
    _currentPage: { type: Number, state: true },
    _sortColumn: { type: String, state: true },
    _sortDirection: { type: String, state: true },
  };

  static styles = css`
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
      border: 1px solid var(--border, #ddd);
      border-radius: 4px;
      background-color: var(--input-bg, #fff);
      color: var(--input-text, #333);
      font-size: 14px;
    }

    .data-table__search-input:focus {
      outline: none;
      border-color: var(--primary, #007bff);
    }

    .data-table__search-input::placeholder {
      color: var(--input-placeholder, #999);
    }

    .data-table__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;
      color: var(--body-text, #333);
    }

    .data-table__spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border, #ddd);
      border-top-color: var(--primary, #007bff);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .data-table__wrapper {
      border: 1px solid var(--border, #ddd);
      border-radius: 4px;
    }

    .data-table__table {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--body-bg, #fff);
    }

    .data-table__thead {
      background-color: var(--sortable-table-header-bg, #f8f9fa);
      border-bottom: 1px solid var(--border, #ddd);
    }

    .data-table__th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--body-text, #333);
      white-space: nowrap;
      border-bottom: 1px solid var(--border, #ddd);
    }

    .data-table__th--sortable {
      cursor: pointer;
      user-select: none;
    }

    .data-table__th--sortable:hover {
      background-color: var(--sortable-table-header-hover-bg, #e9ecef);
    }

    .data-table__th--sorted {
      background-color: var(--sortable-table-header-sorted-bg, #e2e6ea);
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
      color: var(--muted, #6c757d);
      width: 16px;
      height: 16px;
      font-size: 16px;
    }

    .data-table__tbody {
      background-color: var(--body-bg, #fff);
    }

    .data-table__tr {
      border-bottom: 1px solid var(--border, #ddd);
    }

    .data-table__tr:hover {
      background-color: var(--sortable-table-row-hover-bg, #f8f9fa);
    }

    .data-table__tr:last-child {
      border-bottom: none;
    }

    .data-table__td {
      padding: 0.75rem 1rem;
      color: var(--body-text, #333);
    }

    .data-table__td a {
      color: var(--link, #007bff);
      text-decoration: none;
    }

    .data-table__td a:hover {
      text-decoration: underline;
    }

    .data-table__td--empty {
      text-align: center;
      padding: 2rem;
      color: var(--muted, #6c757d);
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
      color: var(--muted, #6c757d);
      font-size: 13px;
    }

    .data-table__pagination-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .data-table__pagination-current {
      color: var(--body-text, #333);
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
      border: 1px solid var(--border, #ddd);
      border-radius: 4px;
      background-color: var(--body-bg, #fff);
      color: var(--body-text, #333);
      cursor: pointer;
      transition: all 0.2s;
    }

    .data-table__pagination-btn:hover:not(:disabled) {
      background-color: var(--sortable-table-row-hover-bg, #f8f9fa);
      border-color: var(--link, #007bff);
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

  constructor() {
    super();
    this.columns = [];
    this.rows = [];
    this.rowsPerPage = 10;
    this.searchable = true;
    this.sortable = true;
    this.paginated = true;
    this.loading = false;
    this.keyField = 'id';
    this.rowActions = true;
    this.rowActionsWidth = 40;
    this.emptyMessage = 'No data available';
    this.noResultsMessage = 'No results found';

    // Internal state
    this._searchQuery = '';
    this._currentPage = 1;
    this._sortColumn = null;
    this._sortDirection = 'asc';
  }

  /**
   * Get nested value from object using dot notation
   * @param {Object} obj - The object to extract value from
   * @param {string} path - The path (e.g., 'user.name')
   * @returns {*} The value at the path
   * @private
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Format a cell value using column formatter
   * @param {Object} row - The row data
   * @param {Object} column - The column definition
   * @returns {*} The formatted value
   * @private
   */
  _formatValue(row, column) {
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
   * @param {Object} row - The row data
   * @param {Object} column - The column definition
   * @returns {string|null} The link URL or null
   * @private
   */
  _getLinkUrl(row, column) {
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
   * @param {Object} row - The row data
   * @param {Object} column - The column definition
   * @returns {TemplateResult} The rendered cell content
   * @private
   */
  _renderCellContent(row, column) {
    const value = this._formatValue(row, column);
    const linkUrl = this._getLinkUrl(row, column);

    if (linkUrl) {
      const target = column.linkTarget || '_self';
      const rel = target === '_blank' ? 'noopener noreferrer' : '';
      return html`<a href="${linkUrl}" target="${target}" rel="${rel}">${value}</a>`;
    }

    return value;
  }

  /**
   * Get filtered rows based on search query
   * @returns {Array} Filtered rows
   * @private
   */
  get _filteredRows() {
    if (!this._searchQuery || !this.searchable) {
      return this.rows;
    }

    const query = this._searchQuery.toLowerCase();
    return this.rows.filter(row => {
      return this.columns.some(column => {
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
   * @returns {Array} Sorted rows
   * @private
   */
  get _sortedRows() {
    if (!this._sortColumn || !this.sortable) {
      return this._filteredRows;
    }

    const column = this.columns.find(col => col.field === this._sortColumn);
    if (!column || column.sortable === false) {
      return this._filteredRows;
    }

    return [...this._filteredRows].sort((a, b) => {
      const aValue = this._getNestedValue(a, this._sortColumn);
      const bValue = this._getNestedValue(b, this._sortColumn);

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
   * @returns {Array} Paginated rows
   * @private
   */
  get _paginatedRows() {
    if (!this.paginated) {
      return this._sortedRows;
    }

    const start = (this._currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this._sortedRows.slice(start, end);
  }

  /**
   * Get total number of pages
   * @returns {number} Total pages
   * @private
   */
  get _totalPages() {
    if (!this.paginated) {
      return 1;
    }
    return Math.ceil(this._sortedRows.length / this.rowsPerPage);
  }

  /**
   * Get pagination info
   * @returns {Object} Pagination info
   * @private
   */
  get _paginationInfo() {
    const start = (this._currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this._currentPage * this.rowsPerPage, this._sortedRows.length);
    return {
      start,
      end,
      total: this._sortedRows.length
    };
  }

  /**
   * Handle search input
   * @param {Event} e - The input event
   * @private
   */
  _handleSearch(e) {
    this._searchQuery = e.target.value;
    this._currentPage = 1;
  }

  /**
   * Handle column sort
   * @param {string} columnField - The column field to sort by
   * @private
   */
  _handleSort(columnField) {
    const column = this.columns.find(col => col.field === columnField);
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
   * @param {number} page - The page number
   */
  goToPage(page) {
    if (page >= 1 && page <= this._totalPages) {
      this._currentPage = page;
    }
  }

  /**
   * Navigate to the next page
   */
  nextPage() {
    this.goToPage(this._currentPage + 1);
  }

  /**
   * Navigate to the previous page
   */
  prevPage() {
    this.goToPage(this._currentPage - 1);
  }

  /**
   * Reset search query
   */
  resetSearch() {
    this._searchQuery = '';
  }

  /**
   * Reset sort to default state
   */
  resetSort() {
    this._sortColumn = null;
    this._sortDirection = 'asc';
  }

  /**
   * Get row key
   * @param {Object} row - The row data
   * @param {number} index - The row index
   * @returns {string} Row key
   * @private
   */
  _getRowKey(row, index) {
    return row[this.keyField] || `row-${index}`;
  }

  /**
   * Render sort icon
   * @param {Object} column - The column definition
   * @returns {TemplateResult}
   * @private
   */
  _renderSortIcon(column) {
    if (!this.sortable || column.sortable === false) {
      return '';
    }

    const isSorted = this._sortColumn === column.field;

    if (isSorted) {
      if (this._sortDirection === 'asc') {
        return html`
          <iconify-icon class="data-table__sort-icon" icon="heroicons:chevron-up-20-solid"></iconify-icon>
        `;
      } else {
        return html`
          <iconify-icon class="data-table__sort-icon" icon="heroicons:chevron-down-20-solid"></iconify-icon>
        `;
      }
    }

    return html`
      <iconify-icon class="data-table__sort-icon" icon="heroicons:chevron-up-20-solid" style="opacity: 0.3"></iconify-icon>
    `;
  }

  /**
   * Render chevron left icon
   * @returns {TemplateResult}
   * @private
   */
  _renderChevronLeft() {
    return html`
      <iconify-icon class="data-table__pagination-icon" icon="heroicons:chevron-left-20-solid"></iconify-icon>
    `;
  }

  /**
   * Render chevron right icon
   * @returns {TemplateResult}
   * @private
   */
  _renderChevronRight() {
    return html`
      <iconify-icon class="data-table__pagination-icon" icon="heroicons:chevron-right-20-solid"></iconify-icon>
    `;
  }

  /**
   * Render the component
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <div class="data-table">
        <!-- Search bar -->
        ${this.searchable ? html`
          <div class="data-table__search">
            <input
              type="text"
              class="data-table__search-input"
              placeholder="Search..."
              .value=${this._searchQuery}
              @input=${this._handleSearch}
            >
          </div>
        ` : ''}

        <!-- Loading state -->
        ${this.loading ? html`
          <div class="data-table__loading">
            <div class="data-table__spinner"></div>
            <span>Loading...</span>
          </div>
        ` : html`
          <!-- Table -->
          <div class="data-table__wrapper">
            <table class="data-table__table">
              <thead class="data-table__thead">
                <tr>
                  ${this.columns.map(column => html`
                    <th
                      class="data-table__th ${this.sortable && column.sortable !== false ? 'data-table__th--sortable' : ''} ${this._sortColumn === column.field ? 'data-table__th--sorted' : ''}"
                      style=${column.width ? `width: ${column.width}` : ''}
                      @click=${() => this._handleSort(column.field)}
                    >
                      <div class="data-table__th-content">
                        <span>${column.label}</span>
                        ${this._renderSortIcon(column)}
                      </div>
                    </th>
                  `)}
                  ${this.rowActions ? html`
                    <th class="data-table__th data-table__th--actions" style="width: ${this.rowActionsWidth}px"></th>
                  ` : ''}
                </tr>
              </thead>
              <tbody class="data-table__tbody">
                ${this._paginatedRows.length === 0 ? html`
                  <tr class="data-table__tr">
                    <td class="data-table__td data-table__td--empty" colspan=${this.rowActions ? this.columns.length + 1 : this.columns.length}>
                      <slot name="empty">
                        ${this._searchQuery ? this.noResultsMessage : this.emptyMessage}
                      </slot>
                    </td>
                  </tr>
                ` : this._paginatedRows.map((row, index) => html`
                  <tr class="data-table__tr">
                    ${this.columns.map(column => html`
                      <td class="data-table__td">
                        <slot name="cell:${column.field}" .row=${row} .value=${this._getNestedValue(row, column.field)} .column=${column}>
                          ${this._renderCellContent(row, column)}
                        </slot>
                      </td>
                    `)}
                    ${this.rowActions ? html`
                      <td class="data-table__td data-table__td--actions">
                        <slot name="actions" .row=${row}>
                          <action-menu .resource=${row}></action-menu>
                        </slot>
                      </td>
                    ` : ''}
                  </tr>
                `)}
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          ${this.paginated && !this.loading && this._totalPages > 1 ? html`
            <div class="data-table__pagination">
              <div class="data-table__pagination-info">
                ${this._paginationInfo.start}-${this._paginationInfo.end} of ${this._paginationInfo.total}
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
          ` : ''}
        `}
      </div>
    `;
  }
}

// Register the element
customElements.define('data-table', DataTable);
