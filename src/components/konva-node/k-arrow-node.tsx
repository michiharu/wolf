import _ from 'lodash';
import * as React from 'react';
import { useState, useRef } from 'react';
import { lightBlue, amber, yellow } from '@material-ui/core/colors';

import Konva from 'konva';
import { Rect, Text, Group, Arrow } from 'react-konva';

import { KTreeNode, Point, KWithArrow } from '../../data-types/tree-node';

import NodeIconBox, { NodeIconBoxProps } from './icon-box';
import KSize from '../../data-types/k-size';
import { sp } from '../../pages/editor/node-editor/node-editor';

export interface KArrowNodeProps {
  node: KWithArrow;
  ks: KSize;
  click: (node: KTreeNode) => void;
  deleteFocus: () => void;
  dragStart: (node: KTreeNode) => void;
  dragMove: (node: KTreeNode, point: Point) => void;
  dragEnd: () => void;
}

const KArrowNode: React.FC<KArrowNodeProps> = (props: KArrowNodeProps) => {
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

  const stroke = '#999';

  const arrowBaseProps = {
    stroke,
    fill: stroke,
  }

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
      x: Math.round((tr.x - sp.x) / ks.unit + ks.rect.w / 2),
      y: Math.round((tr.y - sp.y) / ks.unit + ks.rect.h / 2),
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
    <Group x={sp.x + node.point.x * ks.unit} y={sp.y + node.point.y * ks.unit} >
      <Group {...rectGroupProps}>
        <Rect {...baseRectProps}/>
        <NodeIconBox {...iconBoxProps}/>
        <Text {...labelProps}/>
        {node.arrows.map((a, i) => {
          const points = a.map(point => [point.x, point.y]).reduce((before, next) => before.concat(next)).map(p => p * ks.unit);
          return <Arrow key={`${node.id}-arrow-${i}`} {...arrowBaseProps} points={points}/>;
        })}
      </Group>
    </Group>
  );
};

export default KArrowNode;