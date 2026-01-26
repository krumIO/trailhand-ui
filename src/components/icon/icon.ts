import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faGlobe, faHome, faUser } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  globe: faGlobe,
  home: faHome,
  user: faUser,
};

library.add(...Object.values(iconMap));

export type AvailableIcons = keyof typeof iconMap;

export class Icon extends LitElement {
  @property({ type: String }) name: AvailableIcons = 'user';

  static styles = css`
    :host {
      display: inline-flex;
      width: 1em;
      height: 1em;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `;

  render() {
    const faIcon = icon({ prefix: 'fas', iconName: this.name });
    return faIcon ? html`${faIcon.node[0]}` : null;
  }
}

customElements.define('trailhand-icon', Icon);
