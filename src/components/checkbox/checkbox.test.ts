import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './checkbox';
import type { Checkbox } from './checkbox';

describe('Checkbox', () => {
  let el: Checkbox;

  beforeEach(async () => {
    el = document.createElement('trailhand-checkbox') as Checkbox;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Reactive property updates', () => {
    it('updates checked state when property changes', async () => {
      el.checked = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.checked).toBe(true);
      expect(el.hasAttribute('checked')).toBe(true);
    });

    it('updates disabled state when property changes', async () => {
      el.disabled = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.disabled).toBe(true);
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('syncs indeterminate to native input element', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.indeterminate).toBe(true);
    });
  });

  describe('aria-checked attribute', () => {
    it('sets aria-checked="false" when unchecked', async () => {
      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.getAttribute('aria-checked')).toBe('false');
    });

    it('sets aria-checked="true" when checked', async () => {
      el.checked = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.getAttribute('aria-checked')).toBe('true');
    });

    it('sets aria-checked="mixed" when indeterminate', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.getAttribute('aria-checked')).toBe('mixed');
    });

    it('prioritizes indeterminate over checked for aria-checked', async () => {
      el.checked = true;
      el.indeterminate = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.getAttribute('aria-checked')).toBe('mixed');
    });
  });

  describe('Icon rendering', () => {
    it('renders check icon when checked', async () => {
      el.checked = true;
      await el.updateComplete;

      const icon = el.shadowRoot!.querySelector('trailhand-icon[name="check"]');
      expect(icon).toBeTruthy();
    });

    it('renders minus icon when indeterminate', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      const icon = el.shadowRoot!.querySelector('trailhand-icon[name="minus"]');
      expect(icon).toBeTruthy();
    });

    it('shows minus icon when both checked and indeterminate', async () => {
      el.checked = true;
      el.indeterminate = true;
      await el.updateComplete;

      const checkIcon = el.shadowRoot!.querySelector(
        'trailhand-icon[name="check"]',
      );
      const minusIcon = el.shadowRoot!.querySelector(
        'trailhand-icon[name="minus"]',
      );

      expect(checkIcon).toBeNull();
      expect(minusIcon).toBeTruthy();
    });
  });

  describe('Event bubbling and composition', () => {
    it('includes name and value in event detail', async () => {
      el.name = 'test-name';
      el.value = 'test-value';
      await el.updateComplete;

      let eventDetail: any;
      el.addEventListener('checkbox-change', (e: Event) => {
        eventDetail = (e as CustomEvent).detail;
      });

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(eventDetail.name).toBe('test-name');
      expect(eventDetail.value).toBe('test-value');
    });

    it('dispatches events that bubble', async () => {
      let bubbled = false;
      document.body.addEventListener(
        'checkbox-change',
        () => {
          bubbled = true;
        },
        { once: true },
      );

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(bubbled).toBe(true);
    });

    it('dispatches events that are composed', async () => {
      let eventComposed = false;
      el.addEventListener('checkbox-change', (e: Event) => {
        eventComposed = (e as CustomEvent).composed;
      });

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(eventComposed).toBe(true);
    });

    it('dispatches native change event', async () => {
      let changeFired = false;

      el.addEventListener('change', () => {
        changeFired = true;
      });

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(changeFired).toBe(true);
    });
  });

  describe('Disabled state prevents interaction', () => {
    it('does not toggle when disabled via click', async () => {
      el.disabled = true;
      await el.updateComplete;

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(el.checked).toBe(false);
    });

    it('does not dispatch event when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('checkbox-change', () => {
        eventFired = true;
      });

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(eventFired).toBe(false);
    });
  });

  describe('keyboard interaction', () => {
    it('toggles with Space key', async () => {
      const input = el.shadowRoot!.querySelector('input')!;

      input.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
        }),
      );

      input.click();
      await el.updateComplete;

      expect(el.checked).toBe(true);
    });
  });
});
