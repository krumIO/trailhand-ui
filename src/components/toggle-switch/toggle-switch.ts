import { LitElement, html, css, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Interface for the toggle-changed event detail
 */
interface ToggleChangedDetail {
  checked: boolean;
  name: string;
}

/**
 * A reusable toggle switch component for boolean values.
 * Can be used for any on/off, enabled/disabled, or true/false functionality.
 */
export class ToggleSwitch extends LitElement {
  @property({ type: Boolean })
  checked = false;

  @property({ type: String, attribute: 'on-label' })
  onLabel = 'On';

  @property({ type: String, attribute: 'off-label' })
  offLabel = 'Off';

  @property({ type: String, attribute: 'storage-key' })
  storageKey: string | null = null;

  @property({ type: String })
  name = '';

  private boundHandleExternalChange: (e: Event) => void;

  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 44px;
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
      background-color: #4a5568;
      transition: 0.3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: '';
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #3b82f6;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .label {
      font-size: 14px;
      user-select: none;
    }
  `;

  constructor() {
    super();
    // Listen for changes from other instances with the same name
    this.boundHandleExternalChange = this.handleExternalChange.bind(this);
    window.addEventListener('toggle-changed', this.boundHandleExternalChange);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Initialize from localStorage if storageKey is provided
    if (this.storageKey) {
      const savedValue = localStorage.getItem(this.storageKey);
      if (savedValue !== null) {
        this.checked = savedValue === 'true';
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(
      'toggle-changed',
      this.boundHandleExternalChange,
    );
  }

  /**
   * Handle changes from other toggle instances with the same name
   * @param e - The toggle-changed event
   */
  handleExternalChange(e: Event): void {
    const customEvent = e as CustomEvent<ToggleChangedDetail>;
    if (this.name && customEvent.detail.name === this.name) {
      this.checked = customEvent.detail.checked;
    }
  }

  /**
   * Dispatch a change event
   * @param checked - The new checked state
   */
  dispatchChangeEvent(checked: boolean): void {
    const event = new CustomEvent('toggle-change', {
      bubbles: true,
      composed: true,
      detail: { checked, name: this.name },
    });
    this.dispatchEvent(event);

    // Dispatch on window if name is provided (for syncing multiple instances)
    if (this.name) {
      window.dispatchEvent(
        new CustomEvent('toggle-changed', {
          detail: { checked, name: this.name },
        }),
      );
    }
  }

  /**
   * Handle toggle switch change
   * @param e - The change event
   */
  handleToggleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;

    // Save to localStorage if storageKey is provided
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, this.checked.toString());
    }

    // Dispatch change event
    this.dispatchChangeEvent(this.checked);
  }

  /**
   * Render the component
   * @returns TemplateResult
   */
  override render(): TemplateResult {
    return html`
      <span class="label">${this.offLabel}</span>
      <label class="toggle-switch">
        <input
          type="checkbox"
          .checked=${this.checked}
          @change=${this.handleToggleChange}
        />
        <span class="slider"></span>
      </label>
      <span class="label">${this.onLabel}</span>
    `;
  }
}

// Register the element
customElements.define('toggle-switch', ToggleSwitch);
