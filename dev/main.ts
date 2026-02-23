import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// Import components you want to work on
import '../src/components/button';
import '../src/components/icon';

// Import global styles
import '../src/styles/colors.css';

@customElement('dev-app')
class DevApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: system-ui;
      background-color: var(--color-background, #f9f9f9);
      color: var(--color-text-primary, #111);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .content {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
  `;

  private handleThemeToggle(e: CustomEvent<{ checked: boolean }>) {
    const isDark = e.detail.checked;

    if (isDark) {
      this.setAttribute('data-theme', 'dark');
    } else {
      this.removeAttribute('data-theme');
    }
  }

  render() {
    return html`
      <div class="header">
        <h1>Trailhand UI – Dev</h1>
        <toggle-switch
          on-label="🌙 Dark"
          off-label="☀️ Light"
          .checked=${this.getAttribute('data-theme') === 'dark'}
          @toggle-change=${this.handleThemeToggle}
        ></toggle-switch>
      </div>
      <h1>Buttons</h1>
      <div class="content">
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="primary"
          size="large"
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Primary
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="secondary"
          size="large"
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Secondary
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="alternate"
          size="large"
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Alternate
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="destructive"
          size="large"
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Destructive
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="confirmation"
          size="large"
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Confirmation
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="primary"
          size="large"
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Large
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="primary"
          size="medium"
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Medium
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="primary"
          size="small"
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Small
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
        <trailhand-button
          @click=${() => console.log('clicked')}
          variant="primary"
          size="large"
          disabled
        >
          <trailhand-icon name="globe" slot="icon-left"></trailhand-icon>
          Disabled
          <trailhand-icon name="globe" slot="icon-right"></trailhand-icon>
        </trailhand-button>
      </div>
    `;
  }
}
