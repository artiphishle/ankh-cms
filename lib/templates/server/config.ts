// 'use server';
// import 'server-only';
import { IAnkhCmsConfig, TStyle } from 'ankh-types';

const nav = {
  ui: 'Nav',
  p: {
    items: [
      {
        name: 'home',
        icon: 'House',
      },
      {
        name: 'about',
        icon: 'Factory',
      },
      {
        name: 'ankh-theming',
        icon: 'Settings',
      },
    ],
  },
};
const header = { ui: 'Html', p: { tagName: 'header' }, uis: [{ ...nav }] };

const styles: TStyle[] = [
  [':root', '--primary-color', 'lab(20 -10 -50)'],
  [':root', '--secondary-color', 'lab(50 -30 -80)'],
  [':root', '--base-color', 'lab(90 -120 40)'],
  [
    '.primary-900',
    'background-color',
    'lab(from var(--primary-color) calc(l + 60) a b)',
  ],
  [
    '.primary-800',
    'background-color',
    'lab(from var(--primary-color) calc(l + 45) a b)',
  ],
  [
    '.primary-700',
    'background-color',
    'lab(from var(--primary-color) calc(l + 30) a b)',
  ],
  [
    '.primary-600',
    'background-color',
    'lab(from var(--primary-color) calc(l + 15) a b)',
  ],
  ['.primary-500', 'background-color', 'var(--primary-color)'],
  [
    '.primary-400',
    'background-color',
    'lab(from var(--primary-color) calc(l - 15) a b)',
  ],
  [
    '.primary-300',
    'background-color',
    'lab(from var(--primary-color) calc(l - 30) a b)',
  ],
  [
    '.primary-200',
    'background-color',
    'lab(from var(--primary-color) calc(l - 45) a b)',
  ],
  [
    '.primary-100',
    'background-color',
    'lab(from var(--primary-color) calc(l - 60) a b)',
  ],
  [
    '.secondary-900',
    'background-color',
    'lab(from var(--secondary-color) calc(l + 60) a b)',
  ],
  [
    '.secondary-800',
    'background-color',
    'lab(from var(--secondary-color) calc(l + 45) a b)',
  ],
  [
    '.secondary-700',
    'background-color',
    'lab(from var(--secondary-color) calc(l + 30) a b)',
  ],
  [
    '.secondary-600',
    'background-color',
    'lab(from var(--secondary-color) calc(l + 15) a b)',
  ],
  ['.secondary-500', 'background-color', 'var(--secondary-color)'],
  [
    '.secondary-400',
    'background-color',
    'lab(from var(--secondary-color) calc(l - 15) a b)',
  ],
  [
    '.secondary-300',
    'background-color',
    'lab(from var(--secondary-color) calc(l - 30) a b)',
  ],
  [
    '.secondary-200',
    'background-color',
    'lab(from var(--secondary-color) calc(l - 45) a b)',
  ],
  [
    '.secondary-100',
    'background-color',
    'lab(from var(--secondary-color) calc(l - 60) a b)',
  ],
  [
    '.base-900',
    'background-color',
    'lab(from var(--base-color) calc(l + 60) a b)',
  ],
  [
    '.base-800',
    'background-color',
    'lab(from var(--base-color) calc(l + 45) a b)',
  ],
  [
    '.base-700',
    'background-color',
    'lab(from var(--base-color) calc(l + 30) a b)',
  ],
  [
    '.base-600',
    'background-color',
    'lab(from var(--base-color) calc(l + 15) a b)',
  ],
  [
    '.base-500',
    'background-color',
    'lab(from var(--base-color)',
  ],
  [
    '.base-400',
    'background-color',
    'lab(from var(--base-color) calc(l - 15) a b)',
  ],
  [
    '.base-300',
    'background-color',
    'lab(from var(--base-color) calc(l - 30) a b)',
  ],
  [
    '.base-200',
    'background-color',
    'lab(from var(--base-color) calc(l - 45) a b)',
  ],
  [
    '.base-100',
    'background-color',
    'lab(from var(--base-color) calc(l - 60) a b)',
  ],
  ['html', 'font-family', 'Arial'],
  ['html', 'font-size', '100%'],
  ['body', 'background-color', '#fff'],
  ['body', 'text-align', 'center'],
  ['body', 'color', '#323235'],
  ['main', 'padding', '1rem 2rem'],
  ['h1', 'text-align', 'left'],
  ['h1', 'font-size', '2.4rem'],
  ['h1', 'font-weight', '700'],
  ['h1', 'margin', '2rem auto 1rem'],
  ['h2', 'text-align', 'left'],
  ['h2', 'font-size', '1.8rem'],
  ['h2', 'font-weight', '700'],
  ['h2', 'margin', '2rem auto 1rem'],
  ['h3', 'text-align', 'left'],
  ['h3', 'font-size', '1.4rem'],
  ['h3', 'font-weight', '700'],
  ['h3', 'margin', '2rem auto 1rem'],
  ['img', 'text-align', 'center'],
  ['img', 'margin-top', '40vh'],
  ['body > header', 'padding', '1rem'],
  ['body > header', 'background-color', '#222'],
  ["[data-ui='grid']", 'display', 'grid'],
  ["[data-ui='grid']", 'gap', '2rem'],
  ["[data-ui='grid-cell']", 'margin', '2rem'],
  ["[data-ui='grid-cell']", 'background-color', 'azure'],
  ["[data-ui='accordion']", 'background-color', '#cdcdd1'],
  ["[data-ui='accordion']", 'padding', '2rem'],
  ["[data-ui='accordion-summary']", 'text-transform', 'uppercase'],
  ["[data-ui='accordion-details']", 'letter-space', '.8rem'],
  ["[data-ui='nav']", 'display', 'flex'],
  ["[data-ui='nav'] a:link", 'text-decoration', 'none'],
  ["[data-ui='nav'] a", 'color', '#fff'],
  ["[data-ui='nav'] a", 'padding', '1rem'],
  ["[data-ui='nav'] a.active", 'background-color', '#000'],
  ["[data-ui='nav'] a > span", 'display', 'flex'],
  ["[data-ui='nav'] a > span", 'gap', '.3rem'],
  ["[data-ui='nav'] a > span", 'align-items', 'center'],
];

