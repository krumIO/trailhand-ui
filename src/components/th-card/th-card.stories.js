import './th-card.ts';

/**
 * The ThCard component is a flexible container for displaying content
 * in a visually distinct box.
 */
export default {
  title: 'Components/ThCard',
  tags: ['autodocs'],
  render: (args) => {
    const card = document.createElement('th-card');

    if (args.variant) card.variant = args.variant;
    if (args.dismissible !== undefined) card.dismissible = args.dismissible;
    if (args.cardId) card.cardId = args.cardId;
    if (args.cardTitle) card.cardTitle = args.cardTitle;
    if (args.subtitle) card.subtitle = args.subtitle;
    if (args.description) card.description = args.description;
    if (args.iconClass) card.iconClass = args.iconClass;
    if (args.iconSrc) card.iconSrc = args.iconSrc;
    if (args.loading !== undefined) card.loading = args.loading;

    card.addEventListener('card-dismiss', (e) => {
      console.log('Card dismissed:', e.detail);
    });

    return card;
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'outlined'],
      description: 'Visual style variant',
      defaultValue: 'default',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the card can be dismissed',
      defaultValue: false,
    },
    cardId: {
      control: 'text',
      description: 'Unique identifier for the card',
    },
    cardTitle: {
      control: 'text',
      description: 'Card title text',
    },
    subtitle: {
      control: 'text',
      description: 'Card subtitle text (info variant)',
    },
    description: {
      control: 'text',
      description: 'Card body/description text',
    },
    iconClass: {
      control: 'text',
      description: 'Icon class name (e.g., "icon-namespace")',
    },
    iconSrc: {
      control: 'text',
      description: 'Icon image URL',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
      defaultValue: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A flexible card component for displaying content in a contained box.

**Features:**
- Multiple variants (default, info, outlined)
- Dismissible with \`card-dismiss\` event
- Multiple icon options (class, URL, or slot)
- Loading state with spinner
- Slots for title, subtitle, body, action, and footer
- CSS custom properties for theming
        `.trim(),
      },
    },
  },
};

/**
 * Default card with basic content
 */
export const Default = {
  args: {
    cardTitle: 'Card Title',
    description: 'This is a card description. Cards can contain various types of content.',
  },
  parameters: {
    docs: {
      source: {
        code: `<th-card
  card-title="Card Title"
  description="This is a card description.">
</th-card>`,
      },
    },
  },
};

/**
 * Resource card (like in the dashboard mockup)
 */
export const ResourceCard = {
  render: () => {
    const card = document.createElement('th-card');
    card.cardTitle = 'Namespaces';
    card.description = 'Namespaces group your applications, services and other resources.';
    card.iconClass = 'icon-namespace';

    // Add action button
    const actionSlot = document.createElement('a');
    actionSlot.slot = 'action';
    actionSlot.href = '#';
    actionSlot.className = 'btn-primary';
    actionSlot.textContent = 'Create Namespace';
    actionSlot.style.cssText = `
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
    `;
    card.appendChild(actionSlot);

    // Add footer content
    const footer = document.createElement('div');
    footer.slot = 'footer';
    footer.innerHTML = `
      <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">New Namespaces</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">test-workspace</li>
        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">test-workspace-2</li>
        <li style="padding: 8px 0;">test-workspace-3</li>
      </ul>
    `;
    card.appendChild(footer);

    return card;
  },
  parameters: {
    docs: {
      description: {
        story: 'A resource card like those shown on the Epinio dashboard.',
      },
    },
  },
};

/**
 * Info card variant (dismissible notification style)
 */
export const InfoCard = {
  render: () => {
    const card = document.createElement('th-card');
    card.variant = 'info';
    card.cardTitle = 'Get Started';
    card.subtitle = 'New to Epinio? Get started now!';
    card.iconSrc = './stories/assets/accessibility.svg';
    card.dismissible = true;
    card.cardId = 'get-started';

    card.addEventListener('card-dismiss', () => {
      card.remove();
    });

    return card;
  },
  parameters: {
    docs: {
      description: {
        story: 'Info cards are compact, horizontal cards perfect for announcements or quick actions.',
      },
      source: {
        code: `<th-card
  variant="info"
  card-title="Get Started"
  subtitle="New to Epinio? Get started now!"
  icon-src="icon.png"
  dismissible
  card-id="get-started">
</th-card>`,
      },
    },
  },
};

