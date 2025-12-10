import { LitElement, html, css } from 'lit';

/**
 * A reusable toggle switch component for boolean values.
 * Can be used for any on/off, enabled/disabled, or true/false functionality.
 */
export class ToggleSwitch extends LitElement {
  static properties = {
    checked: { type: Boolean },
    onLabel: { type: String, attribute: 'on-label' },
    offLabel: { type: String, attribute: 'off-label' },
    storageKey: { type: String, attribute: 'storage-key' },
    name: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 24px;
      margin: 0 8px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:checked + .slider:before {
      transform: translateX(34px);
    }

    .label {
      font-size: 14px;
      user-select: none;
    }
  `;

  constructor() {
    super();
    this.checked = false;
    this.onLabel = 'On';
    this.offLabel = 'Off';
    this.storageKey = null;
    this.name = '';

    // Listen for changes from other instances with the same name
    this.boundHandleExternalChange = this.handleExternalChange.bind(this);
    window.addEventListener('toggle-changed', this.boundHandleExternalChange);
  }

  connectedCallback() {
    super.connectedCallback();
    // Initialize from localStorage if storageKey is provided
    if (this.storageKey) {
      const savedValue = localStorage.getItem(this.storageKey);
      if (savedValue !== null) {
        this.checked = savedValue === 'true';
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('toggle-changed', this.boundHandleExternalChange);
  }

  /**
   * Handle changes from other toggle instances with the same name
   * @param {CustomEvent} e - The toggle-changed event
   */
  handleExternalChange(e) {
    if (this.name && e.detail.name === this.name) {
      this.checked = e.detail.checked;
    }
  }

  /**
   * Dispatch a change event
   * @param {boolean} checked - The new checked state
   */
  dispatchChangeEvent(checked) {
    const event = new CustomEvent('toggle-change', {
      bubbles: true,
      composed: true,
      detail: { checked, name: this.name }
    });
    this.dispatchEvent(event);

    // Dispatch on window if name is provided (for syncing multiple instances)
    if (this.name) {
      window.dispatchEvent(new CustomEvent('toggle-changed', {
        detail: { checked, name: this.name }
      }));
    }
  }

  /**
   * Handle toggle switch change
   * @param {Event} e - The change event
   */
  handleToggleChange(e) {
    this.checked = e.target.checked;

    // Save to localStorage if storageKey is provided
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, this.checked.toString());
    }

    // Dispatch change event
    this.dispatchChangeEvent(this.checked);
  }

  /**
   * Render the component
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <span class="label">${this.offLabel}</span>
      <label class="toggle-switch">
        <input
          type="checkbox"
          .checked=${this.checked}
          @change=${this.handleToggleChange}
        >
        <span class="slider"></span>
      </label>
      <span class="label">${this.onLabel}</span>
    `;
  }
}

// Register the element
customElements.define('toggle-switch', ToggleSwitch);
