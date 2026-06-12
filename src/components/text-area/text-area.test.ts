import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './text-area';
import type { TextArea } from './text-area';

describe('TextArea', () => {
  let el: TextArea;

  beforeEach(async () => {
    el = document.createElement('trailhand-text-area') as TextArea;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Reactive property updates', () => {
    it('syncs value property to internal textarea', async () => {
      el.value = 'Hello';
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      expect(textarea.value).toBe('Hello');
    });

    it('syncs disabled property to internal textarea', async () => {
      el.disabled = true;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      expect(textarea.disabled).toBe(true);
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('syncs required property to internal textarea', async () => {
      el.required = true;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      expect(textarea.required).toBe(true);
    });

    it('reflects invalid property as attribute', async () => {
      el.invalid = true;
      await el.updateComplete;

      expect(el.hasAttribute('invalid')).toBe(true);
    });

    it('syncs rows property to internal textarea', async () => {
      el.rows = 8;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      expect(textarea.rows).toBe(8);
    });
  });

  describe('Input interaction', () => {
    it('updates value when user types', async () => {
      const textarea = el.shadowRoot!.querySelector('textarea')!;

      textarea.value = 'Typed';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.value).toBe('Typed');
    });
  });

  describe('Event bubbling and composition', () => {
    it('includes value and name in custom event detail', async () => {
      el.name = 'bio';
      el.value = 'Hello';
      await el.updateComplete;

      let eventDetail: any;

      el.addEventListener('text-area-change', (e: Event) => {
        eventDetail = (e as CustomEvent).detail;
      });

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'Updated bio';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      expect(eventDetail.value).toBe('Updated bio');
      expect(eventDetail.name).toBe('bio');
    });

    it('dispatches custom events that bubble', async () => {
      let bubbled = false;

      document.body.addEventListener(
        'text-area-change',
        () => {
          bubbled = true;
        },
        { once: true },
      );

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'hello';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      expect(bubbled).toBe(true);
    });

    it('dispatches custom events that are composed', async () => {
      let composed = false;

      el.addEventListener('text-area-change', (e: Event) => {
        composed = (e as CustomEvent).composed;
      });

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'hello';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      expect(composed).toBe(true);
    });

    it('dispatches native change event', async () => {
      let changeFired = false;

      el.addEventListener('change', () => {
        changeFired = true;
      });

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'hello';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      expect(changeFired).toBe(true);
    });
  });

  describe('Validation behavior', () => {
    it('sets invalid=true when required and empty', async () => {
      el.required = true;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = '';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.invalid).toBe(true);
    });

    it('sets invalid=false when required and filled', async () => {
      el.required = true;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'Valid content';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.invalid).toBe(false);
    });

    it('sets invalid=true when value exceeds maxlength', async () => {
      el.maxlength = 10;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'This is definitely over ten characters';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.invalid).toBe(true);
    });

    it('sets invalid=false when value is within maxlength', async () => {
      el.maxlength = 50;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'Short';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.invalid).toBe(false);
    });

    it('sets invalid=false when value length equals maxlength exactly', async () => {
      el.maxlength = 5;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'Hello';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.invalid).toBe(false);
    });
  });

  describe('Character count', () => {
    it('does not render count by default', async () => {
      const count = el.shadowRoot!.querySelector('.count');
      expect(count).toBeNull();
    });

    it('renders count when showCount is true', async () => {
      el.showCount = true;
      await el.updateComplete;

      const count = el.shadowRoot!.querySelector('.count');
      expect(count).not.toBeNull();
    });

    it('shows current length without maxlength', async () => {
      el.showCount = true;
      el.value = 'Hello';
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'Hello';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      const count = el.shadowRoot!.querySelector('.count')!;
      expect(count.textContent).toBe('5');
    });

    it('shows current length and max when maxlength is set', async () => {
      el.showCount = true;
      el.maxlength = 100;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'Hello';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      const count = el.shadowRoot!.querySelector('.count')!;
      expect(count.textContent).toBe('5 / 100');
    });

    it('adds over-limit class when value exceeds maxlength', async () => {
      el.showCount = true;
      el.maxlength = 5;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'Too long value';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      const count = el.shadowRoot!.querySelector('.count')!;
      expect(count.classList.contains('over-limit')).toBe(true);
    });

    it('removes over-limit class when value is back within maxlength', async () => {
      el.showCount = true;
      el.maxlength = 5;
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;

      textarea.value = 'Too long value';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      textarea.value = 'Ok';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      const count = el.shadowRoot!.querySelector('.count')!;
      expect(count.classList.contains('over-limit')).toBe(false);
    });
  });

  describe('Focus behavior', () => {
    it('delegates focus to internal textarea', async () => {
      const textarea = el.shadowRoot!.querySelector('textarea')!;
      let focused = false;

      textarea.addEventListener('focus', () => {
        focused = true;
      });

      el.focus();

      expect(focused).toBe(true);
    });
  });

  describe('Structure', () => {
    it('renders label text', async () => {
      el.label = 'Test Label';
      await el.updateComplete;

      const label = el.shadowRoot!.querySelector('label')!;
      expect(label.textContent).toContain('Test Label');
    });

    it('renders required indicator when required', async () => {
      el.required = true;
      await el.updateComplete;

      const indicator = el.shadowRoot!.querySelector('.required-indicator')!;
      expect(indicator.textContent).toBe('*');
    });

    it('renders no required indicator when not required', async () => {
      el.required = false;
      await el.updateComplete;

      const indicator = el.shadowRoot!.querySelector('.required-indicator')!;
      expect(indicator.textContent).toBe('');
    });
  });
});