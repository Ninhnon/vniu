declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png';

declare module '@env' {
  export const API_URL: string;
  export const DEEPAR_SDK: string;
}
