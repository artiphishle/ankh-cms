type THtmlElement = string;
type TCssProperty = string;
type TCssValue = string | number;
export type TStyle = [THtmlElement, TCssProperty, TCssValue];

interface IComponent {name: string; target: string; styles?: TStyle[]}
interface IPage {name: string; components: IComponent[]}
export interface IAnkhCmsConfig {styles: TStyle[]; pages: IPage[]}