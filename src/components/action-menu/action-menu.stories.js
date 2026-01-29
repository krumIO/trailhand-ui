import './action-menu.ts';

/**
 * The ActionMenu component provides a dropdown menu for contextual actions.
 * Typically used in table rows or cards to display available operations.
 */
export default {
  title: 'Components/ActionMenu',
  tags: ['autodocs'],
  render: (args) => {
    const menu = document.createElement('action-menu');

    if (args.actions) menu.actions = args.actions;
    if (args.resource) menu.resource = args.resource;
    if (args.disabled !== undefined) menu.disabled = args.disabled;

    menu.addEventListener('action-click', (e) => {
      console.log('Action clicked:', e.detail);
    });

    return menu;
  },
  argTypes: {
    actions: {
      control: 'object',
      description:
        'Array of action objects with label, action, enabled, visible, danger, and divider properties',
    },
    resource: {
      control: 'object',
      description: 'The resource object passed to action handlers',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the menu button is disabled',
      defaultValue: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A dropdown action menu component for displaying contextual actions.

**Features:**
- Configurable actions with labels and handlers
- Conditional visibility and enabled state
- Support for danger/destructive actions
- Dividers for grouping actions
- Automatic click-outside handling
- Custom event dispatching
        `.trim(),
      },
    },
  },
};

/**
 * Default action menu with basic actions
 */
export const Default = {
  args: {
    actions: [
      {
        label: 'Edit',
        action: (resource) => console.log('Edit:', resource),
      },
      {
        label: 'Duplicate',
        action: (resource) => console.log('Duplicate:', resource),
      },
      {
        label: 'Delete',
        action: (resource) => console.log('Delete:', resource),
        danger: true,
      },
    ],
    resource: { id: 1, name: 'Sample Item' },
  },
  parameters: {
    docs: {
      source: {
        code: `<action-menu></action-menu>

<script>
  const menu = document.querySelector('action-menu');
  menu.actions = [
    { label: 'Edit', action: (resource) => console.log('Edit:', resource) },
    { label: 'Duplicate', action: (resource) => console.log('Duplicate:', resource) },
    { label: 'Delete', action: (resource) => console.log('Delete:', resource), danger: true }
  ];
  menu.resource = { id: 1, name: 'Sample Item' };
</script>`,
      },
    },
  },
};

/**
 * Action menu with dividers for grouping
 */
export const WithDividers = {
  args: {
    actions: [
      {
        label: 'View Details',
        action: (resource) => console.log('View:', resource),
      },
      {
        label: 'Edit',
        action: (resource) => console.log('Edit:', resource),
      },
      {
        divider: true,
      },
      {
        label: 'Share',
        action: (resource) => console.log('Share:', resource),
      },
      {
        label: 'Export',
        action: (resource) => console.log('Export:', resource),
      },
      {
        divider: true,
      },
      {
        label: 'Archive',
        action: (resource) => console.log('Archive:', resource),
      },
      {
        label: 'Delete',
        action: (resource) => console.log('Delete:', resource),
        danger: true,
      },
    ],
    resource: { id: 2, name: 'Project Alpha' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use dividers to group related actions for better organization.',
      },
    },
  },
};

/**
 * Action menu with conditional visibility
 */
export const ConditionalVisibility = {
  args: {
    actions: [
      {
        label: 'Edit',
        action: (resource) => console.log('Edit:', resource),
        visible: (resource) => resource.canEdit,
      },
      {
        label: 'Publish',
        action: (resource) => console.log('Publish:', resource),
        visible: (resource) => resource.status === 'draft',
      },
      {
        label: 'Unpublish',
        action: (resource) => console.log('Unpublish:', resource),
        visible: (resource) => resource.status === 'published',
      },
      {
        label: 'Delete',
        action: (resource) => console.log('Delete:', resource),
        danger: true,
        visible: (resource) => resource.canDelete,
      },
    ],
    resource: {
      id: 3,
      name: 'Blog Post',
      status: 'draft',
      canEdit: true,
      canDelete: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Actions can be conditionally shown/hidden based on the resource state.',
      },
    },
  },
};

/**
 * Action menu with disabled actions
 */
export const DisabledActions = {
  args: {
    actions: [
      {
        label: 'Edit',
        action: (resource) => console.log('Edit:', resource),
        enabled: (resource) => resource.isEditable,
      },
      {
        label: 'Share',
        action: (resource) => console.log('Share:', resource),
        enabled: false,
      },
      {
        label: 'Download',
        action: (resource) => console.log('Download:', resource),
      },
      {
        label: 'Delete',
        action: (resource) => console.log('Delete:', resource),
        danger: true,
        enabled: (resource) => resource.isDeletable,
      },
    ],
    resource: {
      id: 4,
      name: 'Document',
      isEditable: false,
      isDeletable: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Actions can be disabled based on conditions or static configuration.',
      },
    },
  },
};

/**
 * Disabled menu button
 */
export const DisabledMenu = {
  args: {
    actions: [
      {
        label: 'Edit',
        action: (resource) => console.log('Edit:', resource),
      },
      {
        label: 'Delete',
        action: (resource) => console.log('Delete:', resource),
        danger: true,
      },
    ],
    resource: { id: 5, name: 'Locked Item' },
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The entire menu can be disabled when actions are not available.',
      },
    },
  },
};

/**
 * Empty action menu
 */
export const EmptyMenu = {
  args: {
    actions: [],
    resource: { id: 6, name: 'No Actions Item' },
  },
  parameters: {
    docs: {
      description: {
        story: 'When no actions are available, an empty state is shown.',
      },
    },
  },
};

/**
 * In a table row context
 */
export const InTableContext = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText =
      'border: 1px solid var(--color-border, #D7D7D7); border-radius: 4px; overflow: hidden;';

    const table = document.createElement('table');
    table.style.cssText =
      'width: 100%; border-collapse: collapse; background: var(--color-white, #FFFFFF);';

    const thead = document.createElement('thead');
    thead.style.cssText = 'background: var(--color-grey-100, #FAFAFA);';
    thead.innerHTML = `
      <tr>
        <th style="padding: 12px; text-align: left; font-weight: 600;">Name</th>
        <th style="padding: 12px; text-align: left; font-weight: 600;">Status</th>
        <th style="padding: 12px; text-align: left; font-weight: 600;">Created</th>
        <th style="padding: 12px; width: 40px;"></th>
      </tr>
    `;

    const tbody = document.createElement('tbody');

    const items = [
      { id: 1, name: 'Project Alpha', status: 'Active', created: '2024-01-15' },
      { id: 2, name: 'Project Beta', status: 'Draft', created: '2024-02-20' },
      {
        id: 3,
        name: 'Project Gamma',
        status: 'Archived',
        created: '2024-03-10',
      },
    ];

    items.forEach((item, index) => {
      const row = document.createElement('tr');
      row.style.cssText = 'border-top: 1px solid var(--color-border, #D7D7D7);';

      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding: 12px;';
      nameCell.textContent = item.name;

      const statusCell = document.createElement('td');
      statusCell.style.cssText = 'padding: 12px;';
      statusCell.textContent = item.status;

      const createdCell = document.createElement('td');
      createdCell.style.cssText = 'padding: 12px;';
      createdCell.textContent = item.created;

      const actionCell = document.createElement('td');
      actionCell.style.cssText = 'padding: 8px; text-align: center;';

      const menu = document.createElement('action-menu');
      menu.resource = item;
      menu.actions = [
        {
          label: 'Edit',
          action: (resource) => alert(`Edit: ${resource.name}`),
        },
        {
          label: 'Duplicate',
          action: (resource) => alert(`Duplicate: ${resource.name}`),
        },
        {
          divider: true,
        },
        {
          label: 'Archive',
          action: (resource) => alert(`Archive: ${resource.name}`),
          visible: (resource) => resource.status !== 'Archived',
        },
        {
          label: 'Delete',
          action: (resource) => alert(`Delete: ${resource.name}`),
          danger: true,
        },
      ];

      actionCell.appendChild(menu);
      row.appendChild(nameCell);
      row.appendChild(statusCell);
      row.appendChild(createdCell);
      row.appendChild(actionCell);
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    return container;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of ActionMenu used in a table row, showing typical usage with row data.',
      },
    },
  },
};
