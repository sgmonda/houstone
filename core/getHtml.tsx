import { React, ReactDOMServer } from "../deps.ts";
import MyComponent from "../example/components/MyComponent.tsx";
import { Component } from "./Component.ts";
import { PageProps } from "./mod.ts";

const App = ({ children }: any) => (
  <>
    <p>Before</p>
    {children}
    <p>After</p>
  </>
);

export default async (
  C: Component<any, any>,
  pageProps: PageProps,
) => {
  return {
    html: `
    <html>
      <head>
      </head>
      <body>
      ${(ReactDOMServer as any).renderToString(<App><C {...pageProps} /></App>)}
      </body>
    </html>`,
    js: `
    import React from "https://dev.jspm.io/react@16.13.1";
    import ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";
    const App = ${App};
    ReactDOM.hydrate(React.createElement(App), document.body);
  `,
  };
};
