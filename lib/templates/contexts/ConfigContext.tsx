import { createContext, useContext } from "react";
import { EAnkhColorTone, IAnkhCmsConfig, TStyle } from 'ankh-types';

export function getConfig() {
  const nav = {
    ui: 'AnkhUiNav',
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
  const header = { ui: 'AnkhUiHtml', p: { tagName: 'header' }, uis: [{ ...nav }] };
  const styles: TStyle[] = [
    [':root', '--primary-color', 'hsl(219, 78%, 33%)'],
    [':root', '--secondary-color', 'hsl(39, 22%, 67%)'],
    [':root', '--base-color', 'hsl(0, 0%, 93%)'],
    ['html', 'font-family', 'Arial'],
    ['html', 'font-size', '100%'],
    ['body', 'background-color', '#fff'],
    ['body', 'text-align', 'center'],
    ['body', 'color', '#323235'],
    ['body > header', 'padding', '1rem'],
    ['body > header', 'background-color', '#222'],
    ["[data-ui='accordion']", 'background-color', '#cdcdd1'],
    ["[data-ui='accordion']", 'padding', '2rem'],
    ["[data-ui='accordion-summary']", 'text-transform', 'uppercase'],
    ["[data-ui='accordion-details']", 'letter-spacing', '.8rem'],
    ["[data-ui='nav']", 'display', 'flex'],
    ["[data-ui='nav'] a:link", 'text-decoration', 'none'],
    ["[data-ui='nav'] a", 'color', '#fff'],
    ["[data-ui='nav'] a", 'padding', '1rem'],
    ["[data-ui='nav'] a.active", 'background-color', '#000'],
    ["[data-ui='nav'] a > span", 'display', 'flex'],
    ["[data-ui='nav'] a > span", 'gap', '.3rem'],
    ["[data-ui='nav'] a > span", 'align-items', 'center'],
  ];

  return {
    styles: [...styles],
    public: [
      {
        name: 'images',
        files: ['./logo.png'],
      },
    ],
    theme: {
      colors: {
        primary: "hsl(219, 78%, 33%)",
        secondary: "hsl(39, 22%, 67%)",
        accent: "",
        base: "hsl(0, 0%, 93%)"
      },
    },
    pages: [
      {
        name: 'ankh-theming',
        uis: [
          { ...header },
          {
            ui: 'AnkhUiHtml',
            p: { tagName: 'main' },
            uis: [
              {
                ui: 'AnkhUiHtml', p: {}, uis: [
                  { ui: 'AnkhUiHeading', p: { level: 'h1', text: 'Theme' } },
                  { ui: 'AnkhUiHeading', p: { level: 'h2', text: 'Colors' } },
                  { ui: 'AnkhUiColorPaletteGenerator', p: { tone: EAnkhColorTone.Jewel } },
                  { ui: 'AnkhUiColorWheel', p: {} },
                  { ui: 'AnkhUiColorHue', p: { color: 'lab(20 -10 -50)' } },
                ],
              }]
          },
        ],
      },
      {
        name: 'home',
        uis: [
          { ...header },
          {
            ui: 'AnkhUiHtml',
            p: { tagName: 'main' },
            uis: [
              {
                ui: 'AnkhUiImage',
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
            ui: 'AnkhUiHtml',
            p: { tagName: 'main' },
            uis: [
              {
                ui: 'AnkhUiGrid',
                p: { columns: 4 },
                uis: [
                  { ui: 'AnkhUiHtml', p: { text: '1' } },
                  { ui: 'AnkhUiHtml', p: { text: '2' } },
                  { ui: 'AnkhUiHtml', p: { text: '3' } },
                  { ui: 'AnkhUiHtml', p: { text: '4' } },
                  { ui: 'AnkhUiHtml', p: { text: '5' } },
                  { ui: 'AnkhUiHtml', p: { text: '6' } },
                  { ui: 'AnkhUiHtml', p: { text: '7' } },
                  { ui: 'AnkhUiHtml', p: { text: '8' } },
                  { ui: 'AnkhUiHtml', p: { text: '9' } },
                  { ui: 'AnkhUiHtml', p: { text: '10' } },
                  { ui: 'AnkhUiHtml', p: { text: '11' } },
                  { ui: 'AnkhUiHtml', p: { text: '12' } },
                ],
              }
            ],
          },
        ],
      }
    ],
  } as IAnkhCmsConfig;
}

export const AnkhCmsConfigContext = createContext<IAnkhCmsConfigContext | null>(null);

export function useAnkhCmsConfig() {
  return useContext(AnkhCmsConfigContext);
}

interface IAnkhCmsConfigContext {
  config: IAnkhCmsConfig,
  setConfig: React.Dispatch<React.SetStateAction<IAnkhCmsConfig>>
}