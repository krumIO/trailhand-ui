import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './th-form-row';
import type { ThFormRow } from './th-form-row';

describe('ThFormRow', () => {
  let el: ThFormRow;

  beforeEach(async () => {
    el = document.createElement('trailhand-form-row') as ThFormRow;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Reactive property updates', () => {
    it('defaults columns to 1', () => {
      expect(el.columns).toBe(1);
    });

    it('updates columns when set', async () => {
      el.columns = 3;
      await el.updateComplete;
      expect(el.columns).toBe(3);
    });

    it('defaults title to empty string', () => {
      expect(el.title).toBe('');
    });

    it('updates title when set', async () => {
      el.title = 'Routes';
      await el.updateComplete;
      expect(el.title).toBe('Routes');
    });
  });

  describe('Title rendering', () => {
    it('does not render title element when title is empty', () => {
      const title = el.shadowRoot!.querySelector('.form-row__title');
      expect(title).toBeNull();
    });

    it('renders title element when title is set', async () => {
      el.title = 'Config Data';
      await el.updateComplete;
      const title = el.shadowRoot!.querySelector('.form-row__title');
      expect(title).not.toBeNull();
      expect(title!.textContent).toBe('Config Data');
    });

    it('removes title element when title is cleared', async () => {
      el.title = 'Routes';
      await el.updateComplete;
      el.title = '';
      await el.updateComplete;
      const title = el.shadowRoot!.querySelector('.form-row__title');
      expect(title).toBeNull();
    });
  });

  describe('Content layout', () => {
    it('renders content div', () => {
      const content = el.shadowRoot!.querySelector('.form-row__content');
      expect(content).not.toBeNull();
    });

    it('sets CSS column variable based on columns prop', async () => {
      el.columns = 3;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.form-row__content') as HTMLElement;
      expect(content.style.getPropertyValue('--_columns')).toBe('3');
    });

    it('updates CSS column variable when columns prop changes', async () => {
      el.columns = 2;
      await el.updateComplete;
      el.columns = 4;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.form-row__content') as HTMLElement;
      expect(content.style.getPropertyValue('--_columns')).toBe('4');
    });
  });

  describe('Slot', () => {
    it('renders default slot', () => {
      const slot = el.shadowRoot!.querySelector('slot:not([name])');
      expect(slot).not.toBeNull();
    });

    it('distributes slotted content', async () => {
      const input = document.createElement('input');
      el.appendChild(input);
      await new Promise((resolve) => setTimeout(resolve, 0));
      await el.updateComplete;
      const slot = el.shadowRoot!.querySelector('slot') as HTMLSlotElement;
      expect(slot.assignedNodes().length).toBeGreaterThan(0);
    });
  });
});
