import { createComponent, PageProps, React, State } from "../../mod.ts";
import { Component } from "../../core/mod.ts";
import MyComponent from "../components/MyComponent.tsx";

export interface Props extends PageProps {
  a?: number;
  b?: string;
}

type MyState = {
  s1: number;
  s2: string;
};

const MyPage: Component<Props, MyState> = (
  props: Props,
  state: State<MyState>,
): string => {
  return (
    <>
      <p>I'm index page 2</p>
      <div>
        PROPS:
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
      <div>
        STATE:
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
      <MyComponent />
    </>
  );
};

const initialState = { s1: 23, s2: "Hello" };

export default createComponent<Props, MyState>(MyPage, initialState);
