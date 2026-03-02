import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * A progress bar component that displays a filled bar with a fraction and percentage label.
 *
 * @example
 * ```html
 * <trailhand-progress-bar label="Running" value="1" total="2"></trailhand-progress-bar>
 * ```
 */
export class ProgressBar extends LitElement {
  /**
   * Optional label displayed above the bar on the left
   */
  @property({ type: String })
  label = '';

  /**
   * Current progress value
   */
  @property({ type: Number })
  value = 0;

  /**
   * Total/maximum value
   */
  @property({ type: Number })
  total = 100;

  private get _percent(): number {
    if (this.total <= 0) return 0;
    return Math.min(Math.round((this.value / this.total) * 100), 100);
  }

  static override styles = css`
    :host {
      display: block;
      font-family: var(--font-family, 'Poppins', sans-serif);
    }

    .progress-bar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: var(--th-progress-bar-font-size, 14px);
    }

    .progress-bar__title {
      font-weight: 600;
      color: var(
        --th-progress-bar-title-color,
        var(--th-color-text-primary, #212121)
      );
    }

    .progress-bar__stats {
      color: var(
        --th-progress-bar-label-color,
        var(--th-color-text-secondary, #636363)
      );
    }

    .progress-bar__track {
      width: 100%;
      height: var(--th-progress-bar-height, 8px);
      background-color: var(
        --th-progress-bar-track-color,
        var(--th-color-grey-200, #ebebeb)
      );
      border-radius: var(--th-progress-bar-border-radius, 4px);
      overflow: hidden;
    }

    .progress-bar__fill {
      height: 100%;
      background-color: var(
        --th-progress-bar-fill-color,
        var(--th-color-primary, #3d98d3)
      );
      border-radius: var(--th-progress-bar-border-radius, 4px);
      transition: width 0.3s ease;
    }
  `;

  override render(): TemplateResult {
    return html`
      <div role="progressbar"
        aria-valuenow=${this.value}
        aria-valuemin=${0}
        aria-valuemax=${this.total}
        aria-label=${this.label || nothing}
      >
        <div class="progress-bar__header">
          ${this.label
            ? html`<span class="progress-bar__title">${this.label}</span>`
            : nothing}
          <span class="progress-bar__stats">
            ${this.value} of ${this.total} / ${this._percent}%
          </span>
        </div>
        <div class="progress-bar__track">
          <div
            class="progress-bar__fill"
            style="width: ${this._percent}%"
          ></div>
        </div>
      </div>
    `;
  }
}

customElements.define('trailhand-progress-bar', ProgressBar);
