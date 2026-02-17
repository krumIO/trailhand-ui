import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './button';
import type { Button } from './button';

describe('Button', () => {
  let el: Button;
  let innerButton: HTMLButtonElement;

  beforeEach(async () => {
    el = document.createElement('trailhand-button') as Button;
    el.setAttribute('name', 'test-btn');
    document.body.appendChild(el);
    await el.updateComplete;
    innerButton = el.shadowRoot!.querySelector('button')!;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('emits correct event detail', async () => {
    let detail: any;

    el.name = 'my-btn';
    await el.updateComplete;

    el.addEventListener('button-click', (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    innerButton.click();

    expect(detail.name).toBe('my-btn');
    expect(detail.originalEvent).toBeInstanceOf(Event);
  });

  it('event bubbles and is composed', async () => {
    let event!: CustomEvent;

    el.addEventListener('button-click', (e: Event) => {
      event = e as CustomEvent;
    });

    innerButton.click();

    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('does not emit button-click when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;

    let fired = false;
    el.addEventListener('button-click', () => {
      fired = true;
    });

    innerButton.click();

    expect(fired).toBe(false);
  });

  it('toggles aria-disabled correctly', async () => {
    el.disabled = true;
    await el.updateComplete;

    expect(el.getAttribute('aria-disabled')).toBe('true');

    el.disabled = false;
    await el.updateComplete;

    expect(el.hasAttribute('aria-disabled')).toBe(false);
  });
});
