import { React, ReactDOMServer } from "../deps.ts";
import { Component } from "./Component.ts";
import { PageProps } from "./mod.ts";

const App = ({ children }: any) => {
  console.log('SERVER APP', children);
  return (
    <>
      <p>Before</p>
      {children}
      <p>After</p>
    </>
  );
}

export default async (
  Child: Component<any, any>,
  pageProps: PageProps,
) => {
  return {
    html: `
    <html>
      <body>
        <div id="root">
          ${(ReactDOMServer as any).renderToString(<App><Child {...pageProps} /></App>)}
        </div>
        <script src="/bundle.js"></script>
      </body>
    </html>`
  };
};
