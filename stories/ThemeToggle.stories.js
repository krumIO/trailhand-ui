import '../Components/theme-toggle.js';

/**
 * The ThemeToggle component allows users to switch between light and dark themes.
 * It uses CSS media queries for system preference detection and allows users to
 * override with their own preference, which is saved to localStorage.
 */
export default {
  title: 'Components/ThemeToggle',
  tags: ['autodocs'],
  render: (args) => {
    const toggle = document.createElement('theme-toggle');

    // Apply properties from args
    if (args.onLabel) toggle.onLabel = args.onLabel;
    if (args.offLabel) toggle.offLabel = args.offLabel;

    // Add theme change listener for Storybook actions
    toggle.addEventListener('theme-changed', (e) => {
      console.log('Theme changed to:', e.detail.theme);
    });

    return toggle;
  },
  argTypes: {
    onLabel: {
      control: 'text',
      description: 'Label shown when toggle is on (dark mode)',
      defaultValue: 'Dark',
    },
    offLabel: {
      control: 'text',
      description: 'Label shown when toggle is off (light mode)',
      defaultValue: 'Light',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The ThemeToggle component provides a switch to toggle between light and dark themes.

**How it works:**
- By default, your CSS uses system preference via \`@media (prefers-color-scheme: dark)\`
- When user toggles, it adds \`.theme-light\` or \`.theme-dark\` class to body
- The body class overrides the media query (higher CSS specificity)
- User preference is saved to localStorage
- On reload, saved preference is restored; otherwise system preference is used

**Features:**
- System color scheme detection via CSS media queries
- Manual override with localStorage persistence
- Dispatches custom 'theme-changed' events
- Only applies body class - no data attributes
- Fully customizable labels

**CSS Setup Example:**
\`\`\`css
/* Default light mode */
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

/* System dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
  }
}

/* User override classes (higher specificity) */
body.theme-light {
  --bg-color: #ffffff;
  --text-color: #000000;
}

body.theme-dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}
\`\`\`
        `.trim(),
      },
    },
  },
};

/**
 * Default theme toggle with standard labels
 */
export const Default = {
  args: {
    onLabel: 'Dark',
    offLabel: 'Light',
  },
};

/**
 * Theme toggle with custom labels
 */
export const CustomLabels = {
  args: {
    onLabel: '🌙 Night',
    offLabel: '☀️ Day',
  },
  parameters: {
    docs: {
      description: {
        story: 'You can customize the labels to use icons or different text.',
      },
    },
  },
};

/**
 * Theme toggle with minimal labels
 */
export const MinimalLabels = {
  args: {
    onLabel: '🌙',
    offLabel: '☀️',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icons-only version for a more compact appearance.',
      },
    },
  },
};

/**
 * Interactive demo showing theme in action
 */
export const InteractiveDemo = {
  args: {
    onLabel: 'Dark',
    offLabel: 'Light',
  },
  render: (args) => {
    const container = document.createElement('div');

    const toggle = document.createElement('theme-toggle');
    if (args.onLabel) toggle.onLabel = args.onLabel;
    if (args.offLabel) toggle.offLabel = args.offLabel;

    // Create demo content
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;';
    header.innerHTML = '<h2 style="margin: 0;">Theme Toggle Demo</h2>';
    header.appendChild(toggle);

    const intro = document.createElement('p');
    intro.textContent = 'Toggle the switch to see the theme change in real-time. Notice how the background, text, and card colors all update smoothly.';

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
      // Add enhanced theme styles for this demo only
      const style = document.createElement('style');
      style.textContent = `
        /* Default light mode colors */
        :root {
          --demo-bg: #ffffff;
          --demo-text: #333333;
          --demo-card-bg: #f5f5f5;
          --demo-border: #e0e0e0;
        }

        /* System dark mode preference */
        @media (prefers-color-scheme: dark) {
          :root {
            --demo-bg: #121212;
            --demo-text: #e0e0e0;
            --demo-card-bg: #1e1e1e;
            --demo-border: #333333;
          }
        }

        /* User override: light theme */
        body.theme-light {
          --demo-bg: #ffffff !important;
          --demo-text: #333333 !important;
          --demo-card-bg: #f5f5f5 !important;
          --demo-border: #e0e0e0 !important;
        }

        /* User override: dark theme */
        body.theme-dark {
          --demo-bg: #121212 !important;
          --demo-text: #e0e0e0 !important;
          --demo-card-bg: #1e1e1e !important;
          --demo-border: #333333 !important;
        }

        /* Apply background to body only */
        body {
          background-color: var(--demo-bg) !important;
          transition: background-color 0.3s ease !important;
        }

        /* Style demo cards with background, border, and text */
        .theme-demo-card {
          background-color: var(--demo-card-bg) !important;
          border: 1px solid var(--demo-border) !important;
          color: var(--demo-text) !important;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        /* Apply text color to all content in the story */
        #storybook-root,
        #storybook-root *:not(theme-toggle):not(theme-toggle *) {
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
        story: 'An interactive demo showing the theme toggle with styled content. Toggle the switch to see all colors update in real-time.',
      },
    },
  },
};

/**
 * Demonstrating system preference detection
 */
export const SystemPreference = {
  args: {
    onLabel: 'Dark',
    offLabel: 'Light',
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how the component uses your system's color scheme preference.

**How it works:**
1. Your CSS defines colors using \`@media (prefers-color-scheme: dark)\`
2. The toggle only adds a body class when the user explicitly chooses a theme
3. Without a saved preference, the system preference naturally applies via CSS
4. When user toggles, localStorage saves their choice and body class overrides system preference

**To test:**
1. Clear localStorage: \`localStorage.removeItem('user-theme-preference')\`
2. Remove body class: \`document.body.classList.remove('theme-dark', 'theme-light')\`
3. Your system preference will apply automatically via CSS media query
4. Toggle the switch to override with your preference
        `.trim(),
      },
    },
  },
  decorators: [
    (story) => {
      // Show current system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('user-theme-preference');
      const container = document.createElement('div');
      container.innerHTML = `
        <div style="margin-bottom: 16px; padding: 12px; background: #f0f0f0; border-radius: 4px;">
          <p style="margin: 0 0 8px 0;">
            <strong>System preference:</strong> ${prefersDark ? 'Dark' : 'Light'} mode
          </p>
          <p style="margin: 0;">
            <strong>Saved preference:</strong> ${savedTheme || 'None (using system)'}
          </p>
        </div>
      `;
      container.appendChild(story());
      return container;
    },
  ],
};
