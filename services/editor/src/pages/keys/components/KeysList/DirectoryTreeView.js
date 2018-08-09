/* global Symbol */
import React from 'react';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';
import './KeysList.css';
import { pathsToTree } from './aux-functions';

const leaf = Symbol();
const compsPathSorter = (l, r) => {
  if (l.props.node === leaf && r.props.node !== leaf) return 1;
  if (r.props.node === leaf && l.props.node !== leaf) return -1;
  return l.props.name.localeCompare(r.props.name);
};

export default function DirectoryTreeView({ paths, renderItem, selectedPath, expandByDefault }) {
  let pathTree = pathsToTree(paths);
  return (
    <div className="key-folder" data-comp="directory-tree-view">
      {Object.keys(pathTree)
        .map(pathNode => (
          <TreeNode
            key={pathNode}
            name={pathNode}
            node={pathTree[pathNode]}
            selectedPath={selectedPath}
            fullPath={pathNode}
            depth={1}
            expandByDefault={expandByDefault}
            renderItem={renderItem}
          />
        ))
        .sort(compsPathSorter)}
    </div>
  );
}

DirectoryTreeView.propTypes = {
  paths: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderItem: PropTypes.func.isRequired,
  expandByDefault: PropTypes.bool,
};
