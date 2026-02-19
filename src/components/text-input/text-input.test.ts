import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './text-input';
import type { TextInput } from './text-input';

describe('TextInput', () => {
  let el: TextInput;

  beforeEach(async () => {
    el = document.createElement('trailhand-text-input') as TextInput;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Reactive property updates', () => {
    it('syncs value property to internal input', async () => {
      el.value = 'Hello';
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.value).toBe('Hello');
    });

    it('syncs disabled property to internal input', async () => {
      el.disabled = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.disabled).toBe(true);
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('syncs required property to internal input', async () => {
      el.required = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.required).toBe(true);
    });

    it('reflects invalid property as attribute', async () => {
      el.invalid = true;
      await el.updateComplete;

      expect(el.hasAttribute('invalid')).toBe(true);
    });
  });

  describe('Input interaction', () => {
    it('updates value when user types', async () => {
      const input = el.shadowRoot!.querySelector('input')!;

      input.value = 'Typed';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.value).toBe('Typed');
    });
  });

  describe('Validation behavior', () => {
    it('sets invalid=true when required and empty', async () => {
      el.required = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.invalid).toBe(true);
    });

    it('sets invalid=false when required and filled', async () => {
      el.required = true;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input')!;
      input.value = 'Valid';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await el.updateComplete;

      expect(el.invalid).toBe(false);
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
  });
});
