import { React, ReactDOMServer } from "../deps.ts";
import { Component } from "./Component.ts";
import { PageProps } from "./mod.ts";

const App = ({ children }: any) => {
  console.log("SERVER SIDE APP", children);
  return (
    <>
      <p>Before</p>
      {children}
      <p>After</p>
    </>
  );
};

export default (
  Child: Component<any, any>,
  pageProps: PageProps,
) => {
  const app = (ReactDOMServer as any).renderToString(
    <App>
      <Child {...pageProps} />
    </App>,
  );

  return {
    html: `
    <html>
      <body>
        <div id="root">
          ${app}
        </div>
        <script>
          console.log("2+2") // <---- @TODO Define here current page, so client knows what to render
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>`,
  };
};
