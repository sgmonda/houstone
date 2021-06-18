import { PageProps } from "../../mod.ts";
import React from "https://dev.jspm.io/react@16.14.0";
// const React = _React as any;

export interface Props extends PageProps {
  a?: number;
  b?: string;
}

type State = {
  count: number;
};

const MyPage = (props: Props) => {
  const [state, setState] = (React as any).useState({ count: 3 });
  const onClick = () => {
    console.log("CLICK");
    setState({ count: state.count + 1 });
  };
  return (
    <>
      <p>Page 3</p>
      <div>
        PROPS:
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
      <div>
        STATE:
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
      <button onClick={onClick}>increase</button>
      {/* <MyComponent /> */}
    </>
  );
};

export default MyPage;

export const getInitialProps = async (pageProps: PageProps): Promise<Props> => {
  console.log("get initial props", pageProps);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ...pageProps, a: 1, b: "dos" };
};
