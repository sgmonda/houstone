import PageProps from "./PageProps.d.ts";

interface Props {
  port: number;
}

class Page<PageProps, State> {
  constructor(props: Props) {
    console.log("PAGE PROPS", props);
  }
}

export default Page;
