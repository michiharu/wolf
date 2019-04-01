import * as React from 'react';
import { lightBlue, amber, yellow } from '@material-ui/core/colors';

import Konva from 'konva';
import { Rect, Text, Group } from 'react-konva';

import { EditableNode, Point } from '../../data-types/tree-node';
import { viewItem, unit } from '../../settings/layout';

import NodeIconBox, { NodeIconBoxProps } from './icon-box';

export interface EditableKNodeProps {
  node: EditableNode;
  click: (node: EditableNode) => void;
  deleteFocus: () => void;
  dragStart: (node: EditableNode) => void;
  dragMove: (node: EditableNode, point: Point) => void;
  dragEnd: () => void;
}

const EditableKNode: React.FC<EditableKNodeProps> = (props: EditableKNodeProps) => {
  const { node, click, deleteFocus, dragStart, dragMove, dragEnd} = props;

  const fill = node.type === 'task' ?   node.focus ? lightBlue[200] : lightBlue[300] :
               node.type === 'switch' ? node.focus ? amber[400] : amber[300] :
                                        node.focus ? yellow[400] : yellow[300];
  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w * unit,
    height: node.rect.h * unit,
    cornerRadius: viewItem.cornerRadius * unit,
    fill,
    shadowColor: node.focus ? fill : 'black',
    shadowBlur: node.focus ? 10 : 6,
    shadowOffset: { x : 0, y : node.focus ? 0 : 3},
    shadowOpacity: node.focus ? 1 : 0.2,
  };

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    click(node);
  }

  const stroke = '#dddd';
  const strokeWidth = 2;
  const containerRectProps = {
    x: viewItem.spr.w * unit,
    y: viewItem.spr.h * unit,
    width: (node.self.w - viewItem.spr.w) * unit,
    height: (node.self.h - viewItem.spr.h) * unit,
    cornerRadius: viewItem.cornerRadius * unit,
    stroke,
    strokeWidth,
    onClick: deleteFocus,
  };

  const labelProps = {
    text: node.label,
    fontSize: viewItem.fontSize * unit,
    x: viewItem.fontSize * unit,
    y: (viewItem.rect.h - viewItem.fontHeight) / 2 * unit
  };

  const iconBoxProps: NodeIconBoxProps = {
    x: node.rect.w * unit,
    y: labelProps.y - (viewItem.rect.h - viewItem.fontHeight) / 2 * unit,
    node
  };

  const handleDragStart = (e: any) => {
    dragStart(node);
  }

  const handleDragMove = (e: any) => {
    const tr = e.target.getClientRect();
    const point = {
      x: Math.floor(tr.x / unit) + viewItem.rect.w / 2,
      y: Math.floor(tr.y / unit) + viewItem.rect.h / 2,
    };
    dragMove(node, point);
  }

  const handleDragEnd = (e: any) => {
    e.target.to({
      x: 0,
      y: 0,
      easing: Konva.Easings.EaseInOut,
    });
    dragEnd();
  }

  const rectGroupProps = {
    x: 0, y:0,
    onClick: handleClick,
    draggable: true,
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
  };

  return (
    <Group x={node.point.x * unit} y={node.point.y * unit} >
      {node.open && <Rect {...containerRectProps}/>}
      <Group {...rectGroupProps}>
        <Rect {...baseRectProps}/>
        <NodeIconBox {...iconBoxProps}/>
        <Text {...labelProps}/>
      </Group>
    </Group>
  );
};

export default EditableKNode;