import { LitElement, html, css } from 'lit';

/**
 * A dropdown action menu component for displaying contextual actions.
 * Typically used in table rows or cards to provide action options.
 */
export class ActionMenu extends LitElement {
  static properties = {
    actions: { type: Array },
    resource: { type: Object },
    disabled: { type: Boolean },
    _isOpen: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .action-menu__button {
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

    .action-menu__button:hover:not(:disabled) {
      background-color: var(--sortable-table-row-hover-bg, #f5f5f5);
      border-color: var(--link, #007bff);
    }

    .action-menu__button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .action-menu__icon {
      width: 16px;
      height: 16px;
    }

    .action-menu__dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 4px;
      min-width: 180px;
      background-color: var(--body-bg, #fff);
      border: 1px solid var(--border, #ddd);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease-in-out;
    }

    .action-menu__dropdown--open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .action-menu__list {
      list-style: none;
      margin: 0;
      padding: 0.5rem 0;
    }

    .action-menu__item {
      margin: 0;
      padding: 0;
    }

    .action-menu__action {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem 1rem;
      border: none;
      background: none;
      color: var(--body-text, #333);
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .action-menu__action:hover:not(:disabled) {
      background-color: var(--sortable-table-row-hover-bg, #f5f5f5);
    }

    .action-menu__action:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .action-menu__action--danger {
      color: var(--error, #dc3545);
    }

    .action-menu__action--danger:hover:not(:disabled) {
      background-color: rgba(220, 53, 69, 0.1);
    }

    .action-menu__divider {
      height: 1px;
      margin: 0.5rem 0;
      background-color: var(--border, #ddd);
    }

    .action-menu__empty {
      padding: 1rem;
      text-align: center;
      color: var(--muted, #999);
      font-size: 13px;
    }
  `;

  constructor() {
    super();
    this.actions = [];
    this.resource = {};
    this.disabled = false;
    this._isOpen = false;
    this._boundHandleClickOutside = this._handleClickOutside.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._boundHandleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._boundHandleClickOutside);
  }

  /**
   * Handle clicks outside the menu to close it
   * @param {Event} e - The click event
   * @private
   */
  _handleClickOutside(e) {
    if (this._isOpen && !this.contains(e.target)) {
      this._isOpen = false;
    }
  }

  /**
   * Toggle the dropdown menu open/closed
   * @param {Event} e - The click event
   * @private
   */
  _toggleMenu(e) {
    e.stopPropagation();
    if (!this.disabled) {
      this._isOpen = !this._isOpen;
    }
  }

  /**
   * Handle action click
   * @param {Event} e - The click event
   * @param {Object} action - The action object
   * @private
   */
  _handleActionClick(e, action) {
    e.stopPropagation();

    if (this._isActionEnabled(action)) {
      this._isOpen = false;

      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('action-click', {
        bubbles: true,
        composed: true,
        detail: { action, resource: this.resource }
      }));

      // Call action handler if provided
      if (action.action && typeof action.action === 'function') {
        action.action(this.resource);
      }
    }
  }

  /**
   * Check if an action is enabled
   * @param {Object} action - The action object
   * @returns {boolean}
   * @private
   */
  _isActionEnabled(action) {
    if (!action.enabled) return true;
    if (typeof action.enabled === 'function') {
      return action.enabled(this.resource);
    }
    return action.enabled;
  }

  /**
   * Render the three-dots icon
   * @returns {TemplateResult}
   * @private
   */
  _renderIcon() {
    return html`
      <svg class="action-menu__icon" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="2" cy="8" r="1.5" />
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="14" cy="8" r="1.5" />
      </svg>
    `;
  }

  /**
   * Get actions to display
   * @returns {Array}
   * @private
   */
  _getActions() {
    // If actions are provided explicitly, use them
    if (this.actions && this.actions.length > 0) {
      return this.actions;
    }
    // Otherwise, try to get from resource.availableActions
    if (this.resource && typeof this.resource.availableActions !== 'undefined') {
      return this.resource.availableActions || [];
    }
    return [];
  }

  /**
   * Render the component
   * @returns {TemplateResult}
   */
  render() {
    const allActions = this._getActions();

    // Filter by visibility and enabled status
    let visibleActions = allActions.filter(action => {
      // Skip dividers in visibility check
      if (action.divider) return true;

      // Check visible property
      if (action.visible !== undefined) {
        if (typeof action.visible === 'function') {
          return action.visible(this.resource);
        }
        return action.visible;
      }

      // If no visible property, check enabled (hide if explicitly false)
      if (action.enabled !== undefined && action.enabled === false) {
        return false;
      }

      return true;
    });

    // Remove consecutive dividers and trailing/leading dividers
    visibleActions = visibleActions.filter((action, index, arr) => {
      if (!action.divider) return true;
      // Remove if first or last
      if (index === 0 || index === arr.length - 1) return false;
      // Remove if next to another divider
      if (arr[index - 1]?.divider || arr[index + 1]?.divider) return false;
      return true;
    });

    return html`
      <button
        class="action-menu__button"
        ?disabled=${this.disabled}
        @click=${this._toggleMenu}
        aria-haspopup="true"
        aria-expanded=${this._isOpen}
      >
        ${this._renderIcon()}
      </button>

      <div class="action-menu__dropdown ${this._isOpen ? 'action-menu__dropdown--open' : ''}">
        ${visibleActions.length === 0 ? html`
          <div class="action-menu__empty">No actions available</div>
        ` : html`
          <ul class="action-menu__list" role="menu">
            ${visibleActions.map((action, index) => html`
              ${action.divider ? html`
                <li class="action-menu__divider" role="separator"></li>
              ` : html`
                <li class="action-menu__item" role="none">
                  <button
                    class="action-menu__action ${action.danger ? 'action-menu__action--danger' : ''}"
                    ?disabled=${!this._isActionEnabled(action)}
                    @click=${(e) => this._handleActionClick(e, action)}
                    role="menuitem"
                  >
                    ${action.label}
                  </button>
                </li>
              `}
            `)}
          </ul>
        `}
      </div>
    `;
  }
}

// Register the element
customElements.define('action-menu', ActionMenu);
