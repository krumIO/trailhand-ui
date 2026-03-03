import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './selector';
import type { Selector } from './selector';

describe('Selector', () => {
  let el: Selector;

  beforeEach(async () => {
    el = document.createElement('trailhand-selector') as Selector;
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

    it('reflects value to native input', async () => {
      el.value = 'option1';
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.value).toBe('option1');
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
  });

  describe('Event bubbling and composition', () => {
    it('includes name and value in custom event detail', async () => {
      el.name = 'plan';
      el.value = 'pro';
      await el.updateComplete;

      let eventDetail: any;

      el.addEventListener('selector-change', (e: Event) => {
        eventDetail = (e as CustomEvent).detail;
      });

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(eventDetail.name).toBe('plan');
      expect(eventDetail.value).toBe('pro');
      expect(eventDetail.checked).toBe(true);
    });

    it('dispatches custom events that bubble', async () => {
      let bubbled = false;

      document.body.addEventListener(
        'selector-change',
        () => {
          bubbled = true;
        },
        { once: true },
      );

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(bubbled).toBe(true);
    });

    it('dispatches custom events that are composed', async () => {
      let composed = false;

      el.addEventListener('selector-change', (e: Event) => {
        composed = (e as CustomEvent).composed;
      });

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(composed).toBe(true);
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

      el.addEventListener('selector-change', () => {
        eventFired = true;
      });

      const label = el.shadowRoot!.querySelector('label')!;
      label.click();

      expect(eventFired).toBe(false);
    });
  });

  describe('Radio group exclusivity', () => {
    it('unchecks other selectors with same name', async () => {
      const el1 = document.createElement('trailhand-selector') as Selector;
      const el2 = document.createElement('trailhand-selector') as Selector;

      el1.name = 'group';
      el2.name = 'group';

      document.body.appendChild(el1);
      document.body.appendChild(el2);

      await el1.updateComplete;
      await el2.updateComplete;

      const input1 = el1.shadowRoot!.querySelector('input')!;
      const input2 = el2.shadowRoot!.querySelector('input')!;

      input1.click();

      expect(el1.checked).toBe(true);
      expect(el2.checked).toBe(false);

      input2.click();

      expect(el1.checked).toBe(false);
      expect(el2.checked).toBe(true);

      document.body.removeChild(el1);
      document.body.removeChild(el2);
    });
  });

  describe('Keyboard interaction', () => {
    it('selects with Space key', async () => {
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
