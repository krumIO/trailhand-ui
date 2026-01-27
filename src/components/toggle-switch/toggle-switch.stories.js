import './toggle-switch.ts';

/**
 * The ToggleSwitch component is a reusable boolean toggle that can be used
 * for any on/off, enabled/disabled, or true/false functionality.
 */
export default {
  title: 'Components/ToggleSwitch',
  tags: ['autodocs'],
  render: (args) => {
    const toggle = document.createElement('toggle-switch');

    if (args.onLabel) toggle.onLabel = args.onLabel;
    if (args.offLabel) toggle.offLabel = args.offLabel;
    if (args.checked !== undefined) toggle.checked = args.checked;
    if (args.storageKey) toggle.storageKey = args.storageKey;
    if (args.name) toggle.name = args.name;

    toggle.addEventListener('toggle-change', (e) => {
      console.log('Toggle changed:', e.detail);
    });

    return toggle;
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked (on)',
      defaultValue: false,
    },
    onLabel: {
      control: 'text',
      description: 'Label shown when toggle is on',
      defaultValue: 'On',
    },
    offLabel: {
      control: 'text',
      description: 'Label shown when toggle is off',
      defaultValue: 'Off',
    },
    storageKey: {
      control: 'text',
      description: 'Optional localStorage key for persisting toggle state',
    },
    name: {
      control: 'text',
      description: 'Optional name for syncing multiple toggle instances',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
  A generic, reusable toggle switch component for boolean values.

  **Features:**
  - Works for any on/off, enabled/disabled, or true/false functionality
  - Optional localStorage persistence with \`storageKey\` prop
  - Sync multiple instances with the same \`name\` prop
  - Dispatches \`toggle-change\` events with checked state
  - Fully customizable labels
        `.trim(),
      },
    },
  },
};

/**
 * Default toggle with standard "On/Off" labels
 */
export const Default = {
  args: {
    checked: false,
    onLabel: 'On',
    offLabel: 'Off',
  },
  parameters: {
    docs: {
      source: {
        code: '<toggle-switch></toggle-switch>',
      },
    },
  },
};

/**
 * Custom labels for different use cases
 */
export const CustomLabels = {
  args: {
    checked: false,
    onLabel: 'Enabled',
    offLabel: 'Disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Customize labels to match your use case.',
      },
      source: {
        code: '<toggle-switch onLabel="Enabled" offLabel="Disabled"></toggle-switch>',
      },
    },
  },
};

/**
 * Icon-only labels for compact appearance
 */
export const IconLabels = {
  args: {
    checked: false,
    onLabel: '✓',
    offLabel: '✗',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use icons or symbols for a minimal appearance.',
      },
      source: {
        code: '<toggle-switch onLabel="✓" offLabel="✗"></toggle-switch>',
      },
    },
  },
};

/**
 * Toggle that starts in the checked state
 */
export const InitiallyChecked = {
  args: {
    checked: true,
    onLabel: 'Active',
    offLabel: 'Inactive',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle can be initialized in the checked state.',
      },
      source: {
        code: '<toggle-switch checked onLabel="Active" offLabel="Inactive"></toggle-switch>',
      },
    },
  },
};

/**
 * Toggle with localStorage persistence
 */
export const WithPersistence = {
  args: {
    checked: false,
    onLabel: 'On',
    offLabel: 'Off',
    storageKey: 'demo-toggle-state',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Toggle state persists across page reloads using localStorage. Try toggling and refreshing the page.',
      },
      source: {
        code: '<toggle-switch storageKey="my-setting"></toggle-switch>',
      },
    },
  },
};

/**
 * Multiple synced toggles
 */
export const SyncedToggles = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText =
      'display: flex; flex-direction: column; gap: 20px;';

    const description = document.createElement('p');
    description.textContent =
      'These toggles share the same name, so toggling one updates all others:';
    container.appendChild(description);

    for (let i = 1; i <= 3; i++) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText =
        'padding: 12px; background: #f5f5f5; border-radius: 4px;';

      const label = document.createElement('span');
      label.textContent = `Toggle ${i}: `;
      label.style.marginRight = '10px';

      const toggle = document.createElement('toggle-switch');
      toggle.name = 'synced-demo';
      toggle.onLabel = 'Yes';
      toggle.offLabel = 'No';

      wrapper.appendChild(label);
      wrapper.appendChild(toggle);
      container.appendChild(wrapper);
    }

    return container;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple toggle instances with the same `name` prop stay synchronized.',
      },
      source: {
        code: `<toggle-switch name="synced-demo" onLabel="Yes" offLabel="No"></toggle-switch>
<toggle-switch name="synced-demo" onLabel="Yes" offLabel="No"></toggle-switch>
<toggle-switch name="synced-demo" onLabel="Yes" offLabel="No"></toggle-switch>`,
      },
    },
  },
};

/**
 * Theme switching example
 */
