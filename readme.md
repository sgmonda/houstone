![2020-06-24 14 57 07](https://user-images.githubusercontent.com/675812/85560715-32c76a00-b62b-11ea-8898-95a838a75802.jpg)

[Houstone](https://github.com/sgmonda/houstone) is a web framework for [Deno](https://deno.land), focused on simplicity and mantenibility. Take a look out there; you won't find anything easier to use. Do more writing less.

## App hierarchy

Houstone uses a filesystem structure to define pages and api routes. This means you will need less code to create your web application.

```
- mod.ts
- 📁 api
- 📁 middlewares
- 📁 pages
- 📁 components
```


## Motivations

1. Avoid complex configuration to get Server Side Rendering with React
2. Avoid having to write different things than what we want to write, like having to write `className="..."` instead of `class="..."` just not to break things.
3. ...

## Requirements

1. Deno
2. asd
3. asdf

## Usage

Create the simplest app possible:

```typescript
// File: /mod.ts

import { App } from "houstone";

const MyApp = new App({
  port: 8711,
});

export default MyApp;
```

Then run it as production:

```
$ deno --allow-net --allow-read mod.ts
```

Or as development (watching files for changes):

```
$ denon --allow-net --allow-read mod.ts

# Note: this requires "denon" binary. Install it using:
# $ deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon@v2.2.0/denon.ts
```

And check status from a terminal or browser:

```
$ curl -Lv 'http://127.0.0.1:8711/api/status'
```

### Middlewares

Any file under `/middlewares` folder is considered a middleware. Example:

```typescript
// File: /middlewares/example.ts

import { Request, TMiddleware } from "../../mod.ts";

const MyMiddleware: TMiddleware = async (req: Request): Promise<void> => {
  console.log("REQUEST EN AUTH MIDDLEWARE", req.query);
};

export default MyMiddleware;
```

### Endpoints

Any file under `/api` is considered an API endpoint. Example:

```typescript
// File: /api/example.ts

import { TRoute, Request, Response } from "../../mod.ts";

const get: TRoute = async (request: Request): Promise<Response> => {
  console.log("EXAMPLE for GET method", request);
  return { code: 200, body: { status: "Up and happy", date: new Date() } };
};

export { get };
```

## Features

- Out-of-the box analytics and access limits (i.e. max request/min)
-

## TODO

- [ ] Improve importing experience. Export types and classes in a better way
- [ ] Use Drakefile
- [ ] asdf
- [ ] asdf
- [ ] asdf
