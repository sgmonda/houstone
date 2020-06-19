import { React, ReactDOMServer } from "../deps.ts";
import MyComponent from "../example/pages/components/MyComponent.tsx";

const App = () => (
  <>
    <p>Before</p>
    <MyComponent />
    <p>After</p>
  </>
);

export default async (browserBundlePath: string) => {
  return {
    html: `
    <html>
      <head>
        <script type="module" src="${browserBundlePath}"></script>
      </head>
      <body>
        ${(ReactDOMServer as any).renderToString(<App />)}
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
