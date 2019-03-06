import * as React from 'react';
import { Rect, Group, Text } from 'react-konva';

import { TreeViewNode, Type } from '../../data-types/tree-node';
import { viewItem } from '../../settings/layout';
import TaskNode from './task-node';
import SwitchNode from './switch-node';

export interface TaskNodeChildrenProps {
  parentType: Type;
  nodes: TreeViewNode[];
  x: number;
  y: number;
  changeOpen: (id: string, open: boolean) => void;
}

const TaskNodeChildren: React.SFC<TaskNodeChildrenProps> = (props: TaskNodeChildrenProps) => {
  const {parentType, nodes, x, y, changeOpen} = props;
  var anchorY = 0;
  return (
    <Group x={x} y={y}>
      {nodes.map(c => {
          const nodeProps = {key: c.id, parentType, node: c, x: 0, y: anchorY, changeOpen};
          const el = c.type === 'task' ? <TaskNode {...nodeProps}/> : <SwitchNode {...nodeProps}/>;
          anchorY += c.height + viewItem.spr.h;
        return el;
      })}
    </Group>
  );
};

export default TaskNodeChildren;