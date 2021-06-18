export * from "./core/PageProps.d.ts";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      button: any;
      div: any;
      h1: any;
      p: any;
      pre: any;
    }
  }
}
