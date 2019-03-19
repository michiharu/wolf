import * as React from 'react';

import Konva from 'konva';
import { Rect, Group, Text } from 'react-konva';

import { CheckNode } from '../../data-types/tree-node';
import { viewItem, unit } from '../../settings/layout';

import Util from '../../func/util';
import NodeIconBox, { NodeIconBoxProps } from './icon-box';
import CheckBox, { CheckBoxProps } from './check-box';
import RadioButton from './radio-button';

export interface CheckKNodeProps {
  node: CheckNode;
  click: (node: CheckNode) => void;
  check: (node: CheckNode) => void;
}

const CheckKNode: React.FC<CheckKNodeProps> = (props: CheckKNodeProps) => {
  const {node, click, check} = props;

  const fill = node.type === 'task'
              ? node.focus ? '#99ccff' : '#89b7ff'
              : node.focus ? '#ffe733' : '#ffd700';
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

  if (node.id === '--') {
    const point = {x: node.point.x * unit, y: node.point.y * unit};
    return <Group {...point}><Rect {...baseRectProps}/></Group>;
  }

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    click(node);
  }

  const handleCheck = (e: any) => {
    e.cancelBubble = true;
    check(node);
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
  };

  const ifStateRectProps = {
    x: (viewItem.spr.w / 2 + viewItem.icon) * unit,
    y: (viewItem.rect.h + viewItem.textline - viewItem.fontHeight * 2 - viewItem.spr.h) / 2  * unit,
    width: (viewItem.rect.w - viewItem.spr.w - viewItem.icon) * unit,
    height: (viewItem.fontHeight + viewItem.spr.h / 2) * unit,
    cornerRadius: viewItem.cornerRadius * unit, fill: '#fff', opacity: 0.5
  };
  const ifStateProps = {
    text: node.ifState!,
    fontSize: viewItem.fontSize * unit,
    x: (viewItem.fontSize + viewItem.icon) * unit,
    y: (viewItem.rect.h + viewItem.textline - viewItem.fontHeight * 2 - viewItem.spr.h / 2) / 2  * unit,
  };

  const checkProps = {
    x: 0,
    y: 0,
    checked: node.checked,
    backgroundColor: '#0000',
    onClick: handleCheck
  };


  const labelProps = {
    text: node.label,
    fontSize: viewItem.fontSize * unit,
    x: (viewItem.fontSize + viewItem.icon) * unit,
    y: node.parentType === 'task'
      ? (viewItem.rect.h - viewItem.fontHeight) / 2 * unit
      : (viewItem.rect.h + viewItem.textline + viewItem.fontHeight) / 2 * unit
  };

  const iconBoxProps: NodeIconBoxProps = {
    x: node.rect.w * unit,
    y: labelProps.y - (viewItem.rect.h - viewItem.fontHeight) / 2 * unit,
    node,
    forCheck: true,
  };

  const xputs = [];
  if (!Util.isEmpty(node.input)) { xputs.push(node.input); }
  if (!Util.isEmpty(node.output)) { xputs.push(node.output); }
  var anchorY = labelProps.y + (viewItem.fontHeight + viewItem.spr.h / 2) * unit;

  const rectGroupProps = { x: 0, y: 0, onClick: handleClick };

  return (
    <Group x={node.point.x * unit} y={node.point.y * unit} >
      {node.open && node.children.length !== 0 && <Rect {...containerRectProps}/>}
      <Group {...rectGroupProps}>
        <Rect {...baseRectProps}/>
        {node.parentType === 'switch' && <Rect {...ifStateRectProps}/>}
        {node.parentType === 'switch' && <Text {...ifStateProps}/>}
        {node.parentType === 'task' ? <CheckBox {...checkProps}/> : <RadioButton {...checkProps}/>}
        <Text {...labelProps}/>
        <NodeIconBox {...iconBoxProps}/>
        {node.open && xputs.map(x => {
          const xProps = {
            text: x,
            x: viewItem.fontSize * unit,
            y: anchorY,
            fontSize: viewItem.subFontSize * unit
          };
          const el = <Text key={x} {...xProps}/>;
          anchorY += (viewItem.subFontHeight + viewItem.spr.h / 4) * unit;
          return el;
        })}
      </Group>
    </Group>
  );
};

export default CheckKNode;