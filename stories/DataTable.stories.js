import '../Components/data-table.ts';
import { dataTableFormatters } from '../Components/data-table.ts';

/**
 * The DataTable component is a feature-rich table with sorting, filtering, and pagination.
 * Perfect for displaying large datasets with powerful data manipulation capabilities.
 */
export default {
  title: 'Components/DataTable',
  tags: ['autodocs'],
  render: (args) => {
    const table = document.createElement('data-table');

    if (args.columns) table.columns = args.columns;
    if (args.rows) table.rows = args.rows;
    if (args.rowsPerPage !== undefined) table.rowsPerPage = args.rowsPerPage;
    if (args.searchable !== undefined) table.searchable = args.searchable;
    if (args.sortable !== undefined) table.sortable = args.sortable;
    if (args.paginated !== undefined) table.paginated = args.paginated;
    if (args.loading !== undefined) table.loading = args.loading;
    if (args.keyField) table.keyField = args.keyField;
    if (args.rowActions !== undefined) table.rowActions = args.rowActions;
    if (args.rowActionsWidth !== undefined) table.rowActionsWidth = args.rowActionsWidth;
    if (args.emptyMessage) table.emptyMessage = args.emptyMessage;
    if (args.noResultsMessage) table.noResultsMessage = args.noResultsMessage;

    return table;
  },
  argTypes: {
    columns: {
      control: 'object',
      description: 'Array of column definitions with field, label, width, sortable, searchable, and formatter',
    },
    rows: {
      control: 'object',
      description: 'Array of row data objects',
    },
    rowsPerPage: {
      control: 'number',
      description: 'Number of rows to display per page',
      defaultValue: 10,
    },
    searchable: {
      control: 'boolean',
      description: 'Enable/disable search functionality',
      defaultValue: true,
    },
    sortable: {
      control: 'boolean',
      description: 'Enable/disable column sorting',
      defaultValue: true,
    },
    paginated: {
      control: 'boolean',
      description: 'Enable/disable pagination',
      defaultValue: true,
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
      defaultValue: false,
    },
    keyField: {
      control: 'text',
      description: 'Field to use as unique key for rows',
      defaultValue: 'id',
    },
    rowActions: {
      control: 'boolean',
      description: 'Show row actions column',
      defaultValue: true,
    },
    rowActionsWidth: {
      control: 'number',
      description: 'Width of row actions column in pixels',
      defaultValue: 40,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A feature-rich data table component with sorting, filtering, and pagination.

**Features:**
- Search/filter across all columns
- Column sorting (ascending/descending)
- Pagination with configurable page size
- Custom cell rendering via slots
- Built-in formatters (age, date, dateTime)
- Row actions with ActionMenu integration
- Loading state
- Empty state
- Nested object support with dot notation
- Fully customizable with CSS variables
        `.trim(),
      },
    },
  },
};

// Sample data for stories
const sampleUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', createdAt: '2024-01-15T10:30:00Z' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active', createdAt: '2024-02-20T14:20:00Z' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Inactive', createdAt: '2024-03-10T09:15:00Z' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'Active', createdAt: '2024-04-05T16:45:00Z' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'User', status: 'Active', createdAt: '2024-05-12T11:00:00Z' },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'Admin', status: 'Active', createdAt: '2024-06-18T08:30:00Z' },
  { id: 7, name: 'George Miller', email: 'george@example.com', role: 'User', status: 'Inactive', createdAt: '2024-07-22T13:20:00Z' },
  { id: 8, name: 'Hannah Baker', email: 'hannah@example.com', role: 'Editor', status: 'Active', createdAt: '2024-08-30T10:10:00Z' },
  { id: 9, name: 'Ivan Drago', email: 'ivan@example.com', role: 'User', status: 'Active', createdAt: '2024-09-14T15:55:00Z' },
  { id: 10, name: 'Julia Roberts', email: 'julia@example.com', role: 'User', status: 'Inactive', createdAt: '2024-10-01T12:40:00Z' },
  { id: 11, name: 'Kevin Hart', email: 'kevin@example.com', role: 'Editor', status: 'Active', createdAt: '2024-10-15T09:25:00Z' },
  { id: 12, name: 'Laura Palmer', email: 'laura@example.com', role: 'Admin', status: 'Active', createdAt: '2024-11-02T14:00:00Z' },
];

const userColumns = [
  { field: 'name', label: 'Name', width: '200px' },
  { field: 'email', label: 'Email', width: '220px' },
  { field: 'role', label: 'Role', width: '120px' },
  { field: 'status', label: 'Status', width: '100px' },
  { field: 'createdAt', label: 'Created', width: '150px', formatter: 'dateTime' },
];

/**
 * Default data table with all features enabled
 */
export const Default = {
  args: {
    columns: userColumns,
    rows: sampleUsers,
    rowsPerPage: 5,
  },
  parameters: {
    docs: {
      source: {
        code: `<data-table></data-table>

<script>
  const table = document.querySelector('data-table');

  table.columns = [
    { field: 'name', label: 'Name', width: '200px' },
    { field: 'email', label: 'Email', width: '220px' },
    { field: 'role', label: 'Role', width: '120px' },
    { field: 'status', label: 'Status', width: '100px' },
    { field: 'createdAt', label: 'Created', width: '150px', formatter: 'dateTime' },
  ];

  table.rows = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', createdAt: '2024-01-15T10:30:00Z' },
    // ... more rows
  ];
</script>`,
      },
    },
  },
};

/**
 * Loading state
 */
export const Loading = {
  args: {
    columns: userColumns,
    rows: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Display a loading spinner while data is being fetched.',
      },
    },
  },
};

/**
 * Empty state
 */
export const Empty = {
  args: {
    columns: userColumns,
    rows: [],
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Display an empty state when no data is available.',
      },
    },
  },
};

/**
 * Without search
 */
export const WithoutSearch = {
  args: {
    columns: userColumns,
    rows: sampleUsers,
    searchable: false,
    rowsPerPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disable the search functionality.',
      },
    },
  },
};

/**
 * Without sorting
 */
export const WithoutSorting = {
  args: {
    columns: userColumns,
    rows: sampleUsers,
    sortable: false,
    rowsPerPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disable column sorting.',
      },
    },
  },
};

/**
 * Without pagination
 */
export const WithoutPagination = {
  args: {
    columns: userColumns,
    rows: sampleUsers.slice(0, 5),
    paginated: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Display all rows without pagination.',
      },
    },
  },
};

/**
 * Without row actions
 */
export const WithoutRowActions = {
  args: {
    columns: userColumns,
    rows: sampleUsers,
    rowActions: false,
    rowsPerPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hide the row actions column.',
      },
    },
  },
};

/**
 * Custom formatters
 */
export const WithFormatters = {
  args: {
    columns: [
      { field: 'name', label: 'Name', width: '200px' },
      { field: 'email', label: 'Email', width: '220px' },
      { field: 'role', label: 'Role', width: '120px' },
      { field: 'createdAt', label: 'Age', width: '100px', formatter: 'age' },
      { field: 'createdAt', label: 'Date', width: '120px', formatter: 'date' },
    ],
    rows: sampleUsers,
    rowsPerPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use built-in formatters like "age", "date", and "dateTime" to format cell values.',
      },
    },
  },
};

/**
 * Non-sortable columns
 */
export const NonSortableColumns = {
  args: {
    columns: [
      { field: 'name', label: 'Name', width: '200px' },
      { field: 'email', label: 'Email', width: '220px', sortable: false },
      { field: 'role', label: 'Role', width: '120px' },
      { field: 'status', label: 'Status', width: '100px', sortable: false },
      { field: 'createdAt', label: 'Created', width: '150px', formatter: 'dateTime' },
    ],
    rows: sampleUsers,
    rowsPerPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Make specific columns non-sortable by setting sortable: false.',
      },
    },
  },
};

/**
 * Non-searchable columns
 */
export const NonSearchableColumns = {
  args: {
    columns: [
      { field: 'name', label: 'Name', width: '200px' },
      { field: 'email', label: 'Email', width: '220px', searchable: false },
      { field: 'role', label: 'Role', width: '120px' },
      { field: 'status', label: 'Status', width: '100px' },
      { field: 'createdAt', label: 'Created', width: '150px', formatter: 'dateTime', searchable: false },
    ],
    rows: sampleUsers,
    rowsPerPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Exclude specific columns from search by setting searchable: false. Try searching for an email - it won\'t match.',
      },
    },
  },
};

/**
 * Nested object data
 */
export const NestedObjectData = {
  args: {
    columns: [
      { field: 'name', label: 'Name', width: '200px' },
      { field: 'contact.email', label: 'Email', width: '220px' },
      { field: 'contact.phone', label: 'Phone', width: '150px' },
      { field: 'metadata.department', label: 'Department', width: '150px' },
    ],
    rows: [
      {
        id: 1,
        name: 'Alice Johnson',
        contact: { email: 'alice@example.com', phone: '555-0101' },
        metadata: { department: 'Engineering' }
      },
      {
        id: 2,
        name: 'Bob Smith',
        contact: { email: 'bob@example.com', phone: '555-0102' },
        metadata: { department: 'Marketing' }
      },
      {
        id: 3,
        name: 'Charlie Brown',
        contact: { email: 'charlie@example.com', phone: '555-0103' },
        metadata: { department: 'Sales' }
      },
    ],
    rowsPerPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Access nested object properties using dot notation (e.g., "contact.email").',
      },
    },
  },
};

/**
 * Custom row actions
 */
export const CustomRowActions = {
  render: () => {
    const table = document.createElement('data-table');
    table.columns = userColumns;
    table.rows = sampleUsers.slice(0, 5);
    table.rowActions = true;

    // Use Shadow DOM piercing to add custom action menus
    setTimeout(() => {
      const actionMenus = table.shadowRoot.querySelectorAll('action-menu');
      actionMenus.forEach((menu) => {
        menu.actions = [
          {
            label: 'View Details',
            action: (resource) => alert(`View: ${resource.name}`),
          },
          {
            label: 'Edit',
            action: (resource) => alert(`Edit: ${resource.name}`),
          },
          {
            divider: true,
          },
          {
            label: 'Deactivate',
            action: (resource) => alert(`Deactivate: ${resource.name}`),
            visible: (resource) => resource.status === 'Active',
          },
          {
            label: 'Activate',
            action: (resource) => alert(`Activate: ${resource.name}`),
            visible: (resource) => resource.status === 'Inactive',
          },
          {
            divider: true,
          },
          {
            label: 'Delete',
            action: (resource) => alert(`Delete: ${resource.name}`),
            danger: true,
          },
        ];
      });
    }, 0);

    return table;
  },
  parameters: {
    docs: {
      description: {
        story: 'Customize row actions by accessing the action-menu elements and setting their actions property.',
      },
    },
  },
};

/**
 * Large dataset
 */
export const LargeDataset = {
  args: {
    columns: userColumns,
    rows: Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Admin', 'User', 'Editor'][i % 3],
      status: ['Active', 'Inactive'][i % 2],
      createdAt: new Date(2024, 0, 1 + (i % 30), 10 + (i % 12), i % 60).toISOString(),
    })),
    rowsPerPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'The DataTable efficiently handles large datasets with pagination.',
      },
    },
  },
};

/**
 * Custom page size
 */
export const CustomPageSize = {
  args: {
    columns: userColumns,
    rows: sampleUsers,
    rowsPerPage: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Configure the number of rows per page with the rowsPerPage property.',
      },
    },
  },
};

/**
 * Minimal table
 */
export const Minimal = {
  args: {
    columns: [
      { field: 'name', label: 'Name' },
      { field: 'email', label: 'Email' },
    ],
    rows: sampleUsers.slice(0, 5),
    searchable: false,
    sortable: false,
    paginated: false,
    rowActions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal table with all extra features disabled.',
      },
    },
  },
};
