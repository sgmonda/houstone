async function listFilesTree(path: string, tree?: { [key: string]: any }) {
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

export default listFilesTree;