/**
 * Applications card with progress indicator
 */
export const ApplicationsCard = {
  render: () => {
    const card = document.createElement('th-card');
    card.cardTitle = 'Applications';
    card.description = 'Epinio uses Applications to transition your code, through build, to being deployed.';
    card.iconClass = 'icon-application';

    // Add action button
    const actionSlot = document.createElement('a');
    actionSlot.slot = 'action';
    actionSlot.href = '#';
    actionSlot.style.cssText = `
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
    `;
    actionSlot.textContent = 'Deploy Application';
    card.appendChild(actionSlot);

    // Add footer with progress bar
    const footer = document.createElement('div');
    footer.slot = 'footer';
    footer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 500;">Running</span>
        <span style="color: #6b7280;">1 of 2 / 50%</span>
      </div>
      <div style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
        <div style="width: 50%; height: 100%; background: #3b82f6;"></div>
      </div>
    `;
    card.appendChild(footer);

    return card;
  },
  parameters: {
    docs: {
      description: {
        story: 'Applications card showing deployment progress.',
      },
    },
  },
};

/**
 * Services card with quick start links
 */
export const ServicesCard = {
  render: () => {
    const card = document.createElement('th-card');
    card.cardTitle = 'Services';
    card.description = 'Create instances of your services. Instances can be bound to your Applications to provide data.';
    card.iconClass = 'icon-service';

    // Add action button
    const actionSlot = document.createElement('a');
    actionSlot.slot = 'action';
    actionSlot.href = '#';
    actionSlot.style.cssText = `
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
    `;
    actionSlot.textContent = 'Create Instance';
    card.appendChild(actionSlot);

    // Add footer with service links
    const footer = document.createElement('div');
    footer.slot = 'footer';
    footer.innerHTML = `
      <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Quick Start With</h4>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <a href="#" style="display: flex; justify-content: space-between; align-items: center; color: #3b82f6; text-decoration: none; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
          test-workspace
          <span>+</span>
        </a>
        <a href="#" style="display: flex; justify-content: space-between; align-items: center; color: #3b82f6; text-decoration: none; padding: 8px 0;">
          test-workspace-2
          <span>+</span>
        </a>
      </div>
    `;
    card.appendChild(footer);

    return card;
  },
  parameters: {
    docs: {
      description: {
        story: 'Services card with quick start links.',
      },
    },
  },
};

/**
 * Loading state
 */
export const Loading = {
  args: {
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Cards can show a loading spinner while content is being fetched.',
      },
      source: {
        code: '<th-card loading></th-card>',
      },
    },
  },
};

/**
 * Outlined variant
 */
export const Outlined = {
  args: {
    variant: 'outlined',
    cardTitle: 'Outlined Card',
    description: 'This card has a border outline style.',
  },
  parameters: {
    docs: {
      source: {
        code: `<th-card variant="outlined" card-title="Outlined Card">
  Content here
</th-card>`,
      },
    },
  },
};

/**
 * Dismissible card
 */
export const Dismissible = {
  render: () => {
    const container = document.createElement('div');

    const card = document.createElement('th-card');
    card.cardTitle = 'Dismissible Card';
    card.description = 'Click the X to dismiss this card.';
    card.dismissible = true;
    card.cardId = 'demo-dismiss';

    card.addEventListener('card-dismiss', (e) => {
      console.log('Dismissed:', e.detail.id);
      card.remove();
    });

    container.appendChild(card);
    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Default cards can also be dismissible.',
      },
    },
  },
};

/**
 * With icon slot
 */
export const WithIconSlot = {
  render: () => {
    const card = document.createElement('th-card');
    card.cardTitle = 'Custom Icon';
    card.description = 'Using a slot for a custom icon.';

    const iconSlot = document.createElement('span');
    iconSlot.slot = 'icon';
    iconSlot.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
    `;
    card.appendChild(iconSlot);

    return card;
  },
  parameters: {
    docs: {
      description: {
        story: 'You can pass a custom icon using the icon slot.',
      },
    },
  },
};
