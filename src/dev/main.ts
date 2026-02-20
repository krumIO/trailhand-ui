import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// Import components you want to work on
import '../components/button';
import '../components/icon';
import '../components/toggle-switch';
import '../components/checkbox';
import '../components/text-input';
import '../components/selector';

// Import global styles
import '../styles/colors.css';

@customElement('dev-app')
class DevApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      padding: 2rem;
      font-family: system-ui;
      background-color: var(--color-background, #f9f9f9);
      color: var(--color-text-primary, #111);
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
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

    .column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 50%;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 50%;
    }

    .fieldset {
      border: 1px solid var(--color-border, #ccc);
      padding: 1rem;
      border-radius: 8px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
      <!-------------------------- BUTTONS -------------------------->
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
      <!-------------------------- CHECKBOXES -------------------------->
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
        <trailhand-checkbox name="checkbox6" value="6" size="small"
          >Small</trailhand-checkbox
        >
        <trailhand-checkbox name="checkbox7" value="7" size="medium"
          >Medium</trailhand-checkbox
        >
        <trailhand-checkbox name="checkbox8" value="8" size="large"
          >Large</trailhand-checkbox
        >
      </div>
      <!-------------------------- TEXT INPUTS -------------------------->
      <h1>Text Inputs</h1>
      <div class="content">
        <trailhand-text-input value="" placeholder="Placeholder"
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-text-input>
        <trailhand-text-input
          label="Active"
          value="Active"
          placeholder="Placeholder"
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-text-input>
        <trailhand-text-input
          label="Disabled"
          value=""
          placeholder="Placeholder"
          disabled
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-text-input>
        <trailhand-text-input
          label="Small"
          value=""
          placeholder="Placeholder"
          required
          size="small"
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-text-input>
        <trailhand-text-input
          label="Medium"
          value=""
          placeholder="Placeholder"
          required
          size="medium"
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-text-input>
        <trailhand-text-input
          label="Large"
          value=""
          placeholder="Placeholder"
          required
          size="large"
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-text-input>
        <trailhand-text-input
          label="Invalid"
          value=""
          placeholder="Placeholder"
          required
          size="medium"
          invalid
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-text-input>
      </div>
      <!-------------------------- Selectors -------------------------->
      <h1>Selectors</h1>
      <div class="column">
        <trailhand-selector
          name="group"
          value="1"
          text="Option 1"
          subtext="Subtext for option 1"
          description="This is additional text if the above details are not sufficient."
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-selector>
        <trailhand-selector
          name="group"
          value="2"
          checked
          text="Option 2"
          subtext="Subtext for option 2"
          description="This is additional text if the above details are not sufficient."
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-selector>
        <trailhand-selector
          disabled
          name="group"
          value="3"
          text="Option 3 (Disabled)"
          subtext="Subtext for option 3"
          description="This is additional text if the above details are not sufficient."
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-selector>
        <trailhand-selector
          name="group"
          value="4"
          text="Option 4"
          subtext="Subtext for option 4"
          description="This is additional text if the above details are not sufficient."
          ><trailhand-icon name="globe" slot="icon"></trailhand-icon
        ></trailhand-selector>
      </div>
      <!-------------------------- FORM INTEGRATION -------------------------->
      <h1>Form Integration</h1>
      <form
        class="form"
        @submit=${(e: SubmitEvent) => {
          const form = e.currentTarget as HTMLFormElement;

          if (!form.checkValidity()) {
            form.reportValidity();
            e.preventDefault(); // stop submission
            return;
          }

          // Only runs if valid
          e.preventDefault();
          const formData = new FormData(form);
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
          <trailhand-text-input
            label="Form Text Input"
            name="formTextInput"
            placeholder="Type something..."
          ></trailhand-text-input>
          <trailhand-selector
            name="disabledFormSelector"
            value="option1"
            text="Form Selector Option 1"
            subtext="Subtext for option 1"
            description="This is additional text if the above details are not sufficient."
          >
            <trailhand-icon name="globe" slot="icon"></trailhand-icon>
          </trailhand-selector>
          <trailhand-selector
            name="disabledFormSelector"
            value="option2"
            text="Form Selector Option 2"
            subtext="Subtext for option 2"
            description="This is additional text if the above details are not sufficient."
          >
            <trailhand-icon name="globe" slot="icon"></trailhand-icon>
          </trailhand-selector>
        </fieldset>
        <fieldset class="fieldset">
          <legend>Enabled Fieldset</legend>
          <trailhand-checkbox name="formCheckbox2" value="on"
            >Form Checkbox 2</trailhand-checkbox
          >
          <trailhand-text-input
            label="Form Text Input 2"
            name="formTextInput2"
            placeholder="Type something..."
          ></trailhand-text-input>
          <trailhand-text-input
            label="Form Text Input 3"
            name="formTextInput3"
            placeholder="Type something..."
            required
          ></trailhand-text-input>
          <trailhand-selector
            name="formSelector"
            value="option1"
            text="Form Selector Option 1"
            subtext="Subtext for option 1"
            description="This is additional text if the above details are not sufficient."
          >
            <trailhand-icon name="globe" slot="icon"></trailhand-icon>
          </trailhand-selector>
          <trailhand-selector
            name="formSelector"
            value="option2"
            text="Form Selector Option 2"
            subtext="Subtext for option 2"
            description="This is additional text if the above details are not sufficient."
          >
            <trailhand-icon name="globe" slot="icon"></trailhand-icon>
          </trailhand-selector>
        </fieldset>
        <trailhand-button type="submit">Submit Form</trailhand-button>
        <trailhand-button type="reset" variant="destructive"
          >Reset Form</trailhand-button
        >
      </form>
    `;
  }
}
