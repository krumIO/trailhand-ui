import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../icon/icon';

export type DockPin = 'bottom' | 'left' | 'right';

export interface DockTab {
  id: string;
  label: string;
  icon?: string;
  closable?: boolean;
}

export interface DockProps {
  open: boolean;
  pin: DockPin;
  tabs: DockTab[];
  activeTab: string | null;
  height: number;
  width: number;
}

/**
 * A tabbed, resizable, pinnable dock panel (bottom/left/right), for things
 * like live log streams or an interactive terminal that must keep running
 * while hidden behind another tab.
 *
 * Project each tab's content into the slot named `tab:<tabId>`. The consumer
 * is responsible for keying its own child content by tab id (e.g. Vue's
 * `:key`) so it isn't recreated on re-render, trailhand-dock guarantees the
 * slot itself stays stable across tab switches, but that guarantee only
 * holds end to end if the consumer doesn't destroy its own node either.
 *
 * @slot tab:<tabId> - Content for the tab with the matching id.
 *
 * @fires dock-open - Dock opened (first tab added, or opened externally).
 * @fires dock-close - Dock closed (last tab removed, or closed externally).
 * @fires dock-tab-switch - detail: { id }, active tab changed.
 * @fires dock-tab-close - detail: { id }, a tab was closed.
 * @fires dock-resize - detail: { width, height }, fires live during a resize.
 * @fires dock-pin-change - detail: { pin }, pin position changed.
 */
