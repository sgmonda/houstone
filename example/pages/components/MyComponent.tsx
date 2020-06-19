import { React, Component, createComponent, State } from "../../../mod.ts";

export interface Props {
  a?: number;
  b?: string;
}

type MyState = {
  c: number;
  d: string;
};

const MyComponent: Component<Props, MyState> = (
  { a, b }: Props,
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
      <p>hello</p>
      <p>{c}</p>
      <button onClick={onClick}>
        Click me
      </button>
    </>
  );
};

const initialState = { c: 0, d: "Hello" };

export default createComponent<Props, MyState>(MyComponent, initialState);
