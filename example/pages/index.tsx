import { React, createComponent, State, PageProps } from "../../mod.ts";
import { Component } from "../../core/mod.ts";
import MyComponent from "../components/MyComponent.tsx";

export interface Props extends PageProps {
  a?: number;
  b?: string;
}

type MyState = {
  c: number;
  d: string;
};

const MyPage: Component<Props, MyState> = (
  { a, b, location }: Props,
  { c, d, setState }: State<MyState>,
): string => {
  console.log("LAS PROPS QUE LLEGAN", a, b);
  console.log("EL STATE QUE LLEGA", c, d);
  const onClick = (e: any) => {
    e.preventDefault();
    console.log("CLICK!");
    // setState({ c: Math.random(), d: "Random" });
  };
  return (
    <>
      <p>I'm index page</p>
      <div>
        {JSON.stringify(location)}
      </div>
      <MyComponent />
      {/* <p>URL: {location.url}</p>
      <p>PATH: {location.path}</p> */}
    </>
  );
};

const initialState = { c: 0, d: "Hello" };

export default createComponent<Props, MyState>(MyPage, initialState);
