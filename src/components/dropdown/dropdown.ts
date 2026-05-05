import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../icon/icon';
import '../th-tag/th-tag';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
  /**
   * Multiselect only. When true, selecting this option deselects all others ("All" behavior).
   * Conversely, selecting any other option while this one is active will deselect this one.
   *
   * @example
   * options = [
   *   { label: 'All Namespaces', value: 'all', clearOthers: true },
   *   { label: 'hannah-test',    value: 'hannah-test' },
   *   { label: 'test',           value: 'test' },
   * ]
   */
  clearOthers?: boolean;
}

export interface DropdownProps {
  name: string;
  options: DropdownOption[];
  value: string;
  values: string[];
  placeholder: string;
  disabled: boolean;
  multiselect: boolean;
  filterable?: boolean;
  label?: string;
  required?: boolean;
  invalid?: boolean;
  size: 'small' | 'medium' | 'large';
  position: 'top' | 'bottom';
}

export class Dropdown extends LitElement {
  static formAssociated = true;

  @property({ type: String })
  name = '';

  @property({ attribute: false })
  options: DropdownOption[] = [];

  @property({ type: String })
  value = '';

  @property({ attribute: false })
  values: string[] = [];

  @property({ type: String })
  placeholder = 'Select...';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  multiselect = false;

