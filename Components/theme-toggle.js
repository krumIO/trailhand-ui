import { LitElement, html, css } from 'lit';

/**
 * A theme toggle component that switches between light and dark modes
 * with localStorage persistence.
 */
export class ThemeToggle extends LitElement {
  static properties = {
    isDark: { type: Boolean, state: true },
    onLabel: { type: String },
    offLabel: { type: String },
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
    this.localStorageKey = 'user-theme-preference';
    this.onLabel = 'Dark';
    this.offLabel = 'Light';

    // Initialize theme state
    this.initializeTheme();

    // Listen for theme changes from other instances
    this.boundHandleExternalThemeChange = this.handleExternalThemeChange.bind(this);
    window.addEventListener('theme-changed', this.boundHandleExternalThemeChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up event listener
    window.removeEventListener('theme-changed', this.boundHandleExternalThemeChange);
  }

  /**
   * Handle theme changes from other toggle instances
   * @param {CustomEvent} e - The theme-changed event
   */
  handleExternalThemeChange(e) {
    // Update this toggle's state to match the new theme
    const newTheme = e.detail.theme;
    this.isDark = newTheme === 'dark';
  }

  /**
   * Initialize theme based on localStorage or system preference
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem(this.localStorageKey);

    if (savedTheme === 'dark' || savedTheme === 'light') {
      // User has a saved preference - use it
      this.isDark = savedTheme === 'dark';
      this.applyThemeClass(savedTheme);
    } else {
      // No saved preference - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark = prefersDark;
      // Don't save to localStorage yet - only save when user explicitly toggles
    }
  }

  /**
   * Apply theme class to body
   * @param {string} themeName - 'dark' or 'light'
   */
  applyThemeClass(themeName) {
    const body = document.body;

    // Remove both theme classes
    body.classList.remove('theme-dark', 'theme-light');

    // Add the new theme class
    body.classList.add(`theme-${themeName}`);

    // Dispatch a custom event that other components can listen for
    this.dispatchThemeChangeEvent(themeName);
  }

  /**
   * Dispatch a theme change event
   * @param {string} themeName - The new theme name
   */
  dispatchThemeChangeEvent(themeName) {
    const event = new CustomEvent('theme-changed', {
      bubbles: true,
      composed: true,
      detail: { theme: themeName }
    });
    // Dispatch on the element for local listeners
    this.dispatchEvent(event);

    // Also dispatch on window so all toggle instances can sync
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme: themeName }
    }));
  }

  /**
   * Handle toggle switch change
   * @param {Event} e - The change event
   */
  handleToggleChange(e) {
    this.isDark = e.target.checked;
    const newTheme = this.isDark ? 'dark' : 'light';

    // Save to localStorage
    localStorage.setItem(this.localStorageKey, newTheme);

    // Apply the theme class
    this.applyThemeClass(newTheme);
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
          .checked=${this.isDark}
          @change=${this.handleToggleChange}
        >
        <span class="slider"></span>
      </label>
      <span class="label">${this.onLabel}</span>
    `;
  }
}

// Register the element
customElements.define('theme-toggle', ThemeToggle);