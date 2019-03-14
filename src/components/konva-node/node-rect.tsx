import * as React from 'react';

import Konva from 'konva';
import { Rect, Group, Text } from 'react-konva';

import { KNode, Point } from '../../data-types/tree-node';
import { viewItem, unit } from '../../settings/layout';

import Util from '../../func/util';
import NodeIconBox, { NodeIconBoxProps } from './icon-box';

export interface NodeRectProps {
  node: KNode;
  changeOpen: (id: string, open: boolean) => void;
  dragMove: (selfNode: KNode, point: Point) => void;
  dragEnd: () => void;
}

const NodeRect: React.FC<NodeRectProps> = (props: NodeRectProps) => {
  const {node, changeOpen, dragMove, dragEnd} = props;

  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w * unit,
    height: node.rect.h * unit,
    cornerRadius: viewItem.cornerRadius * unit,
    fill: node.id === '--' ? '#ccc' : node.type === 'task' ? '#89b7ff' : '#ffd700',
  };

  if (node.id === '--') {
    return (
      <Group x={node.point.x * unit} y={node.point.y * unit} >
        <Rect {...baseRectProps}/>
      </Group>
    );
  }

  const clicked = (e: any) => {
    e.cancelBubble = true;
    changeOpen(node.id, !node.open);
  }

  const stroke = '#dddd';
  const strokeWidth = 2;
  const containerRectProps = {
    x: viewItem.spr.w * unit,
    y: viewItem.spr.h * unit,
    width: (node.self.w - viewItem.spr.w) * unit,
    height: (node.self.h - viewItem.spr.h) * unit,
    cornerRadius: viewItem.cornerRadius * unit, stroke, strokeWidth,
  };

  const ifStateRectProps = {
    x: (viewItem.spr.w / 2) * unit,
    y: (viewItem.rect.h + viewItem.textline - viewItem.fontHeight * 2 - viewItem.spr.h) / 2  * unit,
    width: (viewItem.rect.w - viewItem.spr.w) * unit,
    height: (viewItem.fontHeight + viewItem.spr.h / 2) * unit,
    cornerRadius: viewItem.cornerRadius * unit, fill: '#fff', opacity: 0.5
  };
  const ifStateProps = {
    text: node.ifState!,
    fontSize: viewItem.fontSize * unit,
    x: viewItem.fontSize * unit,
    y: (viewItem.rect.h + viewItem.textline - viewItem.fontHeight * 2 - viewItem.spr.h / 2) / 2  * unit,
  };
  const labelProps = {
    text: node.label,
    fontSize: viewItem.fontSize * unit,
    x: viewItem.fontSize * unit,
    y: node.parentType === 'task'
      ? (viewItem.rect.h - viewItem.fontHeight) / 2 * unit
      : (viewItem.rect.h + viewItem.textline + viewItem.fontHeight) / 2 * unit
  };

  const iconBoxProps: NodeIconBoxProps = {
    x: node.rect.w * unit,
    y: labelProps.y - (viewItem.rect.h - viewItem.fontHeight) / 2 * unit,
    node
  };

  const xputs = [];
  if (!Util.isEmpty(node.input)) { xputs.push(node.input); }
  if (!Util.isEmpty(node.output)) { xputs.push(node.output); }
  var anchorY = labelProps.y + (viewItem.fontHeight + viewItem.spr.h / 2) * unit;

  const handleDragMove = (selfNode: KNode) => (e: any) => {
    const tr = e.target.getClientRect();
    const point = {
      x: Math.floor(tr.x / unit) + viewItem.rect.w / 2,
      y: Math.floor(tr.y / unit) + viewItem.rect.h / 2,
    };
    dragMove(selfNode, point);
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
    onClick: clicked,
    draggable: true,
    onDragStart: () => changeOpen(node.id, false),
    onDragMove: handleDragMove(node),
    onDragEnd: handleDragEnd,
  }

  return (
    <Group x={node.point.x * unit} y={node.point.y * unit} >
      {node.open && <Rect {...containerRectProps}/>}
      <Group {...rectGroupProps}>
        <Rect {...baseRectProps}/>
        {node.parentType === 'switch' && <Rect {...ifStateRectProps}/>}
        {node.parentType === 'switch' && <Text {...ifStateProps}/>}
        <NodeIconBox {...iconBoxProps}/>
        <Text {...labelProps}/>
        <Text />
        {node.open && xputs.map(x => {
        const el = <Text key={x} text={x} x={viewItem.fontSize * unit} y={anchorY} fontSize={viewItem.fontSize}/>;
        anchorY += (viewItem.fontHeight + viewItem.spr.h / 4) * unit;
        return el;
      })}
      </Group>
    </Group>
  );
};

export default NodeRect;