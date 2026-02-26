import './progress-bar.ts';

/**
 * A progress bar that displays a filled track with a label, fraction, and percentage.
 */
export default {
  title: 'Components/ProgressBar',
  tags: ['autodocs'],
  render: (args) => {
    const bar = document.createElement('trailhand-progress-bar');

    if (args.label) bar.label = args.label;
    if (args.value !== undefined) bar.value = args.value;
    if (args.total !== undefined) bar.total = args.total;

    return bar;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label displayed above the bar',
    },
    value: {
      control: 'number',
      description: 'Current progress value',
      defaultValue: 0,
    },
    total: {
      control: 'number',
      description: 'Total / maximum value',
      defaultValue: 100,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A progress bar component that visually fills based on a value/total ratio and displays the fraction alongside a percentage.

**Features:**
- Optional label displayed inline with stats
- Shows fraction (e.g. "5 of 10") and percentage
- Fully themeable via CSS custom properties
- Accessible with \`role="progressbar"\` and ARIA attributes
        `.trim(),
      },
    },
  },
};

/**
 * Default progress bar at 50%
 */
export const Default = {
  args: {
    label: 'Running',
    value: 50,
    total: 100,
  },
  parameters: {
    docs: {
      source: {
        code: '<trailhand-progress-bar label="Running" value="50" total="100"></trailhand-progress-bar>',
      },
    },
  },
};

/**
 * Low / partial progress
 */
export const Partial = {
  args: {
    label: 'Deployed',
    value: 3,
    total: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'A progress bar with low completion.',
      },
      source: {
        code: '<trailhand-progress-bar label="Deployed" value="3" total="20"></trailhand-progress-bar>',
      },
    },
  },
};

/**
 * Fully complete
 */
export const Complete = {
  args: {
    label: 'Complete',
    value: 10,
    total: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'A fully filled progress bar at 100%.',
      },
      source: {
        code: '<trailhand-progress-bar label="Complete" value="10" total="10"></trailhand-progress-bar>',
      },
    },
  },
};

/**
 * Empty / zero progress
 */
export const Empty = {
  args: {
    label: 'Pending',
    value: 0,
    total: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'An empty progress bar with no completion.',
      },
      source: {
        code: '<trailhand-progress-bar label="Pending" value="0" total="10"></trailhand-progress-bar>',
      },
    },
  },
};

/**
 * Custom total value
 */
export const CustomValues = {
  args: {
    label: 'Running',
    value: 7,
    total: 12,
  },
  parameters: {
    docs: {
      description: {
        story: 'A progress bar with a non-100 total to show fraction display.',
      },
      source: {
        code: '<trailhand-progress-bar label="Running" value="7" total="12"></trailhand-progress-bar>',
      },
    },
  },
};

/**
 * Without label
 */
export const WithoutLabel = {
  args: {
    value: 5,
    total: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'A progress bar without a label — stats are right-aligned.',
      },
      source: {
        code: '<trailhand-progress-bar value="5" total="10"></trailhand-progress-bar>',
      },
    },
  },
};
