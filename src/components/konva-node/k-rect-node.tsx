import _ from 'lodash';
import * as React from 'react';
import { useState, useRef } from 'react';
import { lightBlue, amber, yellow } from '@material-ui/core/colors';

import Konva from 'konva';
import { Rect, Text, Group } from 'react-konva';

import { KTreeNode, Point } from '../../data-types/tree-node';
import KSize from '../../data-types/k-size';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import { task, switchSvg } from '../../resource/svg-icon';
import { sp } from '../../pages/editor/node-editor/node-editor';
import Util from '../../func/util';
import { phrase } from '../../settings/phrase';
import check from '../../resource/svg-icon/check';

export interface KRectNodeProps {
  node: KTreeNode;
  ks: KSize;
  click: (node: KTreeNode) => void;
  deleteFocus: () => void;
  dragStart: (node: KTreeNode) => void;
  dragMove: (node: KTreeNode, point: Point) => void;
  dragEnd: () => void;
}

const KRectNode: React.FC<KRectNodeProps> = (props: KRectNodeProps) => {
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
    text: Util.isEmpty(node.label)
      ? node.type === 'task' ? phrase.empty.task : node.type === 'switch' ? phrase.empty.switch : phrase.empty.case
      : node.label,
    fontSize: ks.fontSize * ks.unit,
    x: ks.fontSize * ks.unit,
    y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit
  };

  const backgroundColor = '#0000';
  const badgeContent = String(node.children.length);

  const iconRight = -(ks.rect.h * 0.98);
  const iconWithBadgeProps: IconWithBadgeProps = {
    ks,
    x: (ks.rect.w + iconRight) * ks.unit, y: 0,
    svg: node.type === 'task' ? task : node.type === 'switch' ? switchSvg : check,
    backgroundColor, badgeContent,
    scale: node.type !== 'switch' ? undefined : {x: 1, y: -1},
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
      {node.open && <Rect {...containerRectProps}/>}
      <Group {...rectGroupProps}>
        <Rect {...baseRectProps}/>
        {node.children.length !== 0 && <IconWithBadge {...iconWithBadgeProps}/>}
        <Text {...labelProps}/>
      </Group>
    </Group>
  );
};

export default KRectNode;