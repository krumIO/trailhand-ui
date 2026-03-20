import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './dropdown';
import type { Dropdown } from './dropdown';

const SAMPLE_OPTIONS = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
  { label: 'Delta', value: 'delta', disabled: true },
];

describe('Dropdown', () => {
  let el: Dropdown;

  beforeEach(async () => {
    el = document.createElement('trailhand-dropdown') as Dropdown;
    el.options = SAMPLE_OPTIONS;
    el.name = 'test-dropdown';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Reflected attributes', () => {
    it('reflects disabled attribute', async () => {
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('reflects multiselect attribute', async () => {
      el.multiselect = true;
      await el.updateComplete;
      expect(el.hasAttribute('multiselect')).toBe(true);
    });

    it('reflects invalid attribute', async () => {
      el.invalid = true;
      await el.updateComplete;
      expect(el.hasAttribute('invalid')).toBe(true);
    });

    it('reflects size attribute', async () => {
      el.size = 'large';
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe('large');
    });
  });

  describe('Label', () => {
    it('renders label when set', async () => {
      el.label = 'My Label';
      await el.updateComplete;
      const label = el.shadowRoot!.querySelector('.input-label');
      expect(label).not.toBeNull();
      expect(label!.textContent).toContain('My Label');
    });

    it('does not render label when not set', async () => {
      const label = el.shadowRoot!.querySelector('.input-label');
      expect(label).toBeNull();
    });

    it('shows required indicator when required is true', async () => {
      el.label = 'Label';
      el.required = true;
      await el.updateComplete;
      const indicator = el.shadowRoot!.querySelector('.required-indicator');
      expect(indicator!.textContent).toBe('*');
    });
  });

  describe('Placeholder', () => {
    it('shows placeholder text when no value selected', async () => {
      el.placeholder = 'Pick one';
      await el.updateComplete;
      const text = el.shadowRoot!.querySelector('.trigger-text');
      expect(text!.textContent).toBe('Pick one');
      expect(text!.classList.contains('placeholder')).toBe(true);
    });
  });

  describe('Single select', () => {
    it('shows selected label in trigger when value is set', async () => {
      el.value = 'alpha';
      await el.updateComplete;
      const text = el.shadowRoot!.querySelector('.trigger-text');
      expect(text!.textContent).toBe('Alpha');
      expect(text!.classList.contains('placeholder')).toBe(false);
    });

    it('shows clear button when a value is selected', async () => {
      el.value = 'beta';
      await el.updateComplete;
      const clearBtn = el.shadowRoot!.querySelector('.clear-btn');
      expect(clearBtn).not.toBeNull();
    });

    it('hides clear button when no value selected', async () => {
      const clearBtn = el.shadowRoot!.querySelector('.clear-btn');
      expect(clearBtn).toBeNull();
    });

    it('opens dropdown panel on trigger click', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      const panel = el.shadowRoot!.querySelector('.dropdown-panel');
      expect(panel).not.toBeNull();
    });

    it('closes dropdown on second trigger click', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      trigger.click();
      await el.updateComplete;
      const panel = el.shadowRoot!.querySelector('.dropdown-panel');
      expect(panel).toBeNull();
    });

    it('renders options in the panel', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      const opts = el.shadowRoot!.querySelectorAll('.option');
      expect(opts.length).toBe(SAMPLE_OPTIONS.length);
    });

    it('marks disabled option with disabled class', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      const disabledOpt = el.shadowRoot!.querySelector('.option.disabled');
      expect(disabledOpt).not.toBeNull();
    });
  });

  describe('Multiselect', () => {
    beforeEach(async () => {
      el.multiselect = true;
      await el.updateComplete;
    });

    it('opens panel on trigger click', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      const panel = el.shadowRoot!.querySelector('.dropdown-panel');
      expect(panel).not.toBeNull();
    });

    it('renders tags for pre-selected values', async () => {
      el.values = ['alpha', 'beta'];
      await el.updateComplete;
      const tags = el.shadowRoot!.querySelectorAll('trailhand-tag');
      expect(tags.length).toBe(2);
    });

    it('tag shows correct label', async () => {
      el.values = ['alpha'];
      await el.updateComplete;
      const tag = el.shadowRoot!.querySelector('trailhand-tag');
      expect(tag!.getAttribute('label')).toBe('Alpha');
    });

    it('tag has info variant and sm size', async () => {
      el.values = ['alpha'];
      await el.updateComplete;
      const tag = el.shadowRoot!.querySelector('trailhand-tag');
      expect(tag!.getAttribute('variant')).toBe('info');
      expect(tag!.getAttribute('size')).toBe('sm');
    });

    it('tag is dismissible', async () => {
      el.values = ['alpha'];
      await el.updateComplete;
      const tag = el.shadowRoot!.querySelector('trailhand-tag');
      expect(tag!.hasAttribute('dismissible')).toBe(true);
    });

    it('removes value when tag-dismiss fires', async () => {
      el.values = ['alpha', 'beta'];
      await el.updateComplete;
      const tag = el.shadowRoot!.querySelector('trailhand-tag') as HTMLElement;
      tag.dispatchEvent(new CustomEvent('tag-dismiss', {
        bubbles: true,
        composed: true,
        detail: { value: 'alpha' },
      }));
      await el.updateComplete;
      expect(el.values).toEqual(['beta']);
    });

    it('shows clear button when values are selected', async () => {
      el.values = ['alpha'];
      await el.updateComplete;
      const clearBtn = el.shadowRoot!.querySelector('.clear-btn');
      expect(clearBtn).not.toBeNull();
    });
  });

  describe('Filtering', () => {
    beforeEach(async () => {
      el.filterable = true;
      await el.updateComplete;
    });

    it('shows no-options message when filter matches nothing', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;

      const searchInput = el.shadowRoot!.querySelector<HTMLInputElement>('.search-input');
      searchInput!.value = 'zzznomatch';
      searchInput!.dispatchEvent(new Event('input'));
      await el.updateComplete;

      const noOpts = el.shadowRoot!.querySelector('.no-options');
      expect(noOpts).not.toBeNull();
    });

    it('filters options based on search text', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;

      const searchInput = el.shadowRoot!.querySelector<HTMLInputElement>('.search-input');
      searchInput!.value = 'al';
      searchInput!.dispatchEvent(new Event('input'));
      await el.updateComplete;

      const opts = el.shadowRoot!.querySelectorAll('.option');
      expect(opts.length).toBe(1);
      expect(opts[0].textContent?.trim()).toContain('Alpha');
    });

    it('does not render search input when filterable is false', async () => {
      el.filterable = false;
      await el.updateComplete;
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      const searchInput = el.shadowRoot!.querySelector('.search-input');
      expect(searchInput).toBeNull();
    });
  });

  describe('Events', () => {
    it('emits dropdown-change event on selection', async () => {
      let eventDetail: unknown = null;
      el.addEventListener('dropdown-change', (e) => {
        eventDetail = (e as CustomEvent).detail;
      });

      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;

      const opts = el.shadowRoot!.querySelectorAll<HTMLElement>('.option:not(.disabled)');
      opts[0].click();
      await el.updateComplete;

      expect(eventDetail).not.toBeNull();
      expect((eventDetail as { value: string }).value).toBe('alpha');
    });

    it('emits change event that bubbles and is composed', async () => {
      let event: Event | null = null;
      document.body.addEventListener('change', (e) => {
        event = e;
      });

      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;

      const opts = el.shadowRoot!.querySelectorAll<HTMLElement>('.option:not(.disabled)');
      opts[0].click();
      await el.updateComplete;

      expect(event).not.toBeNull();
      expect((event as unknown as Event).bubbles).toBe(true);
      expect((event as unknown as Event).composed).toBe(true);
    });
  });

  describe('Required validation', () => {
    it('is invalid when required and no value selected', async () => {
      el.required = true;
      await el.updateComplete;
      expect(el.validity.valueMissing).toBe(true);
      expect(el.checkValidity()).toBe(false);
    });

    it('is valid when required and a value is selected', async () => {
      el.required = true;
      el.value = 'alpha';
      await el.updateComplete;
      expect(el.checkValidity()).toBe(true);
    });

    it('clears invalid state after selection', async () => {
      el.required = true;
      await el.updateComplete;
      expect(el.checkValidity()).toBe(false);

      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      const opt = el.shadowRoot!.querySelector<HTMLElement>('.option:not(.disabled)');
      opt!.click();
      await el.updateComplete;

      expect(el.checkValidity()).toBe(true);
    });
  });

  describe('Disabled state', () => {
    it('does not open when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;

      const panel = el.shadowRoot!.querySelector('.dropdown-panel');
      expect(panel).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('trigger has role combobox', () => {
      const trigger = el.shadowRoot!.querySelector('.trigger');
      expect(trigger!.getAttribute('role')).toBe('combobox');
    });

    it('trigger has aria-haspopup listbox', () => {
      const trigger = el.shadowRoot!.querySelector('.trigger');
      expect(trigger!.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('aria-expanded is false when closed', () => {
      const trigger = el.shadowRoot!.querySelector('.trigger');
      expect(trigger!.getAttribute('aria-expanded')).toBe('false');
    });

    it('aria-expanded is true when open', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
