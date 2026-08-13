export interface IconDefinition {
  viewBox: string;
  path: string;
}

export const ICONS: Record<string, IconDefinition> = {
  delete: {
    viewBox: '0 -960 960 960',
    path: 'M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z',
  },
  done: {
    viewBox: '0 -960 960 960',
    path: 'M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z',
  },
  edit: {
    viewBox: '0 -960 960 960',
    path: 'M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z',
  },
  rename: {
    viewBox: '0 -960 960 960',
    path: 'M80-120v-80h800v80H80Zm680-160v-560h60v560h-60Zm-600 0 210-560h100l210 560h-96l-50-144H308l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z',
  },
  'add-collection': {
    viewBox: '0 -960 960 960',
    path: 'M520-400h80v-120h120v-80H600v-120h-80v120H400v80h120v120ZM240-240v-640h640v640H240ZM80-80v-640h80v560h560v80H80Z',
  },
  add: {
    viewBox: '0 -960 960 960',
    path: 'M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z',
  },
  arrowLeft: {
    viewBox: '0 -960 960 960',
    path: 'M360-200 80-480l280-280 56 56-183 184h647v80H233l184 184-57 56Z',
  },
  arrowRight: {
    viewBox: '0 -960 960 960',
    path: 'm600-200-57-56 184-184H80v-80h647L544-704l56-56 280 280-280 280Z',
  },
  arrowUp: {
    viewBox: '0 -960 960 960',
    path: 'M440-80v-647L256-544l-56-56 280-280 280 280-56 57-184-184v647h-80Z',
  },
  arrowDown: {
    viewBox: '0 -960 960 960',
    path: 'M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z',
  },
};
