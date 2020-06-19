import { React } from "../deps.ts";

export interface Component<Props, S> {
  (props: Props, state: State<S>): string;
}

export type State<S> = S & {
  setState: (state: S) => void;
};

export function createComponent<P, S>(fun: Component<P, S>, initialState: S) {
  const result = (props: P) => {
    const [state, setState] = (React as any).useState(initialState);
    return fun(props, { ...state, setState });
  };

  return result;
}
