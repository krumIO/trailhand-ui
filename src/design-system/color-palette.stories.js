import { html } from 'lit';
import '../styles/colors.css';

export default {
  title: 'Design System/Color Palette',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The TrailHand UI color palette provides a set of global color variables for consistent use across all components. This includes primary brand colors, greyscale shades, and semantic aliases for text, backgrounds, borders, and status indicators.',
      },
    },
  },
};

/**
 * Convert hex to RGB
 * @param {string} hex - Hex color value
 * @returns {string} RGB string
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Determine if text should be light or dark based on background
 * @param {string} hex - Hex color value
 * @returns {string} CSS variable for text color
 */
const getContrastText = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'var(--color-black)';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'var(--color-text-primary)' : 'var(--color-white)';
};

/**
 * Render a single color swatch
 */
const ColorSwatch = ({ name, variable, hex, description = '' }) => {
  const textColor = getContrastText(hex);
  const rgb = hexToRgb(hex);

  return html`
    <div style="
      display: flex;
      flex-direction: column;
      border: 1px solid var(--color-grey-200);
      border-radius: 8px;
      overflow: hidden;
      background: var(--color-white);
    ">
      <div style="
        background-color: var(${variable});
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${textColor};
        font-weight: 600;
        font-size: 14px;
      ">
        ${name}
      </div>
      <div style="
        padding: 12px;
        font-family: 'Nunito Sans', system-ui, sans-serif;
        font-size: 13px;
      ">
        <div style="
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        ">${variable}</div>
        <div style="
          color: var(--color-text-secondary);
          font-family: monospace;
          font-size: 12px;
        ">${hex}</div>
        <div style="
          color: var(--color-text-muted);
          font-family: monospace;
          font-size: 11px;
          margin-top: 2px;
        ">${rgb}</div>
        ${description ? html`<div style="
          color: var(--color-text-muted);
          font-size: 11px;
          margin-top: 6px;
          font-style: italic;
        ">${description}</div>` : ''}
      </div>
    </div>
  `;
};

/**
 * Render a section of colors
 */
const ColorSection = ({ title, colors }) => html`
  <div style="margin-bottom: 40px;">
    <h3 style="
      font-family: 'Nunito Sans', system-ui, sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--color-grey-200);
    ">${title}</h3>
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    ">
      ${colors.map(color => ColorSwatch(color))}
    </div>
  </div>
