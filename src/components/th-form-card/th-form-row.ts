import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * A section row within a `trailhand-form-card`. Provides an optional title
 * and a configurable CSS-grid for its form fields.
 *
 * @slot - Default slot for form fields, laid out in a grid based on the `columns` prop
 */
export class ThFormRow extends LitElement {
  /** Optional section title displayed above the field grid */
  @property({ type: String }) title = '';

  /** Number of equal-width columns for this row's field grid */
  @property({ type: Number }) columns = 1;

  static override styles = css`
    :host {
      display: block;
    }

    .form-row {
      display: flex;
      flex-direction: column;
      gap: var(--th-form-row-gap, 8px);
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .form-row__title {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--th-form-row-title-color, #111827);
    }

    .form-row__content {
      display: grid;
      grid-template-columns: repeat(var(--_columns), 1fr);
      gap: var(--th-form-row-field-gap, 16px);
    }
  `;

  override render(): TemplateResult {
    return html`
      <div class="form-row" part="row">
        ${this.title
          ? html`<p class="form-row__title" part="title">${this.title}</p>`
          : nothing}
        <div class="form-row__content" part="content" style="--_columns: ${this.columns}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('trailhand-form-row', ThFormRow);
