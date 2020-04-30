type TItem = string | { [key: string]: TItem };

async function listFilesTree(path: string, tree?: { [key: string]: TItem }) {
  tree = tree ?? {};
  for await (const dirEntry of Deno.readdir(path)) {
    const nextPath = path + "/" + dirEntry.name;
    if (!dirEntry.isDirectory) {
      tree[nextPath] = Deno.cwd() + "/" + nextPath;
      continue;
    }
    tree[nextPath] = {};
    await listFilesTree(nextPath, tree[nextPath] as { [key: string]: TItem });
  }
  return tree;
}

export default (path: string = ".") => listFilesTree(path);
