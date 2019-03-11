import * as React from 'react';

import Konva from 'konva';
import { Rect, Group, Text } from 'react-konva';

import { TreeViewNode, Type, FlatNode } from '../../data-types/tree-node';
import { viewItem } from '../../settings/layout';

import Util from '../../func/util';
import NodeIconBox, { NodeIconBoxProps } from './icon-box';

export interface NodeRectProps {
  node: FlatNode;
  changeOpen: (id: string, open: boolean) => void;
}

const NodeRect: React.FC<NodeRectProps> = (props: NodeRectProps) => {
  const {node, changeOpen} = props;

  const clicked = (e: any) => {
    e.cancelBubble = true;
    if (node.children.length === 0) { return; }
    changeOpen(node.id, !node.open);
  }

  const stroke = '#dddd';
  const strokeWidth = 2;
  const containerRectProps = {
    x: viewItem.spr.w, y: viewItem.spr.h,
    width: node.self.w - viewItem.spr.w,
    height: node.self.h - viewItem.spr.h,
    cornerRadius: viewItem.cornerRadius, stroke, strokeWidth,
  };
  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w,
    height: node.rect.h,
    cornerRadius: viewItem.cornerRadius, fill: node.type === 'task' ? '#89b7ff' : '#ffd700',
  };

  const ifStateRectProps = {
    x: viewItem.spr.w / 2,
    y: (viewItem.rect.h + viewItem.textline) / 2 - (viewItem.fontHeight + viewItem.spr.h / 2),
    width: viewItem.rect.w - viewItem.spr.w,
    height: viewItem.fontHeight + viewItem.spr.h / 2,
    cornerRadius: viewItem.cornerRadius, fill: '#fff', opacity: 0.5
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
    y: node.parentType === 'task'
      ? (viewItem.rect.h - viewItem.fontHeight) / 2
      : (viewItem.rect.h + viewItem.textline + viewItem.fontHeight) / 2
  };

  const iconBoxProps: NodeIconBoxProps = {
    x: node.rect.w, y: labelProps.y - (viewItem.rect.h - viewItem.fontHeight) / 2, node
  };

  const xputs = [];
  if (!Util.isEmpty(node.input)) { xputs.push(node.input); }
  if (!Util.isEmpty(node.output)) { xputs.push(node.output); }
  var anchorY = labelProps.y + viewItem.fontHeight + viewItem.spr.h / 2;

  const handleDragEnd = (e: any) => {
    e.target.to({
      x: 0,
      y: 0,
      easing: Konva.Easings.EaseInOut,
    });
  }

  return (
    <Group x={node.point.x} y={node.point.y} >
      {node.open && <Rect {...containerRectProps}/>}
      <Group x={0} y={0} onClick={clicked} draggable onDragStart={() => changeOpen(node.id, false)} onDragEnd={handleDragEnd}>
        <Rect {...baseRectProps}/>
        {node.parentType === 'switch' && <Rect {...ifStateRectProps}/>}
        {node.parentType === 'switch' && <Text {...ifStateProps}/>}
        <NodeIconBox {...iconBoxProps}/>
        <Text {...labelProps}/>
        {node.open && xputs.map(x => {
        const el = <Text key={x} text={x} x={viewItem.fontSize} y={anchorY} fontSize={viewItem.fontSize}/>;
        anchorY += viewItem.fontHeight + viewItem.spr.h / 4;
        return el;
      })}
      </Group>
    </Group>
  );
};

export default NodeRect;