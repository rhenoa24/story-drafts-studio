import { Component, computed, input } from '@angular/core';
import { ICONS } from './icons';

@Component({
  selector: 'app-icon',
  standalone: true,

  template: `
    @if (iconData(); as data) {
      <svg xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="data.viewBox" aria-hidden="true">
        <path [attr.d]="data.path" />
      </svg>
    }
  `,

  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      line-height: 0;
      flex-shrink: 0;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `,
})
export class IconComponent {
  icon = input.required<string>();

  iconData = computed(() => ICONS[this.icon()]);
}