export class Dock extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String, reflect: true })
  pin: DockPin = 'bottom';

  @property({ type: Array, attribute: false })
  tabs: DockTab[] = [];

  @property({ type: String, reflect: true, attribute: 'active-tab' })
  activeTab: string | null = null;

  /** Height in px, used when pin === 'bottom'. */
  @property({ type: Number })
  height = 300;

  /** Width in px, used when pin !== 'bottom'. */
  @property({ type: Number })
  width = 400;

  private _dragStart: { pointerCoord: number; startSize: number } | null = null;

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-family, 'Poppins', sans-serif);
      --_tab-height: var(--th-dock-tab-height, 29px);
      --_tabs-bg: var(--th-dock-tabs-bg, #dcdee7);
      --_tab-active-bg: var(--th-dock-tab-active-bg, #f4f5fa);
      --_body-bg: var(--th-dock-body-bg, #f4f5fa);
      --_border-color: var(--th-dock-border, #dcdee7);
      --_radius: var(--th-dock-radius, 4px);
      --_text-color: var(--th-color-text-primary, #000000);
    }

    :host(:not([open])) {
      display: none;
    }

    :host([pin='left']) .dock,
    :host([pin='right']) .dock {
      height: 100%;
      flex-direction: row;
    }

    :host([pin='right']) .dock {
      border-left: 1px solid var(--_border-color);
    }

    :host([pin='left']) .dock {
      border-right: 1px solid var(--_border-color);
    }

    .dock__resizer {
      flex-shrink: 0;
      height: 4px;
      cursor: ns-resize;
      background: transparent;
    }

    :host([pin='left']) .dock__resizer,
    :host([pin='right']) .dock__resizer {
      height: auto;
      width: 4px;
      cursor: ew-resize;
    }

    /* Handle renders first in markup, correct for bottom/right pins. Left
       needs it after the body so it lands on the page-facing edge. */
    :host([pin='left']) .dock__resizer {
      order: 1;
    }

    .dock__resizer:hover,
    .dock__resizer:focus-visible {
      background: var(--th-color-primary, #3d98d3);
      outline: none;
    }

    .dock {
      display: flex;
      flex-direction: column;
      border-radius: var(--_radius);
      background: var(--_body-bg);
      color: var(--_text-color);
      overflow: hidden;
    }

    .dock__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }

    .dock__tabs {
      display: flex;
      align-items: stretch;
      flex-shrink: 0;
      height: var(--_tab-height);
      background: var(--_tabs-bg);
      border-top: 1px solid var(--_border-color);
      border-bottom: 1px solid var(--_border-color);
      overflow-x: auto;
    }

    .dock__tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 10px;
      border-right: 1px solid var(--_border-color);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      font-size: 13px;
    }

    .dock__tab--active {
      background: var(--_tab-active-bg);
    }

    .dock__tab-active-icon {
      color: var(--th-color-primary, #3d98d3);
    }

    .dock__tab:focus-visible {
      outline: 2px solid var(--th-color-primary, #3d98d3);
      outline-offset: -2px;
    }

    .dock__tab-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      margin-left: 4px;
      padding: 0;
      border: 1px solid var(--_text-color);
      border-radius: var(--_radius);
      background: none;
      cursor: pointer;
      color: inherit;
      font-size: 9px;
    }

    .dock__tab-close:hover {
      border-color: var(--th-color-primary, #3d98d3);
      color: var(--th-color-primary, #3d98d3);
    }

    .dock__panels {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .dock__panel {
      height: 100%;
      overflow: auto;
    }

    .dock__panel[hidden] {
      display: none;
    }

    /* Intentionally no transitions anywhere in this component, the docking
       chrome it's replacing (Rancher Shell's WindowManager) has none, and
       open/close/resize should stay instant for behavioral parity. */

    :host-context([data-theme='dark']) {
      --_tabs-bg: var(--th-dock-tabs-bg, linear-gradient(180deg, #4a4b52, #27292e));
      --_tab-active-bg: var(--th-dock-tab-active-bg, #1b1c21);
      --_body-bg: var(--th-dock-body-bg, #141419);
      --_border-color: var(--th-dock-border, #000000);
    }
  `;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('tabs')) {
      const prevTabs = changed.get('tabs') as DockTab[] | undefined;
      const hadTabs = (prevTabs?.length ?? 0) > 0;

      if (!hadTabs && this.tabs.length > 0 && !this.open) {
        this.open = true;
        this._emit('dock-open', {});
      }

      if (
        this.tabs.length > 0 &&
        !this.tabs.some((t) => t.id === this.activeTab)
      ) {
        this._switchTab(this.tabs[0].id);
      }

      if (this.tabs.length === 0 && this.open) {
        this.open = false;
        this._emit('dock-close', {});
      }
    }

    if (changed.has('pin') && changed.get('pin') !== undefined) {
      this._emit('dock-pin-change', { pin: this.pin });
    }
  }

  /** Opens a tab, focusing it if it's already open (no duplicates). */
  openTab(tab: DockTab): void {
    if (this.tabs.some((t) => t.id === tab.id)) {
      this._switchTab(tab.id);
      return;
    }
    this.tabs = [...this.tabs, tab];
  }

  closeTab(id: string): void {
    this._closeTab(id);
  }

  switchTab(id: string): void {
    this._switchTab(id);
  }

  private _switchTab(id: string): void {
    if (this.activeTab === id) return;
    this.activeTab = id;
    this._emit('dock-tab-switch', { id });
  }

  private _closeTab(id: string): void {
    const idx = this.tabs.findIndex((t) => t.id === id);
    if (idx === -1) return;

    const wasActive = this.activeTab === id;
    const next = this.tabs.filter((t) => t.id !== id);
    this.tabs = next;

    if (wasActive && next.length > 0) {
      const neighbor = next[Math.max(0, idx - 1)];
      this._switchTab(neighbor.id);
    }

    this._emit('dock-tab-close', { id });
  }

  private _emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  private get _currentSize(): number {
    return this.pin === 'bottom' ? this.height : this.width;
  }

  private _clamp(raw: number): number {
    return this.pin === 'bottom'
      ? Math.min(Math.max(raw, 50), window.innerHeight * 0.75)
      : Math.min(Math.max(raw, 250), window.innerWidth * 0.4);
  }

  // Commits live (every pointermove/keydown), not debounced to the drag end,
  // so a consumer syncing its own layout to this doesn't lag behind.
  private _commitResize(size: number): void {
    if (this.pin === 'bottom') {
      this.height = size;
    } else {
      this.width = size;
    }
    this._emit('dock-resize', { width: this.width, height: this.height });
  }

  private _onResizePointerDown = (e: PointerEvent): void => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const coord = this.pin === 'bottom' ? e.clientY : e.clientX;
    const startSize = this.pin === 'bottom' ? this.height : this.width;
    this._dragStart = { pointerCoord: coord, startSize };
  };

  private _onResizePointerMove = (e: PointerEvent): void => {
    if (!this._dragStart) return;
    const coord = this.pin === 'bottom' ? e.clientY : e.clientX;
    const rawDelta = coord - this._dragStart.pointerCoord;
    // Handle faces the page, not the viewport edge. Left is the only pin
    // where growing doesn't need the delta negated.
    const signedDelta = this.pin === 'left' ? rawDelta : -rawDelta;
    this._commitResize(this._clamp(this._dragStart.startSize + signedDelta));
  };

  private _onResizePointerUp = (): void => {
    this._dragStart = null;
  };

  private _onResizeKeydown = (e: KeyboardEvent): void => {
    const step = 20;
    const isBottom = this.pin === 'bottom';
    const growKey = isBottom ? 'ArrowUp' : this.pin === 'left' ? 'ArrowRight' : 'ArrowLeft';
    const shrinkKey = isBottom ? 'ArrowDown' : this.pin === 'left' ? 'ArrowLeft' : 'ArrowRight';

    if (e.key !== growKey && e.key !== shrinkKey) return;
    e.preventDefault();

    const delta = e.key === growKey ? step : -step;
    const current = isBottom ? this.height : this.width;

    this._commitResize(this._clamp(current + delta));
  };

  private _renderResizer(): TemplateResult {
    const isBottom = this.pin === 'bottom';
    const max = isBottom ? window.innerHeight * 0.75 : window.innerWidth * 0.4;

    return html`
      <div
        class="dock__resizer"
        role="separator"
        aria-orientation=${isBottom ? 'horizontal' : 'vertical'}
        aria-valuenow=${this._currentSize}
        aria-valuemin=${isBottom ? 50 : 250}
        aria-valuemax=${Math.round(max)}
        tabindex="0"
        @pointerdown=${this._onResizePointerDown}
        @pointermove=${this._onResizePointerMove}
        @pointerup=${this._onResizePointerUp}
        @pointercancel=${this._onResizePointerUp}
        @keydown=${this._onResizeKeydown}
      ></div>
    `;
  }

  private _renderTab(tab: DockTab): TemplateResult {
    const active = tab.id === this.activeTab;
    const closable = tab.closable !== false;

    return html`
      <div
        class="dock__tab ${active ? 'dock__tab--active' : ''}"
        id="tab-${tab.id}"
        role="tab"
        tabindex="0"
        aria-selected=${active}
        aria-controls="panel-${tab.id}"
        @click=${() => this._switchTab(tab.id)}
        @keydown=${(e: KeyboardEvent) => this._handleTabKeydown(e, tab)}
      >
        ${active
          ? html`<trailhand-icon class="dock__tab-active-icon" name="circle"></trailhand-icon>`
          : nothing}
        ${tab.icon
          ? html`<trailhand-icon name=${tab.icon}></trailhand-icon>`
          : nothing}
        <span class="dock__tab-label">${tab.label}</span>
        ${closable
          ? html`<button
              class="dock__tab-close"
              aria-label="Close ${tab.label}"
              @click=${(e: Event) => {
                e.stopPropagation();
                this._closeTab(tab.id);
              }}
            >
              <trailhand-icon name="x"></trailhand-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  private _handleTabKeydown(e: KeyboardEvent, tab: DockTab): void {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    this._switchTab(tab.id);
  }

  private _renderPanel(tab: DockTab): TemplateResult {
    return html`
      <div
        class="dock__panel"
        id="panel-${tab.id}"
        role="tabpanel"
        aria-labelledby="tab-${tab.id}"
        ?hidden=${tab.id !== this.activeTab}
      >
        <slot name="tab:${tab.id}"></slot>
      </div>
    `;
  }

  render(): TemplateResult {
    const sizeStyle = this.pin === 'bottom'
      ? { height: `${this._currentSize}px` }
      : { width: `${this._currentSize}px` };

    return html`
      <div class="dock" style=${styleMap(sizeStyle)}>
        ${this._renderResizer()}
        <div class="dock__body">
          <div class="dock__tabs" role="tablist">
            ${repeat(this.tabs, (t) => t.id, (t) => this._renderTab(t))}
          </div>
          <div class="dock__panels">
            ${repeat(this.tabs, (t) => t.id, (t) => this._renderPanel(t))}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('trailhand-dock', Dock);
