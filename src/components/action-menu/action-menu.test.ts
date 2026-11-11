import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './action-menu';
import type { ActionMenu, ActionMenuItem } from './action-menu';

const RESOURCE = { id: 'app-1', name: 'my-app', status: 'running' };

describe('ActionMenu', () => {
  let el: ActionMenu;

  const items = () =>
    Array.from(
      el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.action-menu__action'),
    );
  const trigger = () =>
    el.shadowRoot!.querySelector<HTMLButtonElement>('.action-menu__button')!;

  const setActions = async (actions: ActionMenuItem[]) => {
    el.actions = actions;
    await el.updateComplete;
  };

  beforeEach(async () => {
    el = document.createElement('trailhand-action-menu') as ActionMenu;
    el.resource = RESOURCE;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Open / close', () => {
    it('opens on trigger click', async () => {
      trigger().click();
      await el.updateComplete;
      const dropdown = el.shadowRoot!.querySelector('.action-menu__dropdown');
      expect(dropdown!.classList.contains('action-menu__dropdown--open')).toBe(true);
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
    });

    it('closes on second trigger click', async () => {
      trigger().click();
      await el.updateComplete;
      trigger().click();
      await el.updateComplete;
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });

    it('closes on outside click', async () => {
      trigger().click();
      await el.updateComplete;
      document.body.click();
      await el.updateComplete;
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });

    it('does not open when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;
      trigger().click();
      await el.updateComplete;
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Action source', () => {
    it('renders explicit actions', async () => {
      await setActions([{ label: 'Edit' }, { label: 'Delete', danger: true }]);
      expect(items().map((b) => b.textContent!.trim())).toEqual(['Edit', 'Delete']);
    });

    it('falls back to resource.availableActions', async () => {
      el.resource = { ...RESOURCE, availableActions: [{ label: 'Restart' }] };
      await el.updateComplete;
      expect(items().map((b) => b.textContent!.trim())).toEqual(['Restart']);
    });

    it('shows empty message when there are no actions', () => {
      const empty = el.shadowRoot!.querySelector('.action-menu__empty');
      expect(empty!.textContent).toContain('No actions available');
    });

    it('applies danger class', async () => {
      await setActions([{ label: 'Delete', danger: true }]);
      expect(items()[0].classList.contains('action-menu__action--danger')).toBe(true);
    });
  });

  describe('Visibility', () => {
    it('hides action when visible is false', async () => {
      await setActions([{ label: 'A' }, { label: 'B', visible: false }]);
      expect(items().map((b) => b.textContent!.trim())).toEqual(['A']);
    });

    it('evaluates visible function against the resource', async () => {
      const visible = vi.fn((r) => r.status === 'stopped');
      await setActions([{ label: 'Start', visible }, { label: 'Edit' }]);
      expect(visible).toHaveBeenCalledWith(RESOURCE);
      expect(items().map((b) => b.textContent!.trim())).toEqual(['Edit']);
    });

    it('hides action when enabled is false and visible is unset', async () => {
      await setActions([{ label: 'A' }, { label: 'B', enabled: false }]);
      expect(items().map((b) => b.textContent!.trim())).toEqual(['A']);
    });

    it('strips leading, trailing and consecutive dividers', async () => {
      await setActions([
        { divider: true },
        { label: 'A' },
        { divider: true },
        { divider: true },
        { label: 'B' },
        { divider: true },
      ]);
      const dividers = el.shadowRoot!.querySelectorAll('.action-menu__divider');
      expect(items().length).toBe(2);
      expect(dividers.length).toBe(0);
    });

    it('keeps a divider between two actions', async () => {
      await setActions([{ label: 'A' }, { divider: true }, { label: 'B' }]);
      const dividers = el.shadowRoot!.querySelectorAll('.action-menu__divider');
      expect(dividers.length).toBe(1);
    });
  });

  describe('Enabled', () => {
    it('is enabled when enabled is undefined', async () => {
      await setActions([{ label: 'A' }]);
      expect(items()[0].disabled).toBe(false);
    });

    it('is enabled when enabled is true', async () => {
      await setActions([{ label: 'A', enabled: true }]);
      expect(items()[0].disabled).toBe(false);
    });

    it('is disabled when enabled is false and visible is true', async () => {
      await setActions([{ label: 'A', visible: true, enabled: false }]);
      expect(items()[0].disabled).toBe(true);
    });

    it('evaluates enabled function against the resource', async () => {
      const enabled = vi.fn(() => false);
      await setActions([{ label: 'A', enabled }]);
      expect(enabled).toHaveBeenCalledWith(RESOURCE);
      expect(items()[0].disabled).toBe(true);
    });

    it('does not fire action or event for a disabled action', async () => {
      const action = vi.fn();
      const listener = vi.fn();
      el.addEventListener('action-click', listener);
      await setActions([{ label: 'A', visible: true, enabled: false, action }]);

      // disabled buttons swallow click(); dispatch directly to hit the guard
      items()[0].disabled = false;
      items()[0].click();
      await el.updateComplete;

      expect(action).not.toHaveBeenCalled();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('calls action handler with the resource and closes', async () => {
      const action = vi.fn();
      await setActions([{ label: 'Edit', action }]);
      trigger().click();
      await el.updateComplete;

      items()[0].click();
      await el.updateComplete;

      expect(action).toHaveBeenCalledWith(RESOURCE);
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });

    it('emits composed, bubbling action-click with action and resource', async () => {
      let event: CustomEvent | null = null;
      document.body.addEventListener(
        'action-click',
        (e) => {
          event = e as CustomEvent;
        },
        { once: true },
      );
      const item = { label: 'Edit' };
      await setActions([item]);

      items()[0].click();
      await el.updateComplete;

      expect(event).not.toBeNull();
      expect(event!.bubbles).toBe(true);
      expect(event!.composed).toBe(true);
      expect(event!.detail).toEqual({ action: item, resource: RESOURCE });
    });
  });

  describe('Accessibility', () => {
    it('trigger has aria-haspopup and aria-label', () => {
      expect(trigger().getAttribute('aria-haspopup')).toBe('true');
      expect(trigger().getAttribute('aria-label')).toBe('Actions');
    });

    it('list has role menu and items have role menuitem', async () => {
      await setActions([{ label: 'A' }]);
      expect(el.shadowRoot!.querySelector('.action-menu__list')!.getAttribute('role')).toBe('menu');
      expect(items()[0].getAttribute('role')).toBe('menuitem');
    });
  });
});
