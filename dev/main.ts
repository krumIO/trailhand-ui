import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

// Import components you want to work on
import '../src/components/button';
import '../src/components/icon';
import '../src/components/toggle-switch';
import '../src/components/th-card';
import '../src/components/th-tag';
import '../src/components/progress-bar';
import '../src/components/checkbox';
import '../src/components/text-input';
import '../src/components/selector';
import '../src/components/modal';
import '../src/components/th-form-card';
import '../src/components/dropdown';
import '../src/components/popover';
import '../src/components/code-editor';

// Import global styles
import '../src/styles/colors.css';

@customElement('dev-app')
class DevApp extends LitElement {
  @property({ type: Boolean }) modalOpen = false;
  @property({ type: Boolean }) configModalOpen = false;
  @property({ type: Boolean }) instancesCatalogModalOpen = false;
  @property({ type: Boolean }) instancesConfigDataModalOpen = false;

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: system-ui;
      background-color: var(--th-color-background, #f9f9f9);
      color: var(--th-color-text-primary, #111);
      box-sizing: border-box;
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
      --th-card-bg: #fbfbfb;
      --th-card-border: #e4e4e4;
      --th-card-title-color: #141419;
      --th-card-text-color: #475569;
    }

    :host([data-theme='dark']) .styled-card {
      --th-card-bg: #404040;
      --th-card-border: #636363;
      --th-card-title-color: #ffffff;
      --th-card-text-color: #cbd5e1;
      /* Button variables cascade through shadow DOM */
      --th-button-secondary-bg: #404040;
      --th-button-secondary-bg-hover: rgba(56, 189, 248, 0.1);
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
      border: 1px solid var(--th-color-border, #ccc);
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

  private _handleConfigDataSubmit() {
    this.instancesConfigDataModalOpen = false;
  }

  private _handleConfigDataCancel() {
    this.instancesConfigDataModalOpen = false;
  }

  private namespaceOptions = [
    { label: 'All Namespaces', value: 'all', clearOthers: true },
    { label: 'namespace-1', value: 'namespace-1' },
    { label: 'namespace-2', value: 'namespace-2' },
    { label: 'namespace-3', value: 'namespace-3' },
    { label: 'namespace-4', value: 'namespace-4' },
    { label: 'namespace-5', value: 'namespace-5' },
  ];

  private catalogServiceOptions = [
    { label: 'service-1', value: 'service-1' },
    { label: 'service-2', value: 'service-2' },
    { label: 'service-3', value: 'service-3' },
    { label: 'service-4', value: 'service-4' },
  ];

  private applicationOptions = [
    { label: 'application-1', value: 'application-1' },
    { label: 'application-2', value: 'application-2' },
    { label: 'application-3', value: 'application-3' },
  ];

  private inputRef = createRef<HTMLDivElement>();

  private handleModalOpen() {
    this.inputRef.value?.focus();
  }

  private exampleJSON = {
    name: 'John',
    age: 30,
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    country: 'USA',
    gender: 'male',
    height: 180,
    weight: 75,
    active: true,
  };

  private codeEditorValue = JSON.stringify(this.exampleJSON, null, 2);

  render() {
    return html`
      <div class="header">
        <h1>Trailhand UI – Dev</h1>
        <trailhand-toggle-switch
          on-label="🌙 Dark"
          off-label="☀️ Light"
          .checked=${this.getAttribute('data-theme') === 'dark'}
          @toggle-change=${this.handleThemeToggle}
        ></trailhand-toggle-switch>
      </div>
      <h1>Buttons</h1>
      <!-------------------------- BUTTONS -------------------------->
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

      <!-------------------------- Cards -------------------------->
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
            <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">
              Quick Start With
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a
                href="#"
                style="display: flex; justify-content: space-between; align-items: center; color: #3b82f6; text-decoration: none; padding: 8px 0; border-bottom: 1px solid var(--th-card-border, inherit);"
              >
                test-workspace
                <span>+</span>
              </a>
              <a
                href="#"
                style="display: flex; justify-content: space-between; align-items: center; color: #3b82f6; text-decoration: none; padding: 8px 0;"
              >
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
            <trailhand-progress-bar
              label="Running"
              value="1"
              total="2"
            ></trailhand-progress-bar>
          </div>
        </trailhand-card>
      </div>

      <!-------------------------- Tags -------------------------->
      <h1>Tags</h1>
      <div class="content">
        <trailhand-tag variant="default">Default</trailhand-tag>
        <trailhand-tag
          label="React"
          variant="default"
          dismissible
          value="react"
        ></trailhand-tag>
        <trailhand-tag variant="info">Info</trailhand-tag>
        <trailhand-tag
          label="React"
          icon="globe"
          variant="info"
          dismissible
          value="react"
        ></trailhand-tag>
        <trailhand-tag variant="success">Success</trailhand-tag>
        <trailhand-tag
          label="Running"
          icon="play"
          variant="success"
        ></trailhand-tag>
        <trailhand-tag variant="warning">Warning</trailhand-tag>
        <trailhand-tag
          label="Warning"
          variant="warning"
          outlined
        ></trailhand-tag>
        <trailhand-tag
          label="Error"
          icon="error"
          variant="error"
        ></trailhand-tag>
        <trailhand-tag label="Bug" icon="bug" variant="error"></trailhand-tag>
        <trailhand-tag label="small" size="sm" variant="info"></trailhand-tag>
        <trailhand-tag label="medium" size="md" variant="info"></trailhand-tag>
        <trailhand-tag label="large" size="lg" variant="info"></trailhand-tag>
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
      <!-------------------------- DROPDOWNS -------------------------->
      <h1>Dropdowns</h1>
      <div class="content">
        <trailhand-dropdown
          name="namespace"
          label="Namespace"
          placeholder="Select a namespace..."
          .options=${this.namespaceOptions}
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespace-required"
          label="Required"
          placeholder="Select a namespace..."
          .options=${this.namespaceOptions}
          required
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespace-invalid"
          label="Invalid"
          placeholder="Select a namespace..."
          .options=${this.namespaceOptions}
          invalid
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespace-disabled"
          label="Disabled"
          placeholder="Select a namespace..."
          .options=${this.namespaceOptions}
          .value=${'namespace-1'}
          disabled
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespaces-multi"
          label="Multiselect"
          placeholder="Select namespaces..."
          .options=${this.namespaceOptions}
          multiselect
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespace-filterable"
          label="With filter"
          placeholder="Select a namespace..."
          .options=${this.namespaceOptions}
          filterable
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespaces-multi"
          label="Multiselect w/ filter"
          placeholder="Select namespaces..."
          .options=${this.namespaceOptions}
          multiselect
          filterable
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespaces-preselected"
          label="Multiselect (preselected)"
          placeholder="Select namespaces..."
          .options=${this.namespaceOptions}
          .values=${['namespace-1', 'namespace-2']}
          multiselect
        ></trailhand-dropdown>
      </div>
      <div class="content" style="margin-top: 1rem;">
        <trailhand-dropdown
          name="namespace-sm"
          label="Small"
          placeholder="Select..."
          .options=${this.namespaceOptions}
          size="small"
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespace-md"
          label="Medium"
          placeholder="Select..."
          .options=${this.namespaceOptions}
          size="medium"
        ></trailhand-dropdown>
        <trailhand-dropdown
          name="namespace-lg"
          label="Large"
          placeholder="Select..."
          .options=${this.namespaceOptions}
          size="large"
        ></trailhand-dropdown>
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
          value="This is disabled"
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
      <!-------------------------- Code Editor -------------------------->
      <h1>Code Editor</h1>
      <div class="content" style="width: 50%;">
        <trailhand-code-editor
          name="small-editor"
          label="Small Code Editor"
          size="small"
        ></trailhand-code-editor>
        <trailhand-code-editor
          name="medium-editor"
          label="Medium Code Editor"
          size="medium"
        ></trailhand-code-editor>
        <trailhand-code-editor
          name="large-editor"
          label="Large Code Editor"
          size="large"
        ></trailhand-code-editor>
        <trailhand-code-editor
          name="code-editor"
          label="Code Editor"
          .value=${this.codeEditorValue}
          placeholder="Type your code here..."
          @input=${(e: Event) => {
            const target = e.target as HTMLInputElement;
            this.codeEditorValue = target.value;
          }}
        ></trailhand-code-editor>
        <trailhand-code-editor
          name="disabled-code-editor"
          label="Disabled Multiline"
          required
          .value=${JSON.stringify(this.exampleJSON, null, 2)}
          disabled
        ></trailhand-code-editor>
        <trailhand-code-editor
          name="disabled-code-editor"
          label="Disabled Single Line"
          required
          value="single line code editor"
          disabled
        ></trailhand-code-editor>
      </div>
      <div style="margin-top: 1rem;"></div>
      <trailhand-button
        @click=${() => console.log('Code Editor Value:', this.codeEditorValue)}
      >
        Log value
      </trailhand-button>
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
      <!-------------------------- MODAL -------------------------->
      <h1>Modal</h1>
      <trailhand-button
        @click=${() => (this.modalOpen = true)}
        variant="primary"
        size="large"
      >
        Open Modal
      </trailhand-button>
      <trailhand-modal
        title="Modal Heading"
        subtitle="Subtitle"
        .open=${this.modalOpen}
        @modal-close=${() => (this.modalOpen = false)}
        @modal-open=${this.handleModalOpen}
      >
        <div
          style="display: flex; flex-direction: column; gap: 1rem; width: 500px;"
        >
          <trailhand-text-input
            ${ref(this.inputRef)}
            label="Modal Text Input"
            placeholder="Type something..."
          ></trailhand-text-input>
        </div>
        <div slot="footer">
          <trailhand-button @click=${() => (this.modalOpen = false)}
            >Close</trailhand-button
          >
        </div>
      </trailhand-modal>
      <!-------------------------- FORM CARDS -------------------------->
      <h1>Form Cards</h1>
      <div class="content">
        <trailhand-button
          variant="primary"
          @click=${() => (this.configModalOpen = true)}
        >
          Configuration Form
        </trailhand-button>
        <trailhand-button
          variant="primary"
          @click=${() => (this.instancesCatalogModalOpen = true)}
        >
          Instances – Catalog Service
        </trailhand-button>
        <trailhand-button
          variant="primary"
          @click=${() => (this.instancesConfigDataModalOpen = true)}
        >
          Instances – Config Data
        </trailhand-button>
      </div>

      <!-- Mockup 1: Configuration modal: tabs + form rows -->
      <trailhand-modal
        title="Configuration"
        subtitle="test-option"
        .open=${this.configModalOpen}
        @modal-close=${() => (this.configModalOpen = false)}
      >
        <div style="width: 680px;">
          <!-- Tab bar (tab component not yet built) -->
          <div
            style="display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 24px;"
          >
            <button
              style="background: none; border: none; border-bottom: 2px solid #2563eb; padding: 10px 16px; font-size: 14px; font-weight: 600; color: #2563eb; cursor: pointer; margin-bottom: -1px; font-family: inherit;"
            >
              Details
            </button>
            <button
              style="background: none; border: none; border-bottom: 2px solid transparent; padding: 10px 16px; font-size: 14px; font-weight: 400; color: #6b7280; cursor: pointer; margin-bottom: -1px; font-family: inherit;"
            >
              Bindings
            </button>
          </div>
          <trailhand-form-card>
            <trailhand-form-row columns="3">
              <trailhand-dropdown
                name="namespace"
                label="Namespace"
                placeholder="Select a namespace..."
                .options=${this.namespaceOptions}
                required
              ></trailhand-dropdown>
              <trailhand-text-input
                label="Name"
                placeholder="Test"
                required
              ></trailhand-text-input>
              <trailhand-text-input
                label="Instances"
                placeholder="1"
                required
              ></trailhand-text-input>
            </trailhand-form-row>
            <trailhand-form-row title="Routes">
              <trailhand-text-input
                placeholder="test.epinio.krum-dev.cloud.krum.io"
              ></trailhand-text-input>
            </trailhand-form-row>
            <trailhand-form-row title="Application Variables">
              <trailhand-text-input
                placeholder="app.listeningport"
              ></trailhand-text-input>
            </trailhand-form-row>
            <trailhand-form-row title="Environment Variables">
              <div
                style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px;"
              >
                <span style="font-size: 13px; font-weight: 500; color: #6b7280;"
                  >Name</span
                >
                <span style="font-size: 13px; font-weight: 500; color: #6b7280;"
                  >Value</span
                >
                <span style="font-size: 13px;">--</span>
                <span style="font-size: 13px;">--</span>
              </div>
            </trailhand-form-row>
          </trailhand-form-card>
        </div>
      </trailhand-modal>

      <!-- Mockup 2: Instances – Catalog Service -->
      <trailhand-modal
        title="Instances"
        subtitle="Create New"
        .open=${this.instancesCatalogModalOpen}
        @modal-close=${() => (this.instancesCatalogModalOpen = false)}
      >
        <div style="width: 560px;">
          <trailhand-form-card>
            <trailhand-form-row columns="2">
              <trailhand-dropdown
                name="namespace"
                label="Namespace"
                placeholder="Select a namespace..."
                .options=${this.namespaceOptions}
                required
              ></trailhand-dropdown>
              <trailhand-text-input
                label="Name"
                placeholder="A Unique Name"
                required
              ></trailhand-text-input>
            </trailhand-form-row>
            <trailhand-form-row>
              <trailhand-dropdown
                name="catalog-service"
                label="Catalog Service"
                placeholder="Select the type of service to create..."
                .options=${this.catalogServiceOptions}
                required
              ></trailhand-dropdown>
            </trailhand-form-row>
            <trailhand-form-row>
              <trailhand-dropdown
                name="application"
                label="Bind to Application (Optional)"
                placeholder="Select an application..."
                .options=${this.applicationOptions}
              ></trailhand-dropdown>
            </trailhand-form-row>
          </trailhand-form-card>
        </div>
        <div slot="footer" style="display: flex; gap: 12px;">
          <trailhand-button
            variant="secondary"
            @button-click=${() => (this.instancesCatalogModalOpen = false)}
            >Cancel</trailhand-button
          >
          <trailhand-button
            variant="primary"
            @button-click=${() => (this.instancesCatalogModalOpen = false)}
            >Create</trailhand-button
          >
        </div>
      </trailhand-modal>

      <!-- Mockup 3: Instances – Config Data -->
      <trailhand-modal
        title="Instances"
        subtitle="Create New"
        .open=${this.instancesConfigDataModalOpen}
        @modal-close=${() => (this.instancesConfigDataModalOpen = false)}
      >
        <div style="width: 560px;">
          <trailhand-form-card
            button-label="Create"
            button-variant="primary"
            cancel-label="Cancel"
            @form-card-submit=${this._handleConfigDataSubmit}
            @form-card-cancel=${this._handleConfigDataCancel}
          >
            <trailhand-form-row columns="2">
              <trailhand-dropdown
                name="namespace"
                label="Namespace"
                placeholder="Select a namespace..."
                .options=${this.namespaceOptions}
                required
              ></trailhand-dropdown>
              <trailhand-text-input
                label="Name"
                placeholder="A Unique Name"
                required
              ></trailhand-text-input>
            </trailhand-form-row>
            <trailhand-form-row>
              <trailhand-dropdown
                name="application"
                label="Bind to Application (Optional)"
                placeholder="Select an application..."
                .options=${this.applicationOptions}
              ></trailhand-dropdown>
            </trailhand-form-row>
            <trailhand-form-row title="Config Data" columns="2">
              <trailhand-text-input
                label="Name"
                placeholder="e.g. foo"
                required
              ></trailhand-text-input>
              <div style="display: flex; align-items: flex-end; gap: 8px;">
                <trailhand-text-input
                  label="Value"
                  required
                  style="flex: 1;"
                ></trailhand-text-input>
                <a
                  href="#"
                  style="font-size: 13px; color: #2563eb; text-decoration: none; white-space: nowrap; padding-bottom: 10px;"
                  >Upload</a
                >
                <a
                  href="#"
                  style="font-size: 13px; color: #ef4444; text-decoration: none; white-space: nowrap; padding-bottom: 10px;"
                  >Remove</a
                >
              </div>
              <div style="grid-column: span 2; display: flex; gap: 8px;">
                <trailhand-button variant="secondary" size="small"
                  >Add</trailhand-button
                >
                <trailhand-button variant="secondary" size="small"
                  >Read From File</trailhand-button
                >
              </div>
            </trailhand-form-row>
          </trailhand-form-card>
        </div>
      </trailhand-modal>

      <!-- Native form wrapper example -->
      <h2 style="margin-top: 32px;">Native Form Wrapper</h2>
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">
        Wrap <code>trailhand-form-card</code> in a native
        <code>&lt;form&gt;</code> to get <code>FormData</code> collection and
        native validation. Listen to <code>form-card-submit</code> and call
        <code>form.requestSubmit()</code> to trigger native validation before
        the <code>submit</code> event fires.
      </p>
      <form
        @submit=${(e: SubmitEvent) => {
          const form = e.currentTarget as HTMLFormElement;

          if (!form.checkValidity()) {
            form.reportValidity();
            e.preventDefault(); // stop submission
            return;
          }

          e.preventDefault();
          const formData = new FormData(form);
          alert(`Submitted: ${JSON.stringify(Object.fromEntries(formData))}`);
        }}
      >
        <trailhand-form-card
          button-label="Create"
          cancel-label="Reset"
          columns="2"
          @form-card-submit=${(e: Event) => {
            (e.currentTarget as HTMLElement).closest('form')?.requestSubmit();
          }}
          @form-card-cancel=${(e: Event) => {
            (
              (e.currentTarget as HTMLElement).closest(
                'form',
              ) as HTMLFormElement
            )?.reset();
          }}
        >
          <trailhand-text-input
            name="namespace"
            label="Namespace"
            placeholder="my-namespace"
            required
          ></trailhand-text-input>
          <trailhand-text-input
            name="name"
            label="Name"
            placeholder="my-app"
            required
          ></trailhand-text-input>
        </trailhand-form-card>
      </form>

      <!-------------------------- POPOVER -------------------------->
      <h1>Popover</h1>
      <div class="content" style="padding-bottom: 120px;">
        <trailhand-popover placement="bottom">
          <trailhand-button slot="trigger" variant="primary">
            Open Popover (Bottom)
          </trailhand-button>
          <div>
            <p style="margin: 0 0 8px; font-weight: 600;">Popover Content</p>
            <p
              style="margin: 0; font-size: 14px; color: var(--th-color-text-secondary);"
            >
              Any components can go here.
            </p>
          </div>
        </trailhand-popover>

        <trailhand-popover placement="top">
          <trailhand-button slot="trigger" variant="secondary">
            Open Popover (Top)
          </trailhand-button>
          <div>
            <p style="margin: 0 0 8px; font-weight: 600;">Above the Trigger</p>
            <p
              style="margin: 0; font-size: 14px; color: var(--th-color-text-secondary);"
            >
              Placement set to top.
            </p>
          </div>
        </trailhand-popover>

        <trailhand-popover
          placement="top"
          stay-open
          title="Filter Options"
          subtitle="containers"
        >
          <trailhand-button slot="trigger" variant="alternate">
            Stay Open Popover
          </trailhand-button>
          <div
            style="display: flex; flex-direction: column; gap: 12px; min-width: 260px;"
          >
            <trailhand-text-input
              label="Search"
              placeholder="e.g., my-container"
            ></trailhand-text-input>
            <trailhand-text-input
              label="Tail (number of lines)"
              placeholder="e.g., 100"
            ></trailhand-text-input>
            <div style="display: flex; gap: 8px;">
              <trailhand-button size="small">Apply</trailhand-button>
              <trailhand-button size="small" variant="secondary"
                >Clear</trailhand-button
              >
            </div>
          </div>
        </trailhand-popover>
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
          <trailhand-code-editor
            name="disabledCodeEditor"
            label="Disabled Code Editor"
            required
          ></trailhand-code-editor>
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
          <trailhand-dropdown
            name="formDropdown"
            label="Form Dropdown"
            placeholder="Select an option..."
            .options=${this.namespaceOptions}
            required
          ></trailhand-dropdown>
          <trailhand-code-editor
            name="codeEditor"
            label="Code Editor"
            placeholder="Type your code here..."
            required
          ></trailhand-code-editor>
        </fieldset>
        <trailhand-button type="submit">Submit Form</trailhand-button>
        <trailhand-button type="reset" variant="destructive"
          >Reset Form</trailhand-button
        >
      </form>
    `;
  }
}