  @property({ type: String })
  label = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ type: Boolean })
  filterable = false;

  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: String, reflect: true })
  position: 'top' | 'bottom' = 'bottom';

  @state()
  private _open = false;

  @state()
  private _filter = '';

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    const fieldset = this.closest('fieldset');
    if (fieldset?.disabled) {
      this.disabled = true;
    }
    document.addEventListener('click', this._handleOutsideClick);
    this.addEventListener('invalid', () => {
      this._updateValidity();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
    this._open = false;
  }

  private _handleOutsideClick(e: MouseEvent) {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this._close();
    }
  }

  private _openDropdown() {
    if (this.disabled || this._open) return;
    this._open = true;
    this._filter = '';
    if (this.filterable) {
      this.updateComplete.then(() => {
        this.shadowRoot
          ?.querySelector<HTMLInputElement>('.search-input')
          ?.focus();
      });
    }
  }

  private _close() {
    if (!this._open) return;
    this._open = false;
    this._filter = '';
  }

  private _toggle() {
    if (this._open) {
      this._close();
    } else {
      this._openDropdown();
    }
  }

  private get _filteredOptions(): DropdownOption[] {
    if (!this._filter) return this.options;
    const lower = this._filter.toLowerCase();
    return this.options.filter((o) => o.label.toLowerCase().includes(lower));
  }

  private get _selectedLabel(): string {
    if (!this.value) return '';
    const option = this.options.find((o) => o.value === this.value);
    return option?.label ?? this.value;
  }

  private _selectOption(option: DropdownOption) {
    if (option.disabled) return;
    if (this.multiselect) {
      if (this.values.includes(option.value)) {
        this.values = this.values.filter((v) => v !== option.value);
      } else if (option.clearOthers) {
        // This option clears all others when selected
        this.values = [option.value];
      } else {
        // If any currently-selected option has clearOthers, remove it first
        const clearOthersValues = this.options
          .filter((o) => o.clearOthers)
          .map((o) => o.value);
        this.values = [
          ...this.values.filter((v) => !clearOthersValues.includes(v)),
          option.value,
        ];
      }
      this._updateFormValue();
      this._emitChangeEvent();
    } else {
      this.value = option.value;
      this._updateFormValue();
      this._emitChangeEvent();
      this._close();
    }
  }

  private _removeTag(val: string) {
    this.values = this.values.filter((v) => v !== val);
    this._updateFormValue();
    this._emitChangeEvent();
  }

  private _clearAll() {
    if (this.multiselect) {
      this.values = [];
    } else {
      this.value = '';
    }
    this._updateFormValue();
    this._emitChangeEvent();
  }

  private _clearFilter() {
    this._filter = '';
    this.shadowRoot?.querySelector<HTMLInputElement>('.search-input')?.focus();
  }

  private _updateFormValue() {
    if (this.multiselect) {
      if (this.values.length > 0) {
        const fd = new FormData();
        this.values.forEach((v) => fd.append(this.name, v));
        this.internals.setFormValue(fd);
      } else {
        this.internals.setFormValue(null);
      }
    } else {
      this.internals.setFormValue(this.value || null);
    }
    this._updateValidity();
  }

  private _updateValidity() {
    const hasValue = this.multiselect ? this.values.length > 0 : !!this.value;
    if (this.required && !hasValue) {
      const anchor =
        this.shadowRoot?.querySelector<HTMLElement>('.trigger') ?? undefined;
      this.internals.setValidity(
        { valueMissing: true },
        'Please select an option',
        anchor,
      );
      this.invalid = true;
    } else {
      this.internals.setValidity({});
      this.invalid = false;
    }
  }

  private _emitChangeEvent() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent('dropdown-change', {
        detail: this.multiselect
          ? { values: this.values, name: this.name }
          : { value: this.value, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleFilterInput(e: Event) {
    this._filter = (e.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent('dropdown-filter', {
        detail: { filter: this._filter },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this._close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._focusOption(0);
    }
  }

  private _handleOptionKeydown(e: KeyboardEvent, index: number) {
    if (e.key === 'Escape') {
      this._close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._focusOption(index + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0 && this.filterable) {
        this._focusSearch();
      } else if (index > 0) {
        this._focusOption(index - 1);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const option = this._filteredOptions[index];
      if (option) this._selectOption(option);
    }
  }

  private _handleTriggerKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggle();
    } else if (e.key === 'Escape') {
      this._close();
    } else if (e.key === 'ArrowDown' && !this._open) {
      e.preventDefault();
      this._openDropdown();
    }
  }

  private _focusOption(index: number) {
    this.updateComplete.then(() => {
      const opts = this.shadowRoot?.querySelectorAll<HTMLElement>(
        '.option:not(.disabled)',
      );
      opts?.[index]?.focus();
    });
  }

  private _focusSearch() {
    this.shadowRoot?.querySelector<HTMLInputElement>('.search-input')?.focus();
  }

  get validity() {
    return this.internals.validity;
  }

  checkValidity() {
    return this.internals.checkValidity();
  }

  reportValidity() {
    return this.internals.reportValidity();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('required') ||
      changedProperties.has('value') ||
      changedProperties.has('values')
    ) {
      // Keep internals in sync so form submission is blocked when required,
      // but do not set this.invalid here — visual state is only shown after
      // the user interacts or a submit is attempted.
      const hasValue = this.multiselect ? this.values.length > 0 : !!this.value;
      if (this.required && !hasValue) {
        const anchor =
          this.shadowRoot?.querySelector<HTMLElement>('.trigger') ?? undefined;
        this.internals.setValidity(
          { valueMissing: true },
          'Please select an option',
          anchor,
        );
      } else {
        this.internals.setValidity({});
        this.invalid = false;
      }
    }
  }

  formAssociatedCallback(form: HTMLFormElement | null) {
    form?.addEventListener('submit', () => {
      this._updateValidity();
    });
  }

  formResetCallback() {
    this.value = '';
    this.values = [];
    this._updateFormValue();
  }

  formDisableCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  static styles = css`
    :host {
      display: inline-block;
      font-family: 'Montserrat', system-ui, sans-serif;
      position: relative;
      min-width: var(--th-dropdown-min-width, 220px);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .input-label {
      font-size: 11px;
      color: var(--th-input-label, #000000);
    }

    .required-indicator {
      color: var(--th-color-red, #bf1e1e);
    }

    /* ── Trigger ── */
    .trigger {
      position: relative;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
      height: 40px;
      padding: 0.45em 3em 0.45em 12px;
      border-radius: 8px;
      border: 1px solid var(--th-input-border, #d7d7d7);
      background: transparent;
      cursor: pointer;
      transition: border-color 0.2s ease;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
    }

    .trigger.open,
    .trigger:focus-within {
      border-color: var(--th-input-focus-border, #0086ff);
    }

    :host([invalid]) .trigger,
    :host([invalid]) .trigger.open,
    :host([invalid]) .trigger:focus-within {
      border-color: var(--th-input-border-invalid, #9f3a3a);
    }

    :host([disabled]) .trigger {
      cursor: not-allowed;
      opacity: 0.6;
      background: var(--th-input-bg, #ebebeb);
    }

    /* Single-select display text */
    .trigger-text {
      flex: 1;
      font-size: 14px;
      color: var(--th-input-text, #333);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: none;
    }

    .trigger-text.placeholder {
      color: var(--th-input-placeholder, #d7d7d7);
    }

    /* Chevron + clear row */
    .trigger-icons {
      position: absolute;
      right: 0.75em;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .clear-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;
      color: var(--th-input-icon-color, #aaa);
      font-size: 0.8em;
      border-radius: 2px;
      line-height: 1;
    }

    .clear-btn:hover {
      color: var(--th-input-text, #333);
    }

    .chevron {
      color: var(--th-input-icon-color, #d7d7d7);
      display: flex;
      align-items: center;
      transition: transform 0.2s ease;
      pointer-events: none;
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    /* ── Dropdown panel ── */
    .dropdown-panel {
      position: absolute;
      left: 0;
      right: 0;
      background: var(--th-dropdown-bg, #ffffff);
      border: 1px solid var(--th-input-border, #d7d7d7);
      border-radius: 8px;
      box-shadow: var(--th-dropdown-shadow, 0 4px 16px rgba(0, 0, 0, 0.1));
      z-index: 100;
    }

    .dropdown-panel.bottom {
      top: calc(100% + 4px);
    }

    .dropdown-panel.top {
      bottom: calc(100% + 4px);
    }

    /* Search row inside panel */
    .search-wrapper {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px;
      border-bottom: 1px solid var(--th-input-border, #d7d7d7);
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      box-sizing: border-box;
    }

    .search-input {
      flex: 1;
      min-width: 0;
      padding: 0.4em 10px;
      border-radius: 6px;
      border: 1px solid var(--th-input-border, #d7d7d7);
      outline: none;
      font-family: inherit;
      font-size: 13px;
      color: var(--th-input-text, #333);
      background: var(--th-dropdown-bg, #ffffff);
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: var(--th-input-focus-border, #0086ff);
    }

    .search-input::placeholder {
      color: var(--th-input-placeholder, #d7d7d7);
    }

    .search-clear-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      color: var(--th-input-icon-color, #aaa);
      font-size: 0.85em;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .search-clear-btn:hover {
      color: var(--th-input-text, #333);
    }

    /* Options */
    .options-list {
      max-height: 240px;
      overflow-y: auto;
      padding: 4px 0;
      border-radius: 8px;
    }

    .search-wrapper + .options-list {
      border-radius: 0 0 8px 8px;
    }

    .option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.55em 16px;
      cursor: pointer;
      font-size: 14px;
      color: var(--th-dropdown-option-text, var(--th-input-text, #333));
      transition: background 0.1s ease;
      outline: none;
      gap: 8px;
    }

    .option:hover:not(.disabled),
    .option:focus:not(.disabled) {
      background: var(
        --th-dropdown-option-hover-bg,
        color-mix(
          in srgb,
          var(--th-input-focus-border, #0086ff) 6%,
          transparent
        )
      );
    }

    .option.selected {
      background: var(
        --th-dropdown-option-selected-bg,
        color-mix(
          in srgb,
          var(--th-input-focus-border, #0086ff) 10%,
          transparent
        )
      );
      color: var(
        --th-dropdown-option-selected-text,
        var(--th-input-focus-border, #0086ff)
      );
    }

    .option.disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .option-label {
      flex: 1;
    }

    .option-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      color: var(
        --th-dropdown-option-selected-text,
        var(--th-input-focus-border, #0086ff)
      );
    }

    .no-options {
      padding: 1em 16px;
      font-size: 13px;
      color: var(
        --th-dropdown-no-options-text,
        var(--th-input-placeholder, #aaa)
      );
      text-align: center;
    }

    /* ── Size: small ── */
    :host([size='small']) .trigger {
      font-size: 12px;
      padding: 0.4em 2.5em 0.4em 10px;
      height: 32px;
    }
    :host([size='small']) .trigger-text,
    :host([size='small']) .option {
      font-size: 12px;
    }

    /* ── Size: large ── */
    :host([size='large']) .trigger {
      font-size: 16px;
      height: 48px;
    }
    :host([size='large']) .trigger-text,
    :host([size='large']) .option {
      font-size: 16px;
    }

    /* Disabled label */
    :host([disabled]) .input-label {
      color: var(--th-input-label-disabled, #999);
    }
  `;

  private _chevronSvg() {
    return html`
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 4L6 8L10 4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }

  private _checkSvg() {
    return html`
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 6L5 9L10 3"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }

  private _renderTriggerContent(): TemplateResult {
    if (this.multiselect) {
      const tags = this.values.map((val) => {
        const opt = this.options.find((o) => o.value === val);
        const tagLabel = opt?.label ?? val;
        return html`
          <trailhand-tag
            label=${tagLabel}
            value=${val}
            variant="info"
            size="sm"
            dismissible
            outlined
            ?disabled=${this.disabled}
            @tag-dismiss=${(e: CustomEvent<{ value: string }>) =>
              this._removeTag(e.detail.value)}
          ></trailhand-tag>
        `;
      });

      return html`
        ${tags}
        ${this.values.length === 0
          ? html`<span class="trigger-text placeholder"
              >${this.placeholder}</span
            >`
          : nothing}
      `;
    }

    const selectedLabel = this._selectedLabel;
    return html`
      <span class="trigger-text ${selectedLabel ? '' : 'placeholder'}"
        >${selectedLabel || this.placeholder}</span
      >
    `;
  }

  private _renderDropdownPanel(): TemplateResult {
    if (!this._open) return html``;

    const filtered = this._filteredOptions;

    return html`
      <div
        class="dropdown-panel ${this.position}"
        role="listbox"
        aria-multiselectable=${this.multiselect}
      >
        ${this.filterable
          ? html`
              <div class="search-wrapper">
                <input
                  class="search-input"
                  type="text"
                  placeholder="Search..."
                  .value=${this._filter}
                  autocomplete="off"
                  aria-label="Search options"
                  @input=${this._handleFilterInput}
                  @keydown=${this._handleSearchKeydown}
                />
                ${this._filter
                  ? html`
                      <button
                        class="search-clear-btn"
                        @click=${() => this._clearFilter()}
                        aria-label="Clear search"
                      >
                        <trailhand-icon name="x"></trailhand-icon>
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}

        <div class="options-list">
          ${filtered.length > 0
            ? filtered.map((option, index) => {
                const isSelected = this.multiselect
                  ? this.values.includes(option.value)
                  : this.value === option.value;
                return html`
                  <div
                    class="option ${isSelected
                      ? 'selected'
                      : ''} ${option.disabled ? 'disabled' : ''}"
                    role="option"
                    aria-selected=${isSelected}
                    aria-disabled=${option.disabled ?? false}
                    tabindex=${option.disabled ? -1 : 0}
                    @click=${() => this._selectOption(option)}
                    @keydown=${(e: KeyboardEvent) =>
                      this._handleOptionKeydown(e, index)}
                  >
                    <span class="option-label">${option.label}</span>
                    ${isSelected
                      ? html`<span class="option-check"
                          >${this._checkSvg()}</span
                        >`
                      : html`<span class="option-check"></span>`}
                  </div>
                `;
              })
            : html`<div class="no-options">No options found</div>`}
        </div>
      </div>
    `;
  }

  render(): TemplateResult {
    const hasSelection = this.multiselect
      ? this.values.length > 0
      : !!this.value;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`
              <label class="input-label">
                ${this.label}
                <span class="required-indicator"
                  >${this.required ? '*' : ''}</span
                >
              </label>
            `
          : ''}

        <div
          class="trigger ${this._open ? 'open' : ''}"
          role="combobox"
          aria-expanded=${this._open}
          aria-haspopup="listbox"
          tabindex=${this.disabled ? -1 : 0}
          @click=${() => this._toggle()}
          @keydown=${this._handleTriggerKeydown}
        >
          ${this._renderTriggerContent()}

          <span class="trigger-icons">
            ${hasSelection && !this.disabled
              ? html`
                  <button
                    class="clear-btn"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this._clearAll();
                    }}
                    aria-label="Clear selection"
                  >
                    <trailhand-icon name="x"></trailhand-icon>
                  </button>
                `
              : ''}
            <span class="chevron ${this._open ? 'open' : ''}"
              >${this._chevronSvg()}</span
            >
          </span>
        </div>

        ${this._renderDropdownPanel()}
      </div>
    `;
  }
}

customElements.define('trailhand-dropdown', Dropdown);
