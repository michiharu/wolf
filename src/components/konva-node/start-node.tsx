import * as React from 'react';

import { Rect, Group, Text } from 'react-konva';

import TreeNode from '../../data-types/tree-node';
import outlineFlag from '../../resource/svg-outline-flag';
import SvgToPath from './svg-to-path';

interface Props {
  x: number;
  y: number;
}

const StartNode: React.FC<Props> = (props: Props) => {
  const {x, y} = props;
  const width = 240;
  const height = 60;
  const fill = '#fff'
  const baseRectProps = {x: 0, y: 0, width, height, fill};

  return (
    <Group x={x} y={y}>
      <Rect {...baseRectProps}/>
      <Text text="スタート" fontSize={24} x={55} y={19}/>
      <SvgToPath svg={outlineFlag} x={150} y={15} fill="green" scale={1.2}/>
    </Group>
  );
};

export default StartNode;