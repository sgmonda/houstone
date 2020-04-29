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

```
$ deno --allow-net --allow-read mod.ts
```