export const ThemeSwitching = {
  render: () => {
    const container = document.createElement('div');

    // Initialize theme from system preference or localStorage
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('user-theme-preference');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
        return savedTheme === 'dark';
      } else {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches;
        return prefersDark;
      }
    };

    const applyTheme = (theme) => {
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(`theme-${theme}`);
    };

    const toggle = document.createElement('toggle-switch');
    toggle.checked = initializeTheme();
    toggle.onLabel = '🌙 Dark';
    toggle.offLabel = '☀️ Light';
    toggle.name = 'theme-demo';

    toggle.addEventListener('toggle-change', (e) => {
      const theme = e.detail.checked ? 'dark' : 'light';
      localStorage.setItem('user-theme-preference', theme);
      applyTheme(theme);
    });

    const header = document.createElement('div');
    header.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;';
    header.innerHTML = '<h2 style="margin: 0;">Theme Switching Demo</h2>';
    header.appendChild(toggle);

    const intro = document.createElement('p');
    intro.textContent =
      'Toggle the switch to see the theme change in real-time. Notice how the background, text, and card colors all update smoothly.';

    const card1 = document.createElement('div');
    card1.className = 'theme-demo-card';
    card1.innerHTML = `
      <h3>How it works</h3>
      <ul>
        <li>CSS uses <code>@media (prefers-color-scheme: dark)</code> for system preference</li>
        <li>Toggling adds <code>.theme-light</code> or <code>.theme-dark</code> class to body</li>
        <li>Body classes override the media query (higher specificity)</li>
        <li>Your choice is saved to localStorage</li>
      </ul>
    `;

    const card2 = document.createElement('div');
    card2.className = 'theme-demo-card';
    card2.innerHTML = `
      <h3>Features</h3>
      <p>✨ Smooth transitions between themes</p>
      <p>💾 Automatic localStorage persistence</p>
      <p>🎨 System preference detection</p>
      <p>🔔 Custom events for integration</p>
    `;

    container.appendChild(header);
    container.appendChild(intro);
    container.appendChild(card1);
    container.appendChild(card2);

    return container;
  },
  decorators: [
    (story) => {
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --demo-bg: #ffffff;
          --demo-text: #333333;
          --demo-card-bg: #f5f5f5;
          --demo-border: #e0e0e0;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --demo-bg: #121212;
            --demo-text: #e0e0e0;
            --demo-card-bg: #1e1e1e;
            --demo-border: #333333;
          }
        }

        body.theme-light {
          --demo-bg: #ffffff !important;
          --demo-text: #333333 !important;
          --demo-card-bg: #f5f5f5 !important;
          --demo-border: #e0e0e0 !important;
        }

        body.theme-dark {
          --demo-bg: #121212 !important;
          --demo-text: #e0e0e0 !important;
          --demo-card-bg: #1e1e1e !important;
          --demo-border: #333333 !important;
        }

        body {
          background-color: var(--demo-bg) !important;
          transition: background-color 0.3s ease !important;
        }

        .theme-demo-card {
          background-color: var(--demo-card-bg) !important;
          border: 1px solid var(--demo-border) !important;
          color: var(--demo-text) !important;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        #storybook-root,
        #storybook-root *:not(toggle-switch):not(toggle-switch *) {
          color: var(--demo-text) !important;
        }
      `;

      const wrapper = document.createElement('div');
      wrapper.appendChild(style);
      wrapper.appendChild(story());
      return wrapper;
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Using toggle-switch for theme management. Detects system preference and allows user override with localStorage persistence.',
      },
      source: {
        code: `<toggle-switch
  onLabel="🌙 Dark"
  offLabel="☀️ Light"
  storageKey="user-theme-preference">
</toggle-switch>

<script>
  const toggle = document.querySelector('toggle-switch');

  // Initialize from system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  toggle.checked = prefersDark;

  // Handle theme changes
  toggle.addEventListener('toggle-change', (e) => {
    const theme = e.detail.checked ? 'dark' : 'light';
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(\`theme-\${theme}\`);
  });
</script>`,
      },
    },
  },
};

/**
 * Various use case examples
 */
export const UseCaseExamples = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText =
      'display: flex; flex-direction: column; gap: 16px;';

    const useCases = [
      { label: 'Notifications:', onLabel: 'On', offLabel: 'Off' },
      { label: 'Email alerts:', onLabel: 'Enabled', offLabel: 'Disabled' },
      { label: 'Auto-save:', onLabel: 'Active', offLabel: 'Inactive' },
      { label: 'Public profile:', onLabel: 'Visible', offLabel: 'Hidden' },
      { label: 'Two-factor auth:', onLabel: '🔒 On', offLabel: '🔓 Off' },
    ];

    useCases.forEach(({ label, onLabel, offLabel }) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; padding: 8px;';

      const labelEl = document.createElement('span');
      labelEl.textContent = label;
      labelEl.style.cssText = 'min-width: 150px; font-weight: 500;';

      const toggle = document.createElement('toggle-switch');
      toggle.onLabel = onLabel;
      toggle.offLabel = offLabel;

      row.appendChild(labelEl);
      row.appendChild(toggle);
      container.appendChild(row);
    });

    return container;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Examples of how toggle-switch can be used in different contexts.',
      },
      source: {
        code: `<toggle-switch onLabel="On" offLabel="Off"></toggle-switch>
<toggle-switch onLabel="Enabled" offLabel="Disabled"></toggle-switch>
<toggle-switch onLabel="Active" offLabel="Inactive"></toggle-switch>
<toggle-switch onLabel="Visible" offLabel="Hidden"></toggle-switch>
<toggle-switch onLabel="🔒 On" offLabel="🔓 Off"></toggle-switch>`,
      },
    },
  },
};
