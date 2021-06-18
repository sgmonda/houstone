import { React, ReactDOM } from "../deps.client.ts";

// const useState = (React as any).useState.toString();
// console.log('USE STATE', useState);
// const initialState = {};
// console.log('INITIAL STATE', initialState);

const App = ({ children }: any) => {
  console.log("CLIENT APP", children);
  return (
    <>
      <p>Before</p>
      {children}
      <p>After</p>
    </>
  );
};

const pageProps = {};
const Page = (props: any) => `unhydrated`;

(ReactDOM as any).hydrate(
  <App>
    <Page {...pageProps}></Page>
    <pre>
      // PAGE PROPS:
      {JSON.stringify(pageProps, null, 2)}
    </pre>
  </App>,
  // @ts-ignore
  document.getElementById("root"),
);
