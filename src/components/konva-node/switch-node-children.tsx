import * as React from 'react';
import { Rect, Group, Text } from 'react-konva';

import { TreeViewNode, Type } from '../../data-types/tree-node';
import { viewItem } from '../../settings/layout';
import TaskNode from './task-node';
import SwitchNode from './switch-node';
import { node } from 'prop-types';

export interface SwitchNodeChildrenProps {
  parentType: Type;
  nodes: TreeViewNode[];
  x: number;
  y: number;
  changeOpen: (id: string, open: boolean) => void;
}

const SwitchNodeChildren: React.SFC<SwitchNodeChildrenProps> = (props: SwitchNodeChildrenProps) => {
  const {parentType, nodes, x, y, changeOpen} = props;
  var anchorX = 0;
  return (
    <Group x={x} y={y}>
      {nodes.map(c => {
        const nodeProps = {key: c.id, parentType, node: c, x: anchorX, y: 0, changeOpen};
        const el = c.type === 'task' ? <TaskNode {...nodeProps}/> : <SwitchNode {...nodeProps}/>;
        anchorX += c.width + viewItem.spr.w;
        return el;
      })}
    </Group>
  );
};

export default SwitchNodeChildren;