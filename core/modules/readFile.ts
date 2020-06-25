const MEDIA_TYPES: Record<string, string> = {
  ".md": "text/markdown",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".map": "application/json",
  ".txt": "text/plain",
  ".ts": "text/typescript",
  ".tsx": "text/tsx",
  ".js": "application/javascript",
  ".jsx": "text/jsx",
  ".gz": "application/gzip",
  ".css": "text/css",
  ".wasm": "application/wasm",
};

function contentType(path: string): string | undefined {
  return MEDIA_TYPES["." + path.split(".").pop()];
}

interface Result {
  file: any;
  contentLength: any;
  contentType: any;
}

async function readFile(path: string): Promise<Result> {
  const [file, fileInfo] = await Promise.all([
    Deno.open(path),
    Deno.stat(path),
  ]);
  const result: Result = {
    file,
    contentLength: fileInfo.size.toString(),
    contentType: contentType(path),
  };
  return result;
}

export default readFile;
