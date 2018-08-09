export const pathsToTree = (paths) => {
  let tree = {};
  paths.map(x => x.split('/')).forEach((fragments) => {
    const last = fragments.pop();
    fragments.reduce((node, frag) => (node[frag] = node[frag] || {}), tree)[last] = leaf;
  });

  return tree;
};

function countLeafsInTree(tree) {
  if (typeof tree === 'symbol') return 1;

  return Object.keys(tree).reduce(
    (aggregator, item) => aggregator + countLeafsInTree(tree[item]),
    0,
  );
}
