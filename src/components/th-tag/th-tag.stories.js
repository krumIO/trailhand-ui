import './th-tag.ts';

/**
 * The ThTag component is a versatile tag/badge component for displaying
 * labels, statuses, categories, or chips.
 */
export default {
  title: 'Components/ThTag',
  tags: ['autodocs'],
  render: (args) => {
    const tag = document.createElement('trailhand-tag');

    if (args.label) tag.label = args.label;
    if (args.variant) tag.variant = args.variant;
    if (args.size) tag.size = args.size;
    if (args.dismissible !== undefined) tag.dismissible = args.dismissible;
    if (args.disabled !== undefined) tag.disabled = args.disabled;
    if (args.icon) tag.icon = args.icon;
    if (args.value) tag.value = args.value;
    if (args.outlined !== undefined) tag.outlined = args.outlined;

    tag.addEventListener('tag-dismiss', (e) => {
      console.log('Tag dismissed:', e.detail);
    });

    return tag;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The text content of the tag',
      defaultValue: 'Tag',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Visual style variant',
      defaultValue: 'default',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tag',
      defaultValue: 'md',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the tag can be dismissed',
      defaultValue: false,
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tag is disabled',
      defaultValue: false,
    },
    outlined: {
      control: 'boolean',
      description: 'Use outlined style instead of filled',
      defaultValue: false,
    },
    icon: {
      control: 'select',
      options: ['', 'bug', 'error', 'pause', 'play', 'close', 'globe', 'home', 'user'],
      description: 'trailhand-icon name to display before label',
    },
    value: {
      control: 'text',
      description: 'Value passed in dismiss event',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A tag/badge component for displaying labels, statuses, or categories.

**Features:**
- Multiple color variants (default, success, warning, error, info)
- Three size options (sm, md, lg)
- Optional dismiss button with \`tag-dismiss\` event
- Optional icon support via trailhand-icon (Font Awesome)
- CSS custom properties for theming
- Accessible with proper ARIA attributes
        `.trim(),
      },
    },
  },
};

/**
 * Default tag with basic styling
 */
export const Default = {
  args: {
    label: 'Tag',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      source: {
        code: '<trailhand-tag label="Tag"></trailhand-tag>',
      },
    },
  },
};

/**
 * All color variants
 */
export const Variants = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

    const variants = ['default', 'success', 'warning', 'error', 'info'];

    variants.forEach((variant) => {
      const tag = document.createElement('trailhand-tag');
      tag.label = variant;
      tag.variant = variant;
      container.appendChild(tag);
    });

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'All available color variants for different use cases.',
      },
      source: {
        code: `
          <trailhand-tag label="default" variant="default"></trailhand-tag>
          <trailhand-tag label="success" variant="success"></trailhand-tag>
          <trailhand-tag label="warning" variant="warning"></trailhand-tag>
          <trailhand-tag label="error" variant="error"></trailhand-tag>
          <trailhand-tag label="info" variant="info"></trailhand-tag>`,
      },
    },
  },
};

/**
 * Outlined variants
 */
export const Outlined = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

    const variants = ['default', 'success', 'warning', 'error', 'info'];

    variants.forEach((variant) => {
      const tag = document.createElement('trailhand-tag');
      tag.label = variant;
      tag.variant = variant;
      tag.outlined = true;
      container.appendChild(tag);
    });

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Outlined style for a lighter, border-only appearance.',
      },
      source: {
        code: `
          <trailhand-tag label="default" variant="default" outlined></trailhand-tag>
          <trailhand-tag label="success" variant="success" outlined></trailhand-tag>
          <trailhand-tag label="warning" variant="warning" outlined></trailhand-tag>
          <trailhand-tag label="error" variant="error" outlined></trailhand-tag>
          <trailhand-tag label="info" variant="info" outlined></trailhand-tag>`,
      },
    },
  },
};

/**
 * Size variations
 */
export const Sizes = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 8px; align-items: center;';

    const sizes = ['sm', 'md', 'lg'];

    sizes.forEach((size) => {
      const tag = document.createElement('trailhand-tag');
      tag.label = size;
      tag.variant = 'info';
      tag.size = size;
      container.appendChild(tag);
    });

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags come in three sizes to fit different contexts.',
      },
      source: {
        code: `
          <trailhand-tag label="sm" size="sm" variant="info"></trailhand-tag>
          <trailhand-tag label="md" size="md" variant="info"></trailhand-tag>
          <trailhand-tag label="lg" size="lg" variant="info"></trailhand-tag>`,
      },
    },
  },
};

/**
 * Dismissible tags
 */
export const Dismissible = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

    const tags = ['React', 'Vue', 'Angular', 'Svelte', 'Lit'];

    tags.forEach((name) => {
      const tag = document.createElement('trailhand-tag');
      tag.label = name;
      tag.variant = 'info';
      tag.dismissible = true;
      tag.value = name.toLowerCase();

      tag.addEventListener('tag-dismiss', (e) => {
        console.log('Dismissed:', e.detail.value);
        tag.remove();
      });

      container.appendChild(tag);
    });

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags can be dismissible, useful for filter chips or selected items.',
      },
      source: {
        code: `<trailhand-tag label="React" variant="info" dismissible value="react"></trailhand-tag>

<script>
  const tag = document.querySelector('trailhand-tag');
  tag.addEventListener('tag-dismiss', (e) => {
    console.log('Dismissed:', e.detail.value);
    tag.remove();
  });
</script>`,
      },
    },
  },
};

