import './th-tag.ts';

/**
 * The ThTag component is a versatile tag/badge component for displaying
 * labels, statuses, categories, or chips.
 */
export default {
  title: 'Components/ThTag',
  tags: ['autodocs'],
  render: (args) => {
    const tag = document.createElement('th-tag');

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
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
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
      control: 'text',
      description: 'Iconify icon name to display before label',
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
- Multiple color variants (default, primary, success, warning, error, info)
- Three size options (sm, md, lg)
- Optional dismiss button with \`tag-dismiss\` event
- Optional icon support via Iconify
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
        code: '<th-tag label="Tag"></th-tag>',
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

    const variants = ['default', 'primary', 'success', 'warning', 'error', 'info'];

    variants.forEach((variant) => {
      const tag = document.createElement('th-tag');
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
        code: `<th-tag label="default" variant="default"></th-tag>
<th-tag label="primary" variant="primary"></th-tag>
<th-tag label="success" variant="success"></th-tag>
<th-tag label="warning" variant="warning"></th-tag>
<th-tag label="error" variant="error"></th-tag>
<th-tag label="info" variant="info"></th-tag>`,
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

    const variants = ['default', 'primary', 'success', 'warning', 'error', 'info'];

    variants.forEach((variant) => {
      const tag = document.createElement('th-tag');
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
        code: `<th-tag label="default" variant="default" outlined></th-tag>
<th-tag label="primary" variant="primary" outlined></th-tag>
<th-tag label="success" variant="success" outlined></th-tag>
<th-tag label="warning" variant="warning" outlined></th-tag>
<th-tag label="error" variant="error" outlined></th-tag>
<th-tag label="info" variant="info" outlined></th-tag>`,
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
      const tag = document.createElement('th-tag');
      tag.label = size;
      tag.variant = 'primary';
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
        code: `<th-tag label="sm" size="sm" variant="primary"></th-tag>
<th-tag label="md" size="md" variant="primary"></th-tag>
<th-tag label="lg" size="lg" variant="primary"></th-tag>`,
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
      const tag = document.createElement('th-tag');
      tag.label = name;
      tag.variant = 'primary';
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
        code: `<th-tag label="React" variant="primary" dismissible value="react"></th-tag>

<script>
  const tag = document.querySelector('th-tag');
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
      { label: 'Running', icon: 'heroicons:play-circle', variant: 'success' },
      { label: 'Stopped', icon: 'heroicons:stop-circle', variant: 'error' },
      { label: 'Pending', icon: 'heroicons:clock', variant: 'warning' },
      { label: 'Info', icon: 'heroicons:information-circle', variant: 'info' },
    ];

    items.forEach(({ label, icon, variant }) => {
      const tag = document.createElement('th-tag');
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
        story: 'Tags can include icons from Iconify for visual context.',
      },
      source: {
        code: `<th-tag label="Running" icon="heroicons:play-circle" variant="success"></th-tag>
<th-tag label="Stopped" icon="heroicons:stop-circle" variant="error"></th-tag>
<th-tag label="Pending" icon="heroicons:clock" variant="warning"></th-tag>`,
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

      const tag = document.createElement('th-tag');
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
        code: `<th-tag label="Active" variant="success" size="sm"></th-tag>
<th-tag label="Inactive" variant="default" size="sm"></th-tag>
<th-tag label="Pending" variant="warning" size="sm"></th-tag>
<th-tag label="Error" variant="error" size="sm"></th-tag>`,
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
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Used as a version badge next to titles.',
      },
      source: {
        code: '<th-tag label="v2.0.0" variant="primary"></th-tag>',
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

    const tag1 = document.createElement('th-tag');
    tag1.label = 'Enabled';
    tag1.variant = 'primary';

    const tag2 = document.createElement('th-tag');
    tag2.label = 'Disabled';
    tag2.variant = 'primary';
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
        code: `<th-tag label="Enabled" variant="primary"></th-tag>
<th-tag label="Disabled" variant="primary" disabled></th-tag>`,
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
      const tag = document.createElement('th-tag');
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
    },
  },
};
