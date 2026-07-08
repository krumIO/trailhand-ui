import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { library, icon } from '@fortawesome/fontawesome-svg-core';

import {
  faGlobe,
  faHome,
  faUser,
  faBug,
  faCircleExclamation,
  faCirclePause,
  faCirclePlay,
  faCircleXmark,
  faTableCellsLarge,
  faRocket,
  faGauge,
  faTableList,
  faFolderPlus,
  faGears,
  faBagShopping,
  faCircleInfo,
  faChartLine,
  faSliders,
  faDatabase,
  faCircleCheck,
  faTriangleExclamation,
  faScrewdriverWrench,
  faBan,
  faSpinner,
  faGear,
  faXmark,
  faMinus,
  faCheck,
  faPlus,
  faHammer,
  faCodeBranch,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  bug: faBug,
  error: faCircleExclamation,
  pause: faCirclePause,
  play: faCirclePlay,
  close: faCircleXmark,
  globe: faGlobe,
  home: faHome,
  user: faUser,
  table: faTableCellsLarge,
  rocket: faRocket,
  gauge: faGauge,
  list: faTableList,
  folderPlus: faFolderPlus,
  gears: faGears,
  shoppingBag: faBagShopping,
  info: faCircleInfo,
  chartLine: faChartLine,
  sliders: faSliders,
  database: faDatabase,
  circleCheck: faCircleCheck,
  warning: faTriangleExclamation,
  tools: faScrewdriverWrench,
  cancel: faBan,
  loading: faSpinner,
  gear: faGear,
  x: faXmark,
  minus: faMinus,
  check: faCheck,
  plus: faPlus,
  hammer: faHammer,
  codeBranch: faCodeBranch,
  trash: faTrashCan,
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
  `;

  render() {
    const iconDef = iconMap[this.name];
    if (!iconDef) return null;
    const faIcon = icon(iconDef);
    return faIcon ? html`${faIcon.node[0]}` : null;
  }
}

customElements.define('trailhand-icon', Icon);
