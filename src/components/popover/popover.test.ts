import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './popover';
import type { Popover } from './popover';

describe('Popover', () => {
  let el: Popover;

  beforeEach(async () => {
    el = document.createElement('trailhand-popover') as Popover;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Reactive property updates', () => {
    it('reflects open attribute when set to true', async () => {
      el.open = true;
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('removes open attribute when set to false', async () => {
      el.open = true;
      await el.updateComplete;
      el.open = false;
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('applies open class to popover content when open', async () => {
      el.open = true;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.popover-content')!;
      expect(content.classList.contains('popover-content--open')).toBe(true);
    });

    it('removes open class from popover content when closed', async () => {
      el.open = true;
      await el.updateComplete;
      el.open = false;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.popover-content')!;
      expect(content.classList.contains('popover-content--open')).toBe(false);
    });

    it('reflects placement attribute', async () => {
      el.placement = 'top';
      await el.updateComplete;
      expect(el.getAttribute('placement')).toBe('top');
    });
  });

  describe('Header', () => {
    it('does not render header when title is not set', async () => {
      const header = el.shadowRoot!.querySelector('.popover-header');
      expect(header).toBeNull();
    });

    it('renders header when title is set', async () => {
      el.title = 'Filter Options';
      await el.updateComplete;
      const header = el.shadowRoot!.querySelector('.popover-header');
      expect(header).not.toBeNull();
    });

    it('renders title text', async () => {
      el.title = 'My Title';
      await el.updateComplete;
      const title = el.shadowRoot!.querySelector('.popover-title')!;
      expect(title.textContent).toBe('My Title');
    });

    it('renders subtitle when set alongside title', async () => {
      el.title = 'My Title';
      el.subtitle = 'v2.0';
      await el.updateComplete;
      const subtitle = el.shadowRoot!.querySelector('.popover-subtitle')!;
      expect(subtitle.textContent).toBe('v2.0');
    });

    it('does not render subtitle element when subtitle is not set', async () => {
      el.title = 'My Title';
      await el.updateComplete;
      const subtitle = el.shadowRoot!.querySelector('.popover-subtitle');
      expect(subtitle).toBeNull();
    });
  });

  describe('Toggle behavior', () => {
    it('opens when trigger wrapper is clicked', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger-wrapper') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      expect(el.open).toBe(true);
    });

    it('closes when trigger wrapper is clicked again', async () => {
      const trigger = el.shadowRoot!.querySelector('.trigger-wrapper') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      trigger.click();
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('closes on outside click when stayOpen is false', async () => {
      el.open = true;
      await el.updateComplete;
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('stays open on outside click when stayOpen is true', async () => {
      el.stayOpen = true;
      el.open = true;
      await el.updateComplete;
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await el.updateComplete;
      expect(el.open).toBe(true);
    });
  });

  describe('Events', () => {
    it('dispatches popover-open when opened', async () => {
      let fired = false;
      el.addEventListener('popover-open', () => (fired = true), { once: true });
      const trigger = el.shadowRoot!.querySelector('.trigger-wrapper') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      expect(fired).toBe(true);
    });

    it('dispatches popover-close when closed', async () => {
      el.open = true;
      await el.updateComplete;
      let fired = false;
      el.addEventListener('popover-close', () => (fired = true), { once: true });
      const trigger = el.shadowRoot!.querySelector('.trigger-wrapper') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      expect(fired).toBe(true);
    });

    it('popover-open event bubbles and is composed', async () => {
      let event: Event | null = null;
      document.body.addEventListener('popover-open', (e) => (event = e), { once: true });
      const trigger = el.shadowRoot!.querySelector('.trigger-wrapper') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      expect(event).not.toBeNull();
      expect((event as Event).bubbles).toBe(true);
      expect((event as Event).composed).toBe(true);
    });

    it('popover-close event bubbles and is composed', async () => {
      el.open = true;
      await el.updateComplete;
      let event: Event | null = null;
      document.body.addEventListener('popover-close', (e) => (event = e), { once: true });
      const trigger = el.shadowRoot!.querySelector('.trigger-wrapper') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      expect(event).not.toBeNull();
      expect((event as Event).bubbles).toBe(true);
      expect((event as Event).composed).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('trigger wrapper has aria-haspopup', () => {
      const trigger = el.shadowRoot!.querySelector('.trigger-wrapper')!;
      expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    });

    it('trigger wrapper reflects aria-expanded when open', async () => {
      el.open = true;
      await el.updateComplete;
      const trigger = el.shadowRoot!.querySelector('.trigger-wrapper')!;
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('popover content has role dialog', () => {
      const content = el.shadowRoot!.querySelector('.popover-content')!;
      expect(content.getAttribute('role')).toBe('dialog');
    });

    it('popover content has aria-hidden true when closed', async () => {
      const content = el.shadowRoot!.querySelector('.popover-content')!;
      expect(content.getAttribute('aria-hidden')).toBe('true');
    });

    it('popover content has aria-hidden false when open', async () => {
      el.open = true;
      await el.updateComplete;
      const content = el.shadowRoot!.querySelector('.popover-content')!;
      expect(content.getAttribute('aria-hidden')).toBe('false');
    });
  });
});
