import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './modal';
import type { Modal } from './modal';

describe('Modal', () => {
  let el: Modal;

  beforeEach(async () => {
    el = document.createElement('trailhand-modal') as Modal;
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

    it('renders subtitle when set', async () => {
      el.subtitle = 'Test Subtitle';
      await el.updateComplete;
      const subtitle = el.shadowRoot!.querySelector('.modal-subtitle')!;
      expect(subtitle.textContent).toBe('Test Subtitle');
    });

    it('does not render subtitle when not set', async () => {
      const subtitle = el.shadowRoot!.querySelector('.modal-subtitle');
      expect(subtitle).toBeNull();
    });
  });

  describe('Footer slot', () => {
    it('hides footer when no footer slot content provided', async () => {
      const footer = el.shadowRoot!.querySelector('.modal-footer')!;
      expect(footer.classList.contains('modal-footer--empty')).toBe(true);
    });

    it('shows footer when footer slot content is provided', async () => {
      const footerContent = document.createElement('div');
      footerContent.slot = 'footer';
      footerContent.textContent = 'Footer content';
      el.appendChild(footerContent);

      // wait for slotchange to fire and Lit to re-render
      await new Promise((resolve) => setTimeout(resolve, 0));
      await el.updateComplete;

      const footer = el.shadowRoot!.querySelector('.modal-footer')!;
      expect(footer.classList.contains('modal-footer--empty')).toBe(false);
    });
  });

  describe('Events', () => {
    it('modal-open event bubbles and is composed', async () => {
      let event: unknown = null;
      document.body.addEventListener(
        'modal-open',
        (e) => {
          event = e;
        },
        { once: true },
      );
      el.open = true;
      await el.updateComplete;
      expect(event).not.toBeNull();
      expect((event as Event).bubbles).toBe(true);
      expect((event as Event).composed).toBe(true);
    });

    it('modal-close event bubbles and is composed', async () => {
      el.open = true;
      await el.updateComplete;
      let event: unknown = null;
      document.body.addEventListener(
        'modal-close',
        (e) => {
          event = e;
        },
        { once: true },
      );
      el.open = false;
      await el.updateComplete;
      expect(event).not.toBeNull();
      expect((event as Event).bubbles).toBe(true);
      expect((event as Event).composed).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has aria-modal set to true', () => {
      const dialog = el.shadowRoot!.querySelector('dialog')!;
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('has aria-labelledby pointing to modal-title', () => {
      const dialog = el.shadowRoot!.querySelector('dialog')!;
      expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
    });

    it('title element has id of modal-title', async () => {
      el.title = 'Accessible Title';
      await el.updateComplete;
      const title = el.shadowRoot!.querySelector('#modal-title')!;
      expect(title).not.toBeNull();
      expect(title.textContent).toBe('Accessible Title');
    });
  });
});
