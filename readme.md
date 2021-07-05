![2020-06-24 14 57 07](https://user-images.githubusercontent.com/675812/85560715-32c76a00-b62b-11ea-8898-95a838a75802.jpg)

[Houstone](https://github.com/sgmonda/houstone) is a web framework for
[Deno](https://deno.land), focused on simplicity and maintainability to ensure
the best development experience. Take a look out there; you won't find anything
easier to use. Do more writing less.

**NOTE**: This project is still under development. You're welcome to contribute
or enjoy it on your own, but don't try to use it in production.

### Key features:

- Zero configuration needed for transpilation or compilation, so no webpack-like
  tools are needed.
- Out-of-the-box usage metrics and status page.
- Out-of-the-box usage limits, by IP and time.

### Requirements

- Deno >= 1.11.0

# App hierarchy

Houstone uses a filesystem structure to define your app parts:

```
- 📄 mod.ts                 # Entry point, where your app is initialized
- 📁 api                    # API endpoints
- 📁 middlewares            # API middlewares
- 📁 pages                  # Houstone pages
- 📁 components             # Houstone components
- 📁 static                 # Public assets and resources, like your favicon, images, etc.
```

A good start point is to see the `example` directory inside this repository.
During next sections you'll learn to create an app from scratch.

# Usage

## Getting started

The easiest way to see Houstone in action is the following hello world example:

```typescript
// mod.ts
import { App } from "houstone";
export default new App({ port: 8711 });
```

Now you can start the app (as production):

```
$ deno run -Ar --unstable mod.ts
```

Or as development (watching files for changes):

```
$ denon --allow-net --allow-read mod.ts

# Note: this requires "denon" binary. Install it using:
# $ deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon@v2.2.0/denon.ts
```

Then you can call the status endpoint that comes by default:

```
$ curl 'http://localhost:8711/status'
```

## Pages

To create a page, like `/mypage`, just create a file named `mypage` under
`pages` directory. A page is just a react component and optional static
initializator and types definitions:

```typescript
// pages/mypage.tsx

import { PageProps, React } from "formelio";

export interface Props extends PageProps {
  a?: number;
  b?: string;
}

interface State = {
  count: number;
};

const MyPage = (props: Props) => {
  const [state, setState] = React.useState({ count: 3 });
  const onClick = () => setState({ count: state.count + 1 });
  return (
    <>
      <h1>My Page</h1>
      <div>
        PROPS:
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
      <div>
        STATE:
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
      <button onClick={onClick}>increase</button>
    </>
  );
};

export default MyPage;

export const getInitialProps = async (pageProps: PageProps): Promise<Props> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ...pageProps, a: 1, b: "dos" };
};
```

## Components

Common React components can be used from your pages:

```typescript
// components/MyComponent.tsx

import { PageProps, React } from "formelio";

export interface Props {
  one?: number;
  two?: number;
}

interface State = {
  count: number;
};

const MyComponent = (props: Props) => {
  const [state, setState] = React.useState({ count: 3 });
  const onClick = () => setState({ count: state.count + 1 });
  return (
    <>
      <h1>My Component</h1>
      <div>
        PROPS:
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
      <div>
        STATE:
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
      <button onClick={onClick}>increase</button>
    </>
  );
};

export default MyComponent;
```

## API endpoints

API endpoints are just groups of async functions (one for each HTTP method)
defined under `/api` directory. Parts inside brackets are replaced:

```typescript
// /api/users/[id].ts

import { Request, Response, Route } from "formelio";

const get: Route = async ({ query }: Request): Promise<Response> => {
  const user = await FetchFromDatabase(...);
  if (!user) throw { code: 404, message: `User ${query.id} cannot be found` };
  return { code: 200, body: user };
};

const put: Route = async (request: Request): Promise<Response> => {
  const { body } = await get(request);
  const user = await applyChanges(body, request.body);
  return { code: 200, body: user };
};

export { get, put };
```

### Middlewares

With Houstone, middlewares are just async functions getting a request object.
They can perform any action and flow will wait until they finish:

```typescript
// middlewares/auth.ts

import { Middleware, Request } from "formelio";

const MyMiddleware: Middleware = async (req: Request): Promise<void> => {
  console.log("REQUEST EN AUTH MIDDLEWARE", req.query);
  req.user = await authenticate(req.headers, req.body);
};

export default MyMiddleware;
```

### Errors

As everything is async, you can just throw an error anywhere, in the form
`{ code: XXX, message: '...' }` and it will be propagated until the client. If
you throw another kind of object, then a generic server error (500) is returned
to the user.

## TODO

- [ ] Improve importing experience
- [ ] Use Drakefile
