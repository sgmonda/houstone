import { React } from "../deps.ts";
import PageProps from "./PageProps.d.ts";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      button: any;
      div: any;
      h1: any;
      p: any;
    }
  }
}

interface Props {
  port: number;
}

class Page<PageProps, State> {
  constructor(props: Props) {
    console.log("PAGE PROPS", props);
  }
}

export default Page;