`;

/**
 * Full color palette display
 */
export const AllColors = {
  render: () => html`
    <div style="
      font-family: 'Nunito Sans', system-ui, sans-serif;
      padding: 20px;
      background: var(--color-grey-100);
    ">
      <h2 style="
        font-size: 24px;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 8px 0;
      ">TrailHand UI Color Palette</h2>
      <p style="
        color: var(--color-text-secondary);
        font-size: 14px;
        margin: 0 0 32px 0;
      ">Global color variables for consistent design across all components.</p>

      ${ColorSection({
        title: 'Primary',
        colors: [
          { name: 'Primary', variable: '--color-primary', hex: '#3d98d3', description: 'Main brand color' },
        ]
      })}

      ${ColorSection({
        title: 'Black + White',
        colors: [
          { name: 'Black', variable: '--color-black', hex: '#000000' },
          { name: 'White', variable: '--color-white', hex: '#FFFFFF' },
        ]
      })}

      ${ColorSection({
        title: 'Greyscale',
        colors: [
          { name: 'Grey 100', variable: '--color-grey-100', hex: '#FAFAFA' },
          { name: 'Grey 200', variable: '--color-grey-200', hex: '#EBEBEB' },
          { name: 'Grey 300', variable: '--color-grey-300', hex: '#D7D7D7' },
          { name: 'Grey 400', variable: '--color-grey-400', hex: '#BABABA' },
          { name: 'Grey 500', variable: '--color-grey-500', hex: '#8D8D8D' },
          { name: 'Grey 600', variable: '--color-grey-600', hex: '#636363' },
          { name: 'Grey 700', variable: '--color-grey-700', hex: '#303131' },
          { name: 'Grey 800', variable: '--color-grey-800', hex: '#212121' },
        ]
      })}

      ${ColorSection({
        title: 'Status Colors',
        colors: [
          { name: 'Red', variable: '--color-red', hex: '#9F3A3A', description: 'Error, danger' },
          { name: 'Green', variable: '--color-green', hex: '#30AC66', description: 'Success, positive' },
          { name: 'Yellow', variable: '--color-yellow', hex: '#D3C255', description: 'Warning, caution' },
        ]
      })}
    </div>
  `,
};

/**
 * Semantic aliases - showing how colors map to use cases
 */
export const SemanticAliases = {
  render: () => html`
    <div style="
      font-family: 'Nunito Sans', system-ui, sans-serif;
      padding: 20px;
      background: var(--color-grey-100);
    ">
      <h2 style="
        font-size: 24px;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 8px 0;
      ">Semantic Color Aliases</h2>
      <p style="
        color: var(--color-text-secondary);
        font-size: 14px;
        margin: 0 0 32px 0;
      ">Context-specific color variables that reference the base palette.</p>

      ${ColorSection({
        title: 'Text Colors',
        colors: [
          { name: 'Primary Text', variable: '--color-text-primary', hex: '#212121', description: 'Main body text' },
          { name: 'Secondary Text', variable: '--color-text-secondary', hex: '#636363', description: 'Supporting text' },
          { name: 'Muted Text', variable: '--color-text-muted', hex: '#8D8D8D', description: 'Disabled, placeholder' },
          { name: 'Inverse Text', variable: '--color-text-inverse', hex: '#FFFFFF', description: 'Text on dark backgrounds' },
        ]
      })}

      ${ColorSection({
        title: 'Background Colors',
        colors: [
          { name: 'Background', variable: '--color-background', hex: '#FFFFFF', description: 'Default background' },
          { name: 'Muted Background', variable: '--color-background-muted', hex: '#FAFAFA', description: 'Subtle background' },
          { name: 'Hover Background', variable: '--color-background-hover', hex: '#EBEBEB', description: 'Interactive hover state' },
        ]
      })}

      ${ColorSection({
        title: 'Border Colors',
        colors: [
          { name: 'Border', variable: '--color-border', hex: '#D7D7D7', description: 'Default borders' },
          { name: 'Light Border', variable: '--color-border-light', hex: '#EBEBEB', description: 'Subtle borders' },
        ]
      })}

      ${ColorSection({
        title: 'State Colors',
        colors: [
          { name: 'Error', variable: '--color-error', hex: '#9F3A3A', description: 'Error states' },
          { name: 'Success', variable: '--color-success', hex: '#30AC66', description: 'Success states' },
          { name: 'Warning', variable: '--color-warning', hex: '#D3C255', description: 'Warning states' },
          { name: 'Link', variable: '--color-link', hex: '#3d98d3', description: 'Interactive links' },
        ]
      })}
    </div>
  `,
};

/**
 * Usage examples
 */
export const UsageExamples = {
  render: () => html`
    <div style="
      font-family: 'Nunito Sans', system-ui, sans-serif;
      padding: 20px;
      background: var(--color-grey-100);
    ">
      <h2 style="
        font-size: 24px;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 8px 0;
      ">Usage Examples</h2>
      <p style="
        color: var(--color-text-secondary);
        font-size: 14px;
        margin: 0 0 32px 0;
      ">How to use color variables in your CSS and components.</p>

      <div style="
        background: var(--color-white);
        border: 1px solid var(--color-grey-200);
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 24px;
      ">
        <h3 style="
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 16px 0;
        ">Import the stylesheet</h3>
        <pre style="
          background: var(--color-grey-800);
          color: var(--color-grey-100);
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 13px;
          margin: 0;
        "><code>&lt;link rel="stylesheet" href="./src/styles/colors.css"&gt;

/* Or in JavaScript/TypeScript */
import './src/styles/colors.css';</code></pre>
      </div>

      <div style="
        background: var(--color-white);
        border: 1px solid var(--color-grey-200);
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 24px;
      ">
        <h3 style="
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 16px 0;
        ">Use in CSS</h3>
        <pre style="
          background: var(--color-grey-800);
          color: var(--color-grey-100);
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 13px;
          margin: 0;
        "><code>.my-button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-border);
}

.my-button:hover {
  background-color: var(--color-background-hover);
}

.error-message {
  color: var(--color-error);
}</code></pre>
      </div>

      <div style="
        background: var(--color-white);
        border: 1px solid var(--color-grey-200);
        border-radius: 8px;
        padding: 24px;
      ">
        <h3 style="
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 16px 0;
        ">With fallback values</h3>
        <pre style="
          background: var(--color-grey-800);
          color: var(--color-grey-100);
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 13px;
          margin: 0;
        "><code>/* Always provide fallbacks for robustness */
.my-component {
  color: var(--color-text-primary, #212121);
  background: var(--color-background, #FFFFFF);
}</code></pre>
      </div>
    </div>
  `,
};
