import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// Import components you want to work on
import '../components/button';
import '../components/icon';
import '../components/toggle-switch';
import '../components/checkbox';

// Import global styles
import '../styles/colors.css';

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

    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 300px;
    }

    .fieldset {
      border: 1px solid var(--color-border, #ccc);
      padding: 1rem;
      border-radius: 8px;
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
      <h1>Checkboxes</h1>
      <div class="content">
        <trailhand-checkbox name="checkbox1" value="1"
          >Option 1</trailhand-checkbox
        >
        <trailhand-checkbox name="checkbox2" value="2" checked
          >Option 2</trailhand-checkbox
        >
        <trailhand-checkbox name="checkbox3" value="3" indeterminate
          >Option 3</trailhand-checkbox
        >
        <trailhand-checkbox name="checkbox4" value="4" disabled
          >Disabled</trailhand-checkbox
        >
        <trailhand-checkbox name="checkbox5" value="5" checked disabled
          >Checked & Disabled</trailhand-checkbox
        >
        <trailhand-checkbox name="checkbox5" value="5" checked indeterminate
          >Checked & Indeterminate</trailhand-checkbox
        >
      </div>
      <h1>Form Integration</h1>
      <form
        class="form"
        @submit=${(e: Event) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          console.log(
            'Form submitted with values:',
            Object.fromEntries(formData),
          );
        }}
      >
        <fieldset class="fieldset" disabled>
          <legend>Disabled Fieldset</legend>
          <trailhand-checkbox name="formCheckbox" value="on"
            >Form Checkbox</trailhand-checkbox
          >
        </fieldset>
        <fieldset class="fieldset">
          <legend>Enabled Fieldset</legend>
          <trailhand-checkbox name="formCheckbox2" value="on"
            >Form Checkbox 2</trailhand-checkbox
          >
        </fieldset>
        <trailhand-button type="submit">Submit Form</trailhand-button>
        <trailhand-button type="reset" variant="destructive"
          >Reset Form</trailhand-button
        >
      </form>
    `;
  }
}
