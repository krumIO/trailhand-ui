import './th-card.ts';
import '../button/button.ts';

export default {
  title: 'Components/ThCard',
  tags: ['autodocs'],
  render: (args) => {
    const card = document.createElement('trailhand-card');

    if (args.variant) card.variant = args.variant;
    if (args.dismissible !== undefined) card.dismissible = args.dismissible;
    if (args.clickable !== undefined) card.clickable = args.clickable;
    if (args.href) card.href = args.href;
    if (args.target) card.target = args.target;
    if (args.cardId) card.cardId = args.cardId;
    if (args.cardTitle) card.cardTitle = args.cardTitle;
    if (args.subtitle) card.subtitle = args.subtitle;
    if (args.description) card.description = args.description;
    if (args.iconSrc) card.iconSrc = args.iconSrc;
    if (args.iconName) card.iconName = args.iconName;
    if (args.loading !== undefined) card.loading = args.loading;

    card.addEventListener('card-dismiss', (e) => console.log('card-dismiss', e.detail));
    card.addEventListener('card-click', () => console.log('card-click'));

    return card;
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'outlined'],
      description: 'Visual style variant',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the card can be dismissed',
    },
    clickable: {
      control: 'boolean',
      description: 'Makes the card clickable (emits card-click event)',
    },
    href: {
      control: 'text',
      description: 'URL to navigate to (renders as anchor tag)',
    },
    target: {
      control: 'select',
      options: ['', '_self', '_blank'],
      description: 'Anchor target when href is set',
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
      description: 'Card subtitle text',
    },
    description: {
      control: 'text',
      description: 'Card body/description text',
    },
    iconSrc: {
      control: 'text',
      description: 'Icon image URL',
    },
    iconName: {
      control: 'select',
      options: ['', 'bug', 'error', 'pause', 'play', 'close', 'globe', 'home', 'user'],
      description: 'Icon name for trailhand-icon',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A flexible card component for displaying content.

**Features:**
- Variants: default, info, outlined
- Dismissible with \`card-dismiss\` event
- Clickable with \`card-click\` event or \`href\` for links
- Icon options: icon-name, icon-src, or slot
- Loading state
- Slots: title, subtitle, description, action, footer
        `.trim(),
      },
    },
  },
};

export const Default = {
  args: {
    cardTitle: 'Card Title',
    description: 'This is a card description.',
  },
  parameters: {
    docs: {
      source: {
        code: `<trailhand-card
  card-title="Card Title"
  description="This is a card description.">
</trailhand-card>`,
      },
    },
  },
};

export const InfoCards = {
  args: {
    dismissible: true,
  },
  argTypes: {
    dismissible: {
      control: 'boolean',
      description: 'Whether the cards can be dismissed',
    },
    iconName: {
      control: 'select',
      options: ['user', 'bug', 'error', 'pause', 'play', 'close', 'globe', 'home'],
      description: 'Icon name for the right card',
    },
  },
  render: (args) => {
    const container = document.createElement('div');
    container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;';

    const cardImage = document.createElement('trailhand-card');
    cardImage.variant = 'info';
    cardImage.cardTitle = 'Get Started';
    cardImage.subtitle = 'New to Epinio? Get started now!';
    cardImage.iconSrc = './stories/assets/accessibility.svg';
    cardImage.dismissible = args.dismissible;
    cardImage.cardId = 'get-started';

    const cardIcon = document.createElement('trailhand-card');
    cardIcon.variant = 'info';
    cardIcon.cardTitle = 'Welcome Back';
    cardIcon.subtitle = 'You have 3 new notifications';
    cardIcon.iconName = args.iconName || 'user';
    cardIcon.dismissible = args.dismissible;
    cardIcon.cardId = 'welcome-back';

    container.appendChild(cardImage);
    container.appendChild(cardIcon);

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Info cards using `icon-src` (image) vs `icon-name` (trailhand-icon).',
      },
      source: {
        code: `<trailhand-card
  variant="info"
  card-title="Get Started"
  subtitle="New to Epinio? Get started now!"
  icon-src="./icon.svg"
  dismissible
  card-id="get-started">
</trailhand-card>

<trailhand-card
  variant="info"
  card-title="Welcome Back"
  subtitle="You have 3 new notifications"
  icon-name="user"
  dismissible
  card-id="welcome-back">
</trailhand-card>`,
      },
    },
  },
};

export const Clickable = {
  args: {
    cardTitle: 'Clickable Card',
    description: 'Click anywhere on this card to trigger the card-click event.',
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Cards with `clickable` attribute emit a `card-click` event when clicked.',
      },
      source: {
        code: `<trailhand-card
  card-title="Clickable Card"
  description="Click anywhere on this card."
  clickable>
</trailhand-card>`,
      },
    },
  },
};

export const LinkCard = {
  args: {
    cardTitle: 'Link Card',
    description: 'This card navigates to a URL when clicked.',
    href: 'https://example.com',
    target: '_blank',
  },
  parameters: {
    docs: {
      description: {
        story: 'Cards with `href` render as anchor tags and navigate on click.',
      },
      source: {
        code: `<trailhand-card
  card-title="Link Card"
  description="This card navigates to a URL."
  href="https://example.com"
  target="_blank">
</trailhand-card>`,
      },
    },
  },
};

export const ResourceCard = {
  render: () => {
    const card = document.createElement('trailhand-card');
    card.cardTitle = 'Namespaces';
    card.description = 'Namespaces group your applications, services and other resources.';
    card.iconName = 'globe';

    const actionSlot = document.createElement('trailhand-button');
    actionSlot.slot = 'action';
    actionSlot.variant = 'primary';
    actionSlot.textContent = 'Create Namespace';
    card.appendChild(actionSlot);

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
        story: 'A resource card with action button and footer content.',
      },
      source: {
        code: `<trailhand-card
  card-title="Namespaces"
  description="Namespaces group your applications, services and other resources."
  icon-name="globe">
  <trailhand-button slot="action" variant="primary">
    Create Namespace
  </trailhand-button>
  <div slot="footer">
    <h4>New Namespaces</h4>
    <ul>
      <li>test-workspace</li>
      <li>test-workspace-2</li>
      <li>test-workspace-3</li>
    </ul>
  </div>
</trailhand-card>`,
      },
    },
  },
};

export const Loading = {
  args: {
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Cards show a spinner when in loading state.',
      },
      source: {
        code: '<trailhand-card loading></trailhand-card>',
      },
    },
  },
};

export const Outlined = {
  args: {
    variant: 'outlined',
    cardTitle: 'Outlined Card',
    description: 'This card has a border outline style.',
  },
  parameters: {
    docs: {
      source: {
        code: `<trailhand-card
  variant="outlined"
  card-title="Outlined Card"
  description="This card has a border outline style.">
</trailhand-card>`,
      },
    },
  },
};

export const Dismissible = {
  render: () => {
    const card = document.createElement('trailhand-card');
    card.cardTitle = 'Dismissible Card';
    card.description = 'Click the X to dismiss this card.';
    card.dismissible = true;
    card.cardId = 'demo-dismiss';

    card.addEventListener('card-dismiss', () => card.remove());

    return card;
  },
  parameters: {
    docs: {
      description: {
        story: 'Cards can be dismissed by clicking the X button.',
      },
      source: {
        code: `<trailhand-card
  card-title="Dismissible Card"
  description="Click the X to dismiss this card."
  dismissible
  card-id="demo-dismiss">
</trailhand-card>

<script>
  document.querySelector('trailhand-card')
    .addEventListener('card-dismiss', (e) => {
      e.target.remove();
    });
</script>`,
      },
    },
  },
};
