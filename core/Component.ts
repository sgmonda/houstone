import { React } from "../deps.ts";
const { useState } = React as any;
export interface Component<Props, S> {
  (props: Props, state: State<S>): string;
}

export type State<S> = S & {
  setState: (state: S) => void;
};

export function createComponent<P, S>(fun: Component<P, S>, initialState: S) {
  const result = (props: P) => {
    const [state, setState] = useState(initialState);
    return fun(props, { ...state, setState });
  };

  return result;
}
