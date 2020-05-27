type TItem = string | { [key: string]: TItem };

async function listFilesTree(path: string, tree?: { [key: string]: TItem }) {
  tree = tree ?? {};
  for await (const dirEntry of Deno.readDir(path)) {
    const nextPath = path + "/" + dirEntry.name;
    if (!dirEntry.isDirectory) {
      tree[nextPath] = Deno.cwd() + "/" + nextPath;
      continue;
    }
    await listFilesTree(nextPath, tree);
  }
  return tree;
}

export default (path: string = ".") => listFilesTree(path);