/**
 * Tags with icons
 */
export const WithIcons = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

    const items = [
      { label: 'Running', icon: 'play', variant: 'success' },
      { label: 'Paused', icon: 'pause', variant: 'default' },
      { label: 'Bug', icon: 'bug', variant: 'error' },
      { label: 'Warning', icon: 'error', variant: 'warning' },
      { label: 'Global', icon: 'globe', variant: 'info' },
    ];

    items.forEach(({ label, icon, variant }) => {
      const tag = document.createElement('trailhand-tag');
      tag.label = label;
      tag.icon = icon;
      tag.variant = variant;
      container.appendChild(tag);
    });

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags can include icons using the trailhand-icon component.',
      },
      source: {
        code: `
        <trailhand-tag label="Running" icon="play" variant="success"></trailhand-tag>
        <trailhand-tag label="Paused" icon="pause" variant="default"></trailhand-tag>
        <trailhand-tag label="Bug" icon="bug" variant="error"></trailhand-tag>
        <trailhand-tag label="Warning" icon="error" variant="warning"></trailhand-tag>
        <trailhand-tag label="Global" icon="globe" variant="info"></trailhand-tag>`,
      },
    },
  },
};

/**
 * Status indicators
 */
export const StatusIndicators = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

    const statuses = [
      { label: 'Active', variant: 'success' },
      { label: 'Inactive', variant: 'default' },
      { label: 'Pending', variant: 'warning' },
      { label: 'Error', variant: 'error' },
      { label: 'Processing', variant: 'info' },
    ];

    statuses.forEach(({ label, variant }) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; gap: 12px;';

      const text = document.createElement('span');
      text.textContent = `User Status: `;
      text.style.minWidth = '120px';

      const tag = document.createElement('trailhand-tag');
      tag.label = label;
      tag.variant = variant;
      tag.size = 'sm';

      row.appendChild(text);
      row.appendChild(tag);
      container.appendChild(row);
    });

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Common pattern: using tags as status indicators.',
      },
      source: {
        code: `<trailhand-tag label="Active" variant="success" size="sm"></trailhand-tag>
<trailhand-tag label="Inactive" variant="default" size="sm"></trailhand-tag>
<trailhand-tag label="Pending" variant="warning" size="sm"></trailhand-tag>
<trailhand-tag label="Error" variant="error" size="sm"></trailhand-tag>`,
      },
    },
  },
};

/**
 * Version badge (like in the mockup)
 */
export const VersionBadge = {
  args: {
    label: 'v2.0.0',
    variant: 'info',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Used as a version badge next to titles.',
      },
      source: {
        code: '<trailhand-tag label="v2.0.0" variant="info"></trailhand-tag>',
      },
    },
  },
};

/**
 * Disabled state
 */
export const Disabled = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 8px;';

    const tag1 = document.createElement('trailhand-tag');
    tag1.label = 'Enabled';
    tag1.variant = 'info';

    const tag2 = document.createElement('trailhand-tag');
    tag2.label = 'Disabled';
    tag2.variant = 'info';
    tag2.disabled = true;

    container.appendChild(tag1);
    container.appendChild(tag2);

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags can be disabled for visual reference without interaction.',
      },
      source: {
        code: `<trailhand-tag label="Enabled" variant="info"></trailhand-tag>
<trailhand-tag label="Disabled" variant="info" disabled></trailhand-tag>`,
      },
    },
  },
};

/**
 * Filter chips example
 */
export const FilterChips = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

    const header = document.createElement('div');
    header.textContent = 'Active Filters:';
    header.style.fontWeight = '500';

    const chipsContainer = document.createElement('div');
    chipsContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

    const filters = ['Status: Running', 'Namespace: production', 'Type: Service'];

    filters.forEach((filter) => {
      const tag = document.createElement('trailhand-tag');
      tag.label = filter;
      tag.variant = 'default';
      tag.dismissible = true;

      tag.addEventListener('tag-dismiss', () => {
        tag.remove();
        if (chipsContainer.children.length === 0) {
          const empty = document.createElement('span');
          empty.textContent = 'No filters active';
          empty.style.color = '#666';
          chipsContainer.appendChild(empty);
        }
      });

      chipsContainer.appendChild(tag);
    });

    container.appendChild(header);
    container.appendChild(chipsContainer);

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Dismissible tags work great as filter chips.',
      },
      source: {
        code: `<trailhand-tag label="Status: Running" variant="default" dismissible></trailhand-tag>
<trailhand-tag label="Namespace: production" variant="default" dismissible></trailhand-tag>
<trailhand-tag label="Type: Service" variant="default" dismissible></trailhand-tag>`,
      },
    },
  },
};
