import { React, ReactDOM } from "../deps.client.ts";

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

(ReactDOM as any).hydrate(
  <App>
    {/* <Page {...pageProps}></Page> */}
    hello
  </App>,
  // @ts-ignore
  document.getElementById("root"),
);
