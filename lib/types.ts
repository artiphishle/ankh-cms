/**
 * @types ankh-css
 */
type THtmlElement = string;
type TCssProperty = string;
type TCssValue = string | number;
export type TStyle = [THtmlElement, TCssProperty, TCssValue];

/**
 * @types ankh-cms config
 */
type TAnkhUiProps = Record<string, unknown>;
type TPublic = Array<{ name: string; files: string[]; }>

export interface IAnkhUi {
  ui: string;
  p: TAnkhUiProps,
  uis?: IAnkhUi[]
}
export interface IAnkhPage {
  uis: IAnkhUi[];
  name: string;
}
export interface IAnkhCmsConfig {
  pages: IAnkhPage[]
  public?: TPublic;
  styles?: TStyle[];
}

