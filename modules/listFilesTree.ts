async function listFilesTree(path: string, tree?: { [key: string]: any }) {
  if (!tree) {
    path = Deno.cwd() + path;
  }

  tree = tree ?? {};
  for await (const dirEntry of Deno.readdir(path)) {
    if (!dirEntry.isDirectory) {
      tree[dirEntry.name] = true;
      continue;
    }
    const nextPath = path + "/" + dirEntry.name;
    tree[dirEntry.name] = {};
    await listFilesTree(path + "/" + dirEntry.name, tree[dirEntry.name]);
  }
  return tree;
}

export default (path: string) => listFilesTree(path);
