import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// Import components you want to work on
import '../src/components/button';
import '../src/components/icon';
import '../src/components/toggle-switch';
import '../src/components/th-card';
import '../src/components/th-tag';
import '../src/components/progress-bar';

// Import global styles
import '../src/styles/colors.css';

@customElement('dev-app')
class DevApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: system-ui;
      background-color: var(--th-color-background, #f9f9f9);
      color: var(--th-color-text-primary, #111);
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

    /* info card */
    .info-card {
      --th-card-bg: #e0f7fa;
      --th-card-border: #00796b;
      --th-card-title-color: #004d40;
      --th-card-text-color: #004d40;
    }

    :host([data-theme='dark']) .info-card {
      --th-card-bg: #00796b;
      --th-card-border: #e0f7fa;
      --th-card-title-color: #e0f7fa;
      --th-card-text-color: #e0f7fa;
    }

    /* Card theming */
    .styled-card {
      --th-card-bg: #FBFBFB;
      --th-card-border: #E4E4E4;
      --th-card-title-color: #141419;
      --th-card-text-color: #475569;
    }

    :host([data-theme='dark']) .styled-card {
      --th-card-bg: #404040;
      --th-card-border: #636363;
      --th-card-title-color: #FFFFFF;
      --th-card-text-color: #cbd5e1;
      /* Button variables cascade through shadow DOM */
      --th-button-secondary-bg: #404040;
      --th-button-secondary-bg-hover: rgba(56, 189, 248, 0.1);
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

      <h1>Cards</h1>
      <div class="content">
        <trailhand-card
          card-title="Default Card"
          description="This is a basic card with a title and description."
          icon-name="home"
        ></trailhand-card>

        <trailhand-card
          class="info-card"
          variant="info"
          card-title="Info Card"
          subtitle="This is an info-style card"
          icon-name="user"
          dismissible
        ></trailhand-card>

        <trailhand-card
          class="styled-card"
          card-title="Styled Card"
          description="This card has custom colors via CSS variables."
          icon-name="bug"
        >
          <trailhand-button 
            @click=${() => console.log('clicked')}
            variant="secondary"
            size="large"
            slot="action"
          >
            Create Namespace
          </trailhand-button>
          <div slot="footer">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Quick Start With</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="#" style="display: flex; justify-content: space-between; align-items: center; color: #3b82f6; text-decoration: none; padding: 8px 0; border-bottom: 1px solid var(--th-card-border, inherit);">
                test-workspace
                <span>+</span>
              </a>
              <a href="#" style="display: flex; justify-content: space-between; align-items: center; color: #3b82f6; text-decoration: none; padding: 8px 0;">
                test-workspace-2
                <span>+</span>
              </a>
            </div>
          </div> 
        </trailhand-card>

        <trailhand-card
          class="styled-card"
          card-title="Applications"
          description="Epinio uses Applications to transition your code, through build, to being deployed."
          icon-name="grid"
        >
          <trailhand-button
            @click=${() => console.log('deploy')}
            variant="secondary"
            size="large"
            slot="action"
          >
            Deploy Application
          </trailhand-button>
          <div slot="footer">
            <trailhand-progress-bar label="Running" value="1" total="2"></trailhand-progress-bar>
          </div>
        </trailhand-card>
      </div>
    <h1>Tags</h1>
      <div class="content">
        <trailhand-tag variant="default">Default</trailhand-tag>
        <trailhand-tag label="React" variant="default" dismissible value="react"></trailhand-tag>
        <trailhand-tag variant="info">Info</trailhand-tag>
        <trailhand-tag label="React" icon="globe" variant="info" dismissible value="react"></trailhand-tag>
        <trailhand-tag variant="success">Success</trailhand-tag>
        <trailhand-tag label="Running" icon="play" variant="success"></trailhand-tag>
        <trailhand-tag variant="warning">Warning</trailhand-tag>
        <trailhand-tag label="Warning" variant="warning" outlined></trailhand-tag>
        <trailhand-tag variant="error">Error</trailhand-tag>
        <trailhand-tag label="Bug" icon="bug" variant="error"></trailhand-tag>
        <trailhand-tag label="small" size="sm" variant="info"></trailhand-tag>
        <trailhand-tag label="medium" size="md" variant="info"></trailhand-tag>
        <trailhand-tag label="large" size="lg" variant="info"></trailhand-tag>
      </div>
    `;
  }
}
