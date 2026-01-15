import { html, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import './button.css';

/**
 * Props for the Button component
 */
export interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string | null;
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: (e: Event) => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary,
  backgroundColor = null,
  size,
  label,
  onClick
}: ButtonProps): TemplateResult => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

  return html`
    <button
      type="button"
      class=${['storybook-button', `storybook-button--${size || 'medium'}`, mode].join(' ')}
      style=${styleMap({ backgroundColor })}
      @click=${onClick}
    >
      ${label}
    </button>
  `;
};
