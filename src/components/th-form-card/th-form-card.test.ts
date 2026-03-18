import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './th-form-card';
import type { ThFormCard } from './th-form-card';

describe('ThFormCard', () => {
  let el: ThFormCard;

  beforeEach(async () => {
    el = document.createElement('trailhand-form-card') as ThFormCard;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Reactive property updates', () => {
    it('reflects shadow attribute when set to true', async () => {
      el.shadow = true;
      await el.updateComplete;
      expect(el.hasAttribute('shadow')).toBe(true);
    });

    it('removes shadow attribute when set to false', async () => {
      el.shadow = true;
      await el.updateComplete;
      el.shadow = false;
      await el.updateComplete;
      expect(el.hasAttribute('shadow')).toBe(false);
    });

    it('defaults columns to 1', () => {
      expect(el.columns).toBe(1);
    });

    it('updates columns when set', async () => {
      el.columns = 3;
      await el.updateComplete;
      expect(el.columns).toBe(3);
    });

    it('defaults buttonLabel to empty string', () => {
      expect(el.buttonLabel).toBe('');
    });

    it('defaults cancelLabel to empty string', () => {
      expect(el.cancelLabel).toBe('');
    });

    it('defaults buttonVariant to primary', () => {
      expect(el.buttonVariant).toBe('primary');
    });

    it('defaults buttonDisabled to false', () => {
      expect(el.buttonDisabled).toBe(false);
    });
  });

  describe('Loading state', () => {
    it('renders spinner when loading is true', async () => {
      el.loading = true;
      await el.updateComplete;
      const spinner = el.shadowRoot!.querySelector('.form-card__spinner');
      expect(spinner).not.toBeNull();
    });

    it('does not render spinner when loading is false', () => {
      const spinner = el.shadowRoot!.querySelector('.form-card__spinner');
      expect(spinner).toBeNull();
    });

    it('applies loading class to card when loading is true', async () => {
      el.loading = true;
      await el.updateComplete;
      const card = el.shadowRoot!.querySelector('.form-card');
      expect(card!.classList.contains('form-card--loading')).toBe(true);
    });

    it('does not render content slot when loading is true', async () => {
      el.loading = true;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.form-card__content');
      expect(content).toBeNull();
    });
  });

  describe('Content layout', () => {
    it('renders content in flex column mode when columns is 1', async () => {
      el.columns = 1;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.form-card__content');
      expect(content).not.toBeNull();
      expect(content!.classList.contains('form-card__content--grid')).toBe(false);
    });

    it('renders content in grid mode when columns is greater than 1', async () => {
      el.columns = 2;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.form-card__content--grid');
      expect(content).not.toBeNull();
    });

    it('sets CSS column variable when columns is greater than 1', async () => {
      el.columns = 3;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.form-card__content--grid') as HTMLElement;
      expect(content.style.getPropertyValue('--_columns')).toBe('3');
    });
  });

  describe('Action buttons', () => {
    it('does not render actions when neither buttonLabel nor cancelLabel is set', () => {
      const actions = el.shadowRoot!.querySelector('.form-card__actions');
      expect(actions).toBeNull();
    });

    it('renders actions when buttonLabel is set', async () => {
      el.buttonLabel = 'Create';
      await el.updateComplete;
      const actions = el.shadowRoot!.querySelector('.form-card__actions');
      expect(actions).not.toBeNull();
    });

    it('renders actions when cancelLabel is set', async () => {
      el.cancelLabel = 'Cancel';
      await el.updateComplete;
      const actions = el.shadowRoot!.querySelector('.form-card__actions');
      expect(actions).not.toBeNull();
    });

    it('renders only the primary button when buttonLabel is set and cancelLabel is empty', async () => {
      el.buttonLabel = 'Save';
      await el.updateComplete;
      const buttons = el.shadowRoot!.querySelectorAll('trailhand-button');
      expect(buttons.length).toBe(1);
    });

    it('renders only the cancel button when cancelLabel is set and buttonLabel is empty', async () => {
      el.cancelLabel = 'Cancel';
      await el.updateComplete;
      const buttons = el.shadowRoot!.querySelectorAll('trailhand-button');
      expect(buttons.length).toBe(1);
    });

    it('renders both buttons when buttonLabel and cancelLabel are set', async () => {
      el.buttonLabel = 'Create';
      el.cancelLabel = 'Cancel';
      await el.updateComplete;
      const buttons = el.shadowRoot!.querySelectorAll('trailhand-button');
      expect(buttons.length).toBe(2);
    });
  });

  describe('Events', () => {
    it('form-card-submit event bubbles and is composed when primary button is clicked', async () => {
      el.buttonLabel = 'Create';
      await el.updateComplete;

      let event: unknown = null;
      document.body.addEventListener('form-card-submit', (e) => { event = e; }, { once: true });

      const buttons = el.shadowRoot!.querySelectorAll('trailhand-button');
      buttons[0].dispatchEvent(new CustomEvent('button-click', { bubbles: true, composed: true }));

      expect(event).not.toBeNull();
      expect((event as Event).bubbles).toBe(true);
      expect((event as Event).composed).toBe(true);
    });

    it('form-card-cancel event bubbles and is composed when cancel button is clicked', async () => {
      el.cancelLabel = 'Cancel';
      await el.updateComplete;

      let event: unknown = null;
      document.body.addEventListener('form-card-cancel', (e) => { event = e; }, { once: true });

      const buttons = el.shadowRoot!.querySelectorAll('trailhand-button');
      buttons[0].dispatchEvent(new CustomEvent('button-click', { bubbles: true, composed: true }));

      expect(event).not.toBeNull();
      expect((event as Event).bubbles).toBe(true);
      expect((event as Event).composed).toBe(true);
    });

    it('cancel button is first when both buttons are rendered', async () => {
      el.buttonLabel = 'Create';
      el.cancelLabel = 'Cancel';
      await el.updateComplete;

      let cancelFired = false;
      let submitFired = false;
      document.body.addEventListener('form-card-cancel', () => { cancelFired = true; }, { once: true });
      document.body.addEventListener('form-card-submit', () => { submitFired = true; }, { once: true });

      const buttons = el.shadowRoot!.querySelectorAll('trailhand-button');
      buttons[0].dispatchEvent(new CustomEvent('button-click', { bubbles: true, composed: true }));

      expect(cancelFired).toBe(true);
      expect(submitFired).toBe(false);
    });
  });
});
