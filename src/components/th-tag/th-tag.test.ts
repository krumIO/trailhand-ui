import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './th-tag';
import type { ThTag } from './th-tag';

describe('ThTag', () => {
  let el: ThTag;

  const tag = () => el.shadowRoot!.querySelector('.tag')!;
  const dismiss = () => el.shadowRoot!.querySelector<HTMLButtonElement>('.tag__dismiss');

  beforeEach(async () => {
    el = document.createElement('trailhand-tag') as ThTag;
    el.label = 'Running';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Rendering', () => {
    it('renders the label', () => {
      expect(el.shadowRoot!.querySelector('.tag__label')!.textContent!.trim()).toBe('Running');
    });

    it('renders slotted content when no label is set', async () => {
      el.label = '';
      el.textContent = 'Slotted';
      await el.updateComplete;
      const slot = el.shadowRoot!.querySelector('slot')!;
      expect(slot.assignedNodes()[0].textContent).toBe('Slotted');
    });

    it('defaults to default variant and md size', () => {
      expect(tag().classList.contains('tag--default')).toBe(true);
      expect(tag().classList.contains('tag--md')).toBe(true);
    });

    it.each(['success', 'warning', 'error', 'info'] as const)(
      'applies %s variant class',
      async (variant) => {
        el.variant = variant;
        await el.updateComplete;
        expect(tag().classList.contains(`tag--${variant}`)).toBe(true);
      },
    );

    it.each(['sm', 'lg'] as const)('applies %s size class', async (size) => {
      el.size = size;
      await el.updateComplete;
      expect(tag().classList.contains(`tag--${size}`)).toBe(true);
    });

    it('applies outlined class', async () => {
      el.outlined = true;
      await el.updateComplete;
      expect(tag().classList.contains('tag--outlined')).toBe(true);
    });

    it('renders icon only when set', async () => {
      expect(el.shadowRoot!.querySelector('.tag__icon')).toBeNull();
      el.icon = 'close';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.tag__icon trailhand-icon');
      expect(icon!.getAttribute('name')).toBe('close');
    });

    it('reads attributes set in markup', async () => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML =
        '<trailhand-tag label="x" variant="error" size="sm" outlined></trailhand-tag>';
      document.body.appendChild(wrapper);
      const t = wrapper.querySelector('trailhand-tag') as ThTag;
      await t.updateComplete;
      const cls = t.shadowRoot!.querySelector('.tag')!.classList;
      expect(cls.contains('tag--error')).toBe(true);
      expect(cls.contains('tag--sm')).toBe(true);
      expect(cls.contains('tag--outlined')).toBe(true);
      wrapper.remove();
    });
  });

  describe('Dismiss', () => {
    it('does not render dismiss button by default', () => {
      expect(dismiss()).toBeNull();
    });

    it('renders an accessible dismiss button when dismissible', async () => {
      el.dismissible = true;
      await el.updateComplete;
      expect(dismiss()!.getAttribute('aria-label')).toBe('Remove tag');
      expect(dismiss()!.getAttribute('type')).toBe('button');
    });

    it('emits composed, bubbling tag-dismiss with value', async () => {
      el.dismissible = true;
      el.value = 'app-1';
      await el.updateComplete;
      let event: CustomEvent | null = null;
      document.body.addEventListener(
        'tag-dismiss',
        (e) => {
          event = e as CustomEvent;
        },
        { once: true },
      );
      dismiss()!.click();
      expect(event).not.toBeNull();
      expect(event!.bubbles).toBe(true);
      expect(event!.composed).toBe(true);
      expect(event!.detail).toEqual({ value: 'app-1' });
    });

    it('falls back to label when value is empty', async () => {
      el.dismissible = true;
      await el.updateComplete;
      const listener = vi.fn();
      el.addEventListener('tag-dismiss', listener);
      dismiss()!.click();
      expect(listener.mock.calls[0][0].detail).toEqual({ value: 'Running' });
    });

    it('does not propagate the native click', async () => {
      el.dismissible = true;
      await el.updateComplete;
      const listener = vi.fn();
      el.addEventListener('click', listener);
      dismiss()!.click();
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
