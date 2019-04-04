import _ from 'lodash';
import * as React from 'react';
import { useState, useRef } from 'react';
import { lightBlue, amber, yellow } from '@material-ui/core/colors';

import Konva from 'konva';
import { Rect, Text, Group } from 'react-konva';

import { EditableNode, Point } from '../../data-types/tree-node';

import NodeIconBox, { NodeIconBoxProps } from './icon-box';
import KSize from '../../data-types/k-size';

export interface EditableKNodeProps {
  node: EditableNode;
  ks: KSize;
  click: (node: EditableNode) => void;
  deleteFocus: () => void;
  dragStart: (node: EditableNode) => void;
  dragMove: (node: EditableNode, point: Point) => void;
  dragEnd: () => void;
}

const origin: Point = {x: 32, y: 80};

const EditableKNode: React.FC<EditableKNodeProps> = (props: EditableKNodeProps) => {
  const { node, ks, click, deleteFocus, dragStart, dragMove, dragEnd} = props;
  const fill = node.type === 'task' ?   node.focus ? lightBlue[100] : lightBlue[50] :
               node.type === 'switch' ? node.focus ? amber[200] : amber[100] :
                                        node.focus ? yellow[200] : yellow[100];
  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w * ks.unit,
    height: node.rect.h * ks.unit,
    cornerRadius: ks.cornerRadius * ks.unit,
    fill,
    shadowColor: 'black',
    shadowBlur: node.focus ? 10 : 6,
    shadowOffset: { x: 0, y: 3},
    shadowOpacity: 0.2,
  };

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    click(node);
  }

  const stroke = '#dddd';
  const strokeWidth = 2;
  const containerRectProps = {
    x: ks.indent * 0.5 * ks.unit,
    y: ks.spr.h * ks.unit,
    width: (node.self.w - ks.indent * 0.5) * ks.unit,
    height: (node.self.h - ks.spr.h) * ks.unit,
    cornerRadius: ks.cornerRadius * ks.unit,
    stroke,
    strokeWidth,
    onClick: deleteFocus,
  };

  const labelProps = {
    text: node.label,
    fontSize: ks.fontSize * ks.unit,
    x: ks.fontSize * ks.unit,
    y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit
  };

  const iconBoxProps: NodeIconBoxProps = {
    ks,
    x: node.rect.w * ks.unit,
    y: labelProps.y - (ks.rect.h - ks.fontHeight) / 2 * ks.unit,
    node
  };

  const handleDragStart = (e: any) => {
    dragStart(node);
  }

  const handleDragMove = (e: any) => {
    const tr = e.target.getClientRect();
    const point = {
      x: Math.round((tr.x - origin.x) / ks.unit + ks.rect.w / 2),
      y: Math.round((tr.y - origin.y) / ks.unit + ks.rect.h / 2),
    };
    dragMove(node, point);
  }

  const handleDragEnd = (e: any) => {
    e.target.to({ x: 0, y: 0, easing: Konva.Easings.EaseInOut });
    dragEnd();
  }

  const rectGroupProps = {
    x: 0, y:0,
    onTap: handleClick,
    onClick: handleClick,
    draggable: true,
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
  };

  return (
    <Group x={origin.x + node.point.x * ks.unit} y={origin.y + node.point.y * ks.unit} >
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