export const config: IAnkhCmsConfig = {
  styles: [...styles],
  public: [
    {
      name: 'images',
      files: ['./logo.png'],
    },
  ],
  pages: [
    {
      name: 'ankh-theming',
      uis: [
        { ...header },
        {
          ui: 'Html',
          p: { tagName: 'main' },
          uis: [
            { ui: 'Heading', p: { level: 'h1', text: 'Ankh_Theming' } },
            { ui: 'Heading', p: { level: 'h2', text: 'Colors' } },
            { ui: 'Heading', p: { level: 'h3', text: 'Primary' } },
            { ui: 'ColorHue', p: { color: 'lab(20 -10 -50)' } },
            { ui: 'Heading', p: { level: 'h3', text: 'Complementary' } },
            { ui: 'ColorHue', p: { color: 'lab(20 -10 -50)' } },
            { ui: 'Heading', p: { level: 'h3', text: 'Accent' } },
            { ui: 'ColorHue', p: { color: 'lab(20 -10 -50)' } },
            { ui: 'Heading', p: { level: 'h3', text: 'Base' } },
            { ui: 'ColorHue', p: { color: 'lab(20 -10 -50)' } },
          ],
        },
      ],
    },
    {
      name: 'home',
      uis: [
        { ...header },
        {
          ui: 'Html',
          p: { tagName: 'main' },
          uis: [
            {
              ui: 'Image',
              p: {
                alt: 'Logo',
                src: '/images/logo.png',
                width: 625,
                height: 125,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'about',
      uis: [
        { ...header },
        {
          ui: 'Html',
          p: { tagName: 'main' },
          uis: [
            {
              ui: 'Grid',
              p: {},
              uis: [
                { ui: 'Html', p: { text: '1' } },
                { ui: 'Html', p: { text: '2' } },
              ],
            },
          ],
        },
      ],
    },
  ],
};
