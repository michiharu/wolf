import * as React from 'react';

import { Rect, Group, Text, Image } from 'react-konva';

import TreeNode from '../../data-types/tree-node';

interface Props {
  node: TreeNode;
  x: number;
  y: number;
}

const StartNode: React.FC<Props> = (props: Props) => {
  const {node, x, y} = props;
  const width = 240;
  const height = 60;
  const fill = '#fff'
  const baseRectProps = {x: 0, y: 0, width, height, fill};
  const image = require('');

  return (
    <Group x={x} y={y}>
      <Rect {...baseRectProps}/>
      <Text text="スタート" fontSize={20} x={18} y={21}/>
      <Image />
    </Group>
  );
};

export default StartNode;