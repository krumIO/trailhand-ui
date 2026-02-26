import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faBug,
  faCircleExclamation,
  faCirclePause,
  faCirclePlay,
  faCircleXmark,
  faGrid2
} from '@fortawesome/pro-duotone-svg-icons';
import { faGlobe, faHome, faUser } from '@fortawesome/free-solid-svg-icons';


const iconMap = {
  bug: faBug,
  error: faCircleExclamation,
  pause: faCirclePause,
  play: faCirclePlay,
  close: faCircleXmark,
  globe: faGlobe,
  home: faHome,
  user: faUser,
  grid: faGrid2
};

export const availableIcons = Object.keys(iconMap) as (keyof typeof iconMap)[];

library.add(...Object.values(iconMap));

type AvailableIcons = keyof typeof iconMap;

export interface IconProps {
  name: AvailableIcons;
}

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
    }
    /* Duotone icon styling */
    svg .fa-primary {
      fill: var(--fa-primary-color, currentColor);
      opacity: var(--fa-primary-opacity, 1);
    }
    svg .fa-secondary {
      fill: var(--fa-secondary-color, currentColor);
      opacity: var(--fa-secondary-opacity, 0.4);
    }
  `;

  render() {
    const iconDef = iconMap[this.name];
    if (!iconDef) return null;
    const faIcon = icon(iconDef);
    return faIcon ? html`${faIcon.node[0]}` : null;
  }
}

customElements.define('trailhand-icon', Icon);
