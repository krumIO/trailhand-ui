import './th-form-card.ts';
import '../button/button.ts';
import '../text-input/text-input.ts';

export default {
  title: 'Components/ThFormCard',
  tags: ['autodocs'],
  render: (args) => {
    const card = document.createElement('trailhand-form-card');

    if (args.cardTitle) card.cardTitle = args.cardTitle;
    if (args.badge) card.badge = args.badge;
    if (args.columns !== undefined) card.columns = args.columns;
    if (args.shadow !== undefined) card.shadow = args.shadow;
    if (args.dismissible !== undefined) card.dismissible = args.dismissible;
    if (args.cardId) card.cardId = args.cardId;
    if (args.loading !== undefined) card.loading = args.loading;
    if (args.buttonLabel) card.buttonLabel = args.buttonLabel;
    if (args.buttonVariant) card.buttonVariant = args.buttonVariant;
    if (args.buttonDisabled !== undefined) card.buttonDisabled = args.buttonDisabled;
    if (args.cancelLabel) card.cancelLabel = args.cancelLabel;

    card.addEventListener('form-card-submit', () => console.log('form-card-submit'));
    card.addEventListener('form-card-cancel', () => console.log('form-card-cancel'));
    card.addEventListener('card-dismiss', (e) => console.log('card-dismiss', e.detail));

    return card;
  },
  argTypes: {
    cardTitle: {
      control: 'text',
      description: 'Title text displayed in the card header',
    },
    badge: {
      control: 'text',
      description: 'Small colored label displayed next to the title',
    },
    columns: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Number of columns for the form content grid',
    },
    shadow: {
      control: 'boolean',
      description: 'Whether to show a box shadow',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the card shows a dismiss (X) button',
    },
    cardId: {
      control: 'text',
      description: 'Identifier passed in the card-dismiss event detail',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner and hides content',
    },
    buttonLabel: {
      control: 'text',
      description: 'Primary action button label. Leave empty to hide built-in actions.',
    },
    buttonVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'alternate', 'destructive', 'confirmation'],
      description: 'Variant of the primary action button',
    },
    buttonDisabled: {
      control: 'boolean',
      description: 'Disables the primary action button',
    },
    cancelLabel: {
      control: 'text',
      description: 'Cancel button label',
    },
  },
  args: {
    cardTitle: 'Form Card',
    badge: '',
    columns: 1,
    shadow: true,
    dismissible: false,
    loading: false,
    buttonLabel: 'Save',
    buttonVariant: 'primary',
    buttonDisabled: false,
    cancelLabel: 'Cancel',
  },
};

export const Default = {
  args: {
    cardTitle: 'Settings',
    badge: '',
    columns: 1,
    shadow: true,
    buttonLabel: 'Save',
    cancelLabel: 'Cancel',
  },
  render: (args) => {
    const card = document.createElement('trailhand-form-card');
    card.cardTitle = args.cardTitle;
    card.columns = args.columns;
    card.shadow = args.shadow;
    card.buttonLabel = args.buttonLabel;
    card.cancelLabel = args.cancelLabel;

    const input = document.createElement('trailhand-text-input');
    input.setAttribute('label', 'Name');
    input.setAttribute('placeholder', 'Enter a name');
    card.appendChild(input);

    return card;
  },
};

export const MultiColumnWithBadge = {
  args: {
    cardTitle: 'Configuration',
    badge: 'test-option',
    columns: 3,
    shadow: true,
    dismissible: true,
    buttonLabel: '',
  },
  render: (args) => {
    const card = document.createElement('trailhand-form-card');
    card.cardTitle = args.cardTitle;
    card.badge = args.badge;
    card.columns = args.columns;
    card.shadow = args.shadow;
    card.dismissible = args.dismissible;

    ['Namespace', 'Name', 'Instances'].forEach((label, i) => {
      const input = document.createElement('trailhand-text-input');
      input.setAttribute('label', label);
      input.setAttribute('placeholder', i === 0 ? 'Create New Namespace' : i === 2 ? '1' : 'Test');
      card.appendChild(input);
    });

    return card;
  },
};

export const WithActionsButtons = {
  args: {
    cardTitle: 'Instances',
    badge: 'Create New',
    columns: 2,
    shadow: true,
    dismissible: true,
    buttonLabel: 'Create',
    cancelLabel: 'Cancel',
  },
  render: (args) => {
    const card = document.createElement('trailhand-form-card');
    card.cardTitle = args.cardTitle;
    card.badge = args.badge;
    card.columns = args.columns;
    card.shadow = args.shadow;
    card.dismissible = args.dismissible;
    card.buttonLabel = args.buttonLabel;
    card.cancelLabel = args.cancelLabel;

    const namespace = document.createElement('trailhand-text-input');
    namespace.setAttribute('label', 'Namespace');
    namespace.setAttribute('placeholder', 'Create New Namespace');

    const name = document.createElement('trailhand-text-input');
    name.setAttribute('label', 'Name');
    name.setAttribute('placeholder', 'A Unique Name');

    card.appendChild(namespace);
    card.appendChild(name);

    card.addEventListener('form-card-submit', () => console.log('form-card-submit'));
    card.addEventListener('form-card-cancel', () => console.log('form-card-cancel'));

    return card;
  },
};

export const Loading = {
  args: {
    cardTitle: 'Loading Form',
    shadow: true,
    loading: true,
    buttonLabel: '',
  },
};

export const CustomActionsSlot = {
  render: () => {
    const card = document.createElement('trailhand-form-card');
    card.cardTitle = 'Custom Actions';
    card.shadow = true;
    card.columns = 1;

    const input = document.createElement('trailhand-text-input');
    input.setAttribute('label', 'Field');
    input.setAttribute('placeholder', 'Enter value');
    card.appendChild(input);

    const actionsWrapper = document.createElement('div');
    actionsWrapper.setAttribute('slot', 'actions');
    actionsWrapper.style.display = 'flex';
    actionsWrapper.style.gap = '8px';

    const btn1 = document.createElement('trailhand-button');
    btn1.setAttribute('variant', 'alternate');
    btn1.textContent = 'Read From File';

    const btn2 = document.createElement('trailhand-button');
    btn2.setAttribute('variant', 'secondary');
    btn2.textContent = 'Add';

    actionsWrapper.appendChild(btn1);
    actionsWrapper.appendChild(btn2);
    card.appendChild(actionsWrapper);

    return card;
  },
};
