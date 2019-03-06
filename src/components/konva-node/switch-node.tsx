import * as React from 'react';
import { Rect, Group, Text } from 'react-konva';

import { TreeViewNode, Type } from '../../data-types/tree-node';
import { viewItem } from '../../settings/layout';
import TaskNodeChildren, { TaskNodeChildrenProps } from './task-node-children';
import SwitchNodeChildren from './switch-node-children';

interface Props {
  parentType: Type;
  node: TreeViewNode;
  x: number;
  y: number;
  changeOpen: (id: string, open: boolean) => void;
}

const SwitchNode: React.FC<Props> = (props: Props) => {
  const {parentType, node, x, y, changeOpen} = props;

  const cornerRadius = 8;
  const stroke = '#dddd';
  const strokeWidth = 2;
  const containerRectProps = {
    x: viewItem.spr.w, y: viewItem.spr.h,
    width: node.width - viewItem.spr.w,
    height: node.height - viewItem.spr.h,
    cornerRadius, stroke, strokeWidth
  };
  const baseRectProps = {
    x: 0, y: 0,
    width: viewItem.rect.w,
    height: parentType === 'task' ? viewItem.rect.h : viewItem.rectHasIf.h,
    cornerRadius, fill: '#ffd700'
  };
  const childrenProps: TaskNodeChildrenProps = {
    parentType: node.type,
    nodes: node.children,
    x: viewItem.indent,
    y: (parentType === 'task' ? viewItem.rect.h : viewItem.rectHasIf.h) + viewItem.spr.h,
    changeOpen
  };

  const clicked = (e: any) => {
    e.cancelBubble = true;
    if (node.children.length === 0) { return; }
    changeOpen(node.id, !node.open);
  }

  return (
    <Group x={x} y={y} onClick={clicked}>
      {node.open && <Rect {...containerRectProps}/>}
      <Rect {...baseRectProps}/>
      <Text text={node.label} fontSize={20} x={18} y={21}/>
      {node.open && <SwitchNodeChildren {...childrenProps}/>}
    </Group>
  );
};

export default SwitchNode;