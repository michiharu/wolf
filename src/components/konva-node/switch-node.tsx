import * as React from 'react';
import { Rect, Group, Text } from 'react-konva';

import { TreeViewNode, Type } from '../../data-types/tree-node';
import { viewItem } from '../../settings/layout';
import TaskNodeChildren, { TaskNodeChildrenProps } from './task-node-children';
import SwitchNodeChildren from './switch-node-children';
import NodeIconBox, { NodeIconBoxProps } from './icon-box';

interface Props {
  parentType: Type;
  node: TreeViewNode;
  x: number;
  y: number;
  changeOpen: (id: string, open: boolean) => void;
}

const SwitchNode: React.FC<Props> = (props: Props) => {
  const {parentType, node, x, y, changeOpen} = props;

  const clicked = (e: any) => {
    e.cancelBubble = true;
    if (node.children.length === 0) { return; }
    changeOpen(node.id, !node.open);
  }

  const cornerRadius = 8;
  const stroke = '#dddd';
  const strokeWidth = 2;
  const containerRectProps = {
    x: viewItem.spr.w,
    y: viewItem.spr.h,
    width: node.width - viewItem.spr.w,
    height: node.height - viewItem.spr.h,
    cornerRadius, stroke, strokeWidth
  };
  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w,
    height: node.rect.h,
    cornerRadius, fill: '#ffd700',
    onClick: clicked
  };
  const childrenProps: TaskNodeChildrenProps = {
    parentType: node.type,
    nodes: node.children,
    x: viewItem.indent,
    y: viewItem.spr.h + viewItem.rect.h
    + (parentType === 'switch' ? viewItem.textline : 0),
    changeOpen
  };

  const ifStateRectProps = {
    x: viewItem.spr.w / 2,
    y: (viewItem.rect.h + viewItem.textline) / 2 - (viewItem.fontHeight + viewItem.spr.h / 2),
    width: viewItem.rect.w - viewItem.spr.w,
    height: viewItem.fontHeight + viewItem.spr.h / 2,
    cornerRadius, fill: '#fff', opacity: 0.5
  };
  const ifStateProps = {
    text: node.ifState!,
    fontSize: viewItem.fontSize,
    x: viewItem.fontSize,
    y: (viewItem.rect.h + viewItem.textline) / 2 - (viewItem.fontHeight + viewItem.spr.h / 4),
  };
  const labelProps = {
    text: node.label,
    fontSize: viewItem.fontSize,
    x: viewItem.fontSize,
    y: parentType === 'task'
      ? (viewItem.rect.h - viewItem.fontHeight) / 2
      : (viewItem.rect.h + viewItem.textline + viewItem.fontHeight) / 2
  };

  const iconBoxProps: NodeIconBoxProps = {
    x: node.rect.w, y: labelProps.y - (viewItem.rect.h - viewItem.fontHeight) / 2, node
  };

  return (
    <Group x={x} y={y}>
      {node.open && <Rect {...containerRectProps}/>}
      <Group x={0} y={0} onClick={clicked}>
        <Rect {...baseRectProps}/>
        {parentType === 'switch' && <Rect {...ifStateRectProps}/>}
        {parentType === 'switch' && <Text {...ifStateProps}/>}
        <NodeIconBox {...iconBoxProps}/>
        <Text {...labelProps}/>
      </Group>
      
      {node.open && <SwitchNodeChildren {...childrenProps}/>}
    </Group>
  );
};

export default SwitchNode;