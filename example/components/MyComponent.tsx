import { Component, createComponent, React, State } from "../../mod.ts";

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
  const onClick = (e: any) => {
    e.preventDefault();
    console.log("CLICK!");
    setState({ c: Math.random(), d: "Random" });
  };
  return (
    <div style={{ border: "solid 1px green" }}>
      COMPONENT
      <p>{c}</p>
      <button onClick={onClick}>
        Click me
      </button>
    </div>
  );
};

const initialState = { c: 0, d: "Hello" };

export default createComponent<Props, MyState>(MyComponent, initialState);
