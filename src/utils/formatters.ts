/**
 * Type definition for formatter functions
 */
export type FormatterFunction = (value: any) => string;

/**
 * Data table formatters for common column types
 */
export const dataTableFormatters: Record<string, FormatterFunction> = {
  /**
   * Format a date value as relative time (e.g., "5d", "3h", "15m")
   */
  age: (value: any): string => {
    if (!value) return '-';
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMins > 0) return `${diffMins}m`;
    return 'Just now';
  },

  /**
   * Format a date as a localized date string
   */
  date: (value: any): string => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
  },

  /**
   * Format a date as a localized date and time string
   */
  dateTime: (value: any): string => {
    if (!value) return '-';
    return new Date(value).toLocaleString();
  },

  /**
   * Format memory bytes to human readable format (B, KB, MB, GB, TB)
   */
  memory: (value: any): string => {
    if (!value || value === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let val = Number(value);
    let unitIndex = 0;

    while (val >= 1024 && unitIndex < units.length - 1) {
      val = val / 1024;
      unitIndex++;
    }

    return `${Math.round(val)} ${units[unitIndex]}`;
  },

  /**
   * Format millicpus value
   */
  milliCPUs: (value: any): string => {
    if (!value || value === 0) return '0';

    const formatted = Math.round(Number(value)).toString();
    return formatted === '0' ? '0' : formatted;
  },
};
