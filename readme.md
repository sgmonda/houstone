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
import { App } from "<url-to-this-framework>";
import config from "./settings.json";

const MyApp = new App(config);

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
# deno install denon --allow-read --allow-run https://deno.land/x/denon/denon.ts
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
