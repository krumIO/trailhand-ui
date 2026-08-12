import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './pagination';
import { PaginationProps } from './pagination';
import { expect, userEvent } from 'storybook/test';

const meta: Meta<PaginationProps> = {
  title: 'Components/Pagination',
  component: 'trailhand-pagination',
  tags: ['autodocs'],

  argTypes: {
    currentPage: {
      control: { type: 'number' },
      description: 'The current page number (1-indexed)',
    },
    totalPages: {
      control: { type: 'number' },
      description: 'Total number of pages',
    },
    startItem: {
      control: { type: 'number' },
      description: 'First item index shown on the current page',
    },
    endItem: {
      control: { type: 'number' },
      description: 'Last item index shown on the current page',
    },
    totalItems: {
      control: { type: 'number' },
      description: 'Total number of items across all pages',
    },
    showInfo: {
      control: { type: 'boolean' },
      description: 'Whether to show the item range information',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether both pagination buttons are disabled',
    },
  },

  args: {
    currentPage: 1,
    totalPages: 10,
    startItem: 1,
    endItem: 10,
    totalItems: 100,
    showInfo: true,
    disabled: false,
  },

  render: (args) => html`
    <trailhand-pagination
      .currentPage=${args.currentPage}
      .totalPages=${args.totalPages}
      .startItem=${args.startItem}
      .endItem=${args.endItem}
      .totalItems=${args.totalItems}
      ?show-info=${args.showInfo}
      ?disabled=${args.disabled}
    ></trailhand-pagination>
  `,
};

export default meta;
type Story = StoryObj<PaginationProps>;

export const Default: Story = {};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    startItem: 41,
    endItem: 50,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    startItem: 91,
    endItem: 100,
  },
};

export const WithoutInfo: Story = {
  args: {
    currentPage: 3,
    startItem: 21,
    endItem: 30,
    showInfo: false,
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 5,
    startItem: 41,
    endItem: 50,
    disabled: true,
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    startItem: 1,
    endItem: 10,
    totalItems: 10,
  },
};

export const PartialLastPage: Story = {
  args: {
    currentPage: 8,
    totalPages: 8,
    startItem: 71,
    endItem: 76,
    totalItems: 76,
  },
};

export const HandlePageChange: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },

  render: (args) => html`
    <trailhand-pagination
      .currentPage=${args.currentPage}
      .totalPages=${args.totalPages}
      .startItem=${args.startItem}
      .endItem=${args.endItem}
      .totalItems=${args.totalItems}
      ?show-info=${args.showInfo}
      ?disabled=${args.disabled}
      @page-change=${(e: CustomEvent) => {
        console.log('Page changed:', e.detail.page);
      }}
    ></trailhand-pagination>
  `,

  play: async ({ canvasElement }) => {
    const pagination = canvasElement.querySelector(
      'trailhand-pagination',
    );

    if (!pagination) {
      throw new Error('Pagination not found');
    }

    const nextButton = pagination.shadowRoot?.querySelector(
      'button[aria-label="Next page"]',
    );

    if (!nextButton) {
      throw new Error('Next button not found');
    }

    await userEvent.click(nextButton);

    await expect(nextButton).toBeEnabled();
  },
};