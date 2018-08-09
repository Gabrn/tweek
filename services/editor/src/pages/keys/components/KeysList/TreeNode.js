/* global Symbol */
import React from 'react';
import PropTypes from 'prop-types';
import { mapProps, compose, shouldUpdate } from 'recompose';
import * as R from 'ramda';

import TreeDirectory from './TreeDirectory';

const leaf = Symbol();
const compsPathSorter = (l, r) => {
  if (l.props.node === leaf && r.props.node !== leaf) return 1;
  if (r.props.node === leaf && l.props.node !== leaf) return -1;
  return l.props.name.localeCompare(r.props.name);
};

const TreeNode = ({
  node,
  name,
  fullPath,
  depth,
  renderItem,
  expandByDefault,
  selected,
  selectedPath,
}) => {
  let LeafElement = renderItem;

  return node === leaf ? (
    <LeafElement {...{ name, fullPath, depth, selected }} />
  ) : (
    <TreeDirectory
      descendantsCount={countLeafsInTree(node)}
      {...{ name, selectedPath, fullPath, depth, selected, expandByDefault: expandByDefault }}
    >
      {Object.keys(node)
        .map(childPath => (
          <TreeNode
            key={childPath}
            name={childPath}
            selectedPath={selectedPath}
            node={node[childPath]}
            fullPath={`${fullPath}/${childPath}`}
            depth={depth + 1}
            renderItem={renderItem}
            expandByDefault={expandByDefault}
          />
        ))
        .sort(compsPathSorter)}
    </TreeDirectory>
  );
};

const enhance = compose(
  mapProps(({ selectedPath, fullPath, ...props }) => ({
    selectedPath,
    fullPath,
    selected:
      selectedPath && (fullPath === selectedPath || selectedPath.startsWith(`${fullPath}/`)),
    ...props,
  })),
  shouldUpdate(
    ({ selectedPath: _, ...oldProps }, { selectedPath: __, ...newProps }) =>
      !R.equals(oldProps, newProps),
  ),
);

TreeNode.propTypes = {
  node: PropTypes.oneOfType([PropTypes.object, PropTypes.symbol]).isRequired,
  name: PropTypes.string.isRequired,
  fullPath: PropTypes.string,
  depth: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,
  expandByDefault: PropTypes.bool,
};

export default enhance(TreeNode);
