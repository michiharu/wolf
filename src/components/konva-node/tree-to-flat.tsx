import * as React from 'react';
import { useRef, useState, useEffect } from 'react';

import { Layer } from 'react-konva';

import { TreeNode, TreeViewNode, Type, FlatNode } from '../../data-types/tree-node';

import FlatUtil from '../../func/flat-view';
import NodeRect from './node-rect';
import { viewItem } from '../../settings/layout';
import { theme } from '../..';

export interface treeNodeFlatProps {
  node: FlatNode;
  changeOpen: (id: string, open: boolean) => void;
}

const TreeToFlat: React.FC<treeNodeFlatProps> = (props: treeNodeFlatProps) => {
  const { node, changeOpen } = props;
  const flatNodes = FlatUtil.toFlat(node);
  console.log(flatNodes);

  return (
    <Layer>
      {flatNodes.map(n => {
        return (
          <NodeRect key={n.id} node={n} changeOpen={changeOpen} />
        );
      })}
    </Layer>
  );
};

export default TreeToFlat;