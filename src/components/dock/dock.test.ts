import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './dock';
import type { Dock, DockTab } from './dock';

describe('Dock', () => {
  let el: Dock;

  const tabs: DockTab[] = [
    { id: 'a', label: 'Tab A' },
    { id: 'b', label: 'Tab B' },
    { id: 'c', label: 'Tab C' },
  ];

  beforeEach(async () => {
    el = document.createElement('trailhand-dock') as Dock;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Slot content persistence', () => {
    it('keeps the same projected node assigned to its slot across tab switches', async () => {
      el.tabs = tabs;
      el.activeTab = 'a';
      await el.updateComplete;

      const childA = document.createElement('div');
      childA.slot = 'tab:a';
      childA.textContent = 'content a';
      const childB = document.createElement('div');
      childB.slot = 'tab:b';
      childB.textContent = 'content b';
      el.append(childA, childB);
      await el.updateComplete;

      const slotA = el.shadowRoot!.querySelector(
        'slot[name="tab:a"]',
      ) as HTMLSlotElement;
      const slotB = el.shadowRoot!.querySelector(
        'slot[name="tab:b"]',
      ) as HTMLSlotElement;

      expect(slotA.assignedNodes({ flatten: true })).toContain(childA);

      el.switchTab('b');
      await el.updateComplete;

      // same node instances still assigned, just hidden behind [hidden]
      expect(slotA.assignedNodes({ flatten: true })).toContain(childA);
      expect(slotB.assignedNodes({ flatten: true })).toContain(childB);

      const panelA = el.shadowRoot!.querySelector('#panel-a')!;
      const panelB = el.shadowRoot!.querySelector('#panel-b')!;
      expect(panelA.hasAttribute('hidden')).toBe(true);
      expect(panelB.hasAttribute('hidden')).toBe(false);

      el.switchTab('a');
      await el.updateComplete;

      // switching back doesn't recreate the node, same reference
      expect(slotA.assignedNodes({ flatten: true })[0]).toBe(childA);
    });
  });

  describe('Tab lifecycle', () => {
    it('auto-opens the dock when the first tab is added', async () => {
      expect(el.open).toBe(false);
      el.tabs = [tabs[0]];
      await el.updateComplete;
      expect(el.open).toBe(true);
    });

    it('auto-closes the dock when the last tab is removed', async () => {
      el.tabs = [tabs[0]];
      await el.updateComplete;
      el.closeTab('a');
      await el.updateComplete;
      expect(el.tabs.length).toBe(0);
      expect(el.open).toBe(false);
    });

    it('re-focuses an existing tab instead of duplicating it on openTab', async () => {
      el.tabs = [...tabs];
      el.activeTab = 'a';
      await el.updateComplete;

      el.openTab({ id: 'b', label: 'Tab B' });
      await el.updateComplete;

      expect(el.tabs.length).toBe(3);
      expect(el.activeTab).toBe('b');
    });

    it('selects a neighbor tab when the active tab is closed', async () => {
      el.tabs = [...tabs];
      el.activeTab = 'b';
      await el.updateComplete;

      el.closeTab('b');
      await el.updateComplete;

      expect(el.activeTab).toBe('a');
      expect(el.tabs.map((t) => t.id)).toEqual(['a', 'c']);
    });

    it('falls back to the first tab if the active tab no longer exists', async () => {
      el.tabs = [...tabs];
      el.activeTab = 'z';
      await el.updateComplete;

      expect(el.activeTab).toBe('a');
    });
  });

  describe('Resize', () => {
    beforeEach(async () => {
      el.tabs = [tabs[0]];
      await el.updateComplete;
    });

    it('grows height by 20px per ArrowUp keypress on the resizer', async () => {
      const resizer = el.shadowRoot!.querySelector('.dock__resizer') as HTMLElement;
      const startHeight = el.height;

      resizer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(el.height).toBe(startHeight + 20);
    });

    it('shrinks height by 20px per ArrowDown keypress', async () => {
      const resizer = el.shadowRoot!.querySelector('.dock__resizer') as HTMLElement;
      const startHeight = el.height;

      resizer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(el.height).toBe(startHeight - 20);
    });

    it('clamps height to a 50px floor', async () => {
      el.height = 55;
      await el.updateComplete;
      const resizer = el.shadowRoot!.querySelector('.dock__resizer') as HTMLElement;

      resizer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(el.height).toBe(50);
    });

    it('emits dock-resize with the new height after a keyboard resize', async () => {
      const resizer = el.shadowRoot!.querySelector('.dock__resizer') as HTMLElement;
      let detail: { width: number; height: number } | undefined;

      el.addEventListener('dock-resize', (e) => {
        detail = (e as CustomEvent).detail;
      });

      resizer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(detail).toEqual({ width: el.width, height: el.height });
    });

    it('commits height live as the pointer drags, not just once the drag ends', async () => {
      const resizer = el.shadowRoot!.querySelector('.dock__resizer') as HTMLElement;
      const startHeight = el.height;

      resizer.dispatchEvent(new PointerEvent('pointerdown', { clientY: 500, pointerId: 1, bubbles: true }));
      resizer.dispatchEvent(new PointerEvent('pointermove', { clientY: 460, pointerId: 1, bubbles: true }));

      // mid-drag, already committed, not waiting for the drag to end
      expect(el.height).toBe(startHeight + 40);

      resizer.dispatchEvent(new PointerEvent('pointermove', { clientY: 440, pointerId: 1, bubbles: true }));
      expect(el.height).toBe(startHeight + 60);

      resizer.dispatchEvent(new PointerEvent('pointerup', { clientY: 440, pointerId: 1, bubbles: true }));
      expect(el.height).toBe(startHeight + 60);
    });

    it('emits dock-resize on every pointermove during a drag, not just at the end', async () => {
      const resizer = el.shadowRoot!.querySelector('.dock__resizer') as HTMLElement;
      let callCount = 0;

      el.addEventListener('dock-resize', () => {
        callCount++;
      });

      resizer.dispatchEvent(new PointerEvent('pointerdown', { clientY: 500, pointerId: 1, bubbles: true }));
      resizer.dispatchEvent(new PointerEvent('pointermove', { clientY: 460, pointerId: 1, bubbles: true }));
      resizer.dispatchEvent(new PointerEvent('pointermove', { clientY: 440, pointerId: 1, bubbles: true }));

      expect(callCount).toBe(2);
    });

    describe('left/right pin drag direction', () => {
      // A narrow test viewport can put the width clamp's ceiling below its
      // 250px floor, collapsing every result to the same value. Stub one
      // wide enough that these tests can actually tell direction apart.
      let originalInnerWidth: number;

      beforeEach(() => {
        originalInnerWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', { value: 2000, configurable: true });
      });

      afterEach(() => {
        Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
      });

      it('dragging right grows a left-pinned dock (handle is on its right edge)', async () => {
        el.pin = 'left';
        el.width = 300;
        await el.updateComplete;
        const resizer = el.shadowRoot!.querySelector('.dock__resizer') as HTMLElement;

        resizer.dispatchEvent(new PointerEvent('pointerdown', { clientX: 500, pointerId: 1, bubbles: true }));
        resizer.dispatchEvent(new PointerEvent('pointermove', { clientX: 540, pointerId: 1, bubbles: true }));

        expect(el.width).toBe(340);
      });

      it('dragging left grows a right-pinned dock (handle is on its left edge)', async () => {
        el.pin = 'right';
        el.width = 300;
        await el.updateComplete;
        const resizer = el.shadowRoot!.querySelector('.dock__resizer') as HTMLElement;

        resizer.dispatchEvent(new PointerEvent('pointerdown', { clientX: 500, pointerId: 1, bubbles: true }));
        resizer.dispatchEvent(new PointerEvent('pointermove', { clientX: 460, pointerId: 1, bubbles: true }));

        expect(el.width).toBe(340);
      });
    });
  });

  describe('Active tab indicator', () => {
    it('shows a check icon only on the active tab, and moves it on switch', async () => {
      el.tabs = [...tabs];
      el.activeTab = 'a';
      await el.updateComplete;

      const iconIn = (id: string) =>
        el.shadowRoot!.querySelector(`#tab-${id} .dock__tab-active-icon`);

      expect(iconIn('a')).not.toBeNull();
      expect(iconIn('b')).toBeNull();
      expect(iconIn('c')).toBeNull();

      el.switchTab('b');
      await el.updateComplete;

      expect(iconIn('a')).toBeNull();
      expect(iconIn('b')).not.toBeNull();
    });
  });

  describe('Events', () => {
    it('emits dock-tab-switch with the new tab id', async () => {
      el.tabs = [...tabs];
      el.activeTab = 'a';
      await el.updateComplete;

      let detail: { id: string } | undefined;
      el.addEventListener('dock-tab-switch', (e) => {
        detail = (e as CustomEvent).detail;
      });

      el.switchTab('c');
      await el.updateComplete;

      expect(detail).toEqual({ id: 'c' });
    });

    it('emits dock-tab-close with the closed tab id', async () => {
      el.tabs = [...tabs];
      await el.updateComplete;

      let detail: { id: string } | undefined;
      el.addEventListener('dock-tab-close', (e) => {
        detail = (e as CustomEvent).detail;
      });

      el.closeTab('c');
      await el.updateComplete;

      expect(detail).toEqual({ id: 'c' });
    });
  });
});
