import * as React from 'react';
import { useRef, useState } from 'react';

import Konva, { Node } from 'konva';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';

import TreeNode from '../../data-types/tree-node';

interface Props {
  node: TreeNode;
  x: number;
  y: number;
}

const TaskNode: React.FC<Props> = (props: Props) => {
  const {node, x, y} = props;
  const width = 240;
  const height = 60;
  const fill = '#89b7ff'
  const baseRectProps = {x: 0, y: 0, width, height, fill};

  return (
    <Group x={x} y={y}>
      <Rect {...baseRectProps}/>
      <Text text={node.label} fontSize={20} x={18} y={21}/>
    </Group>
  );
};

export default TaskNode;