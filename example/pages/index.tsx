import { Page, PageProps } from "../../mod.ts";
import MyComponent from "./components/MyComponent.tsx";

interface Props extends PageProps {}
interface State {}

class Index extends Page<Props, State> {
  render() {
    return (
      <div>
        hello, world
        <br />
        hi
      </div>
    );
  }
}

export const page = (): string => ({});

export const MyPage = () => {
  const [count, setCount] = (React as any).useState(0);

  return (
    <div>
      <h1>Hello DenoLand!</h1>
      <MyComponent a={count} b={`Counter is ${count * 2}`} />
      <button onClick={() => setCount(count + 1)}>Click the 🦕</button>
      <p>You clicked the 🦕 {count} times</p>
    </div>
  );
};
