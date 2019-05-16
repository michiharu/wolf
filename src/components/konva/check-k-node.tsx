import * as React from 'react';
import { lightBlue, amber, yellow, grey } from '@material-ui/core/colors';

import { Rect, Group, Text } from 'react-konva';

import { CheckNode } from '../../data-types/tree';

import Util from '../../func/util';
import CheckBox, { CheckBoxProps } from './check-box';
import RadioButton from './radio-button';
import KSize from '../../data-types/k-size';

export interface CheckKNodeProps {
  ks: KSize;
  node: CheckNode;
  click: (node: CheckNode) => void;
  check: (node: CheckNode) => void;
}

const CheckKNode: React.FC<CheckKNodeProps> = (props: CheckKNodeProps) => {
  const {ks, node, click, check} = props;

  const fill =
    node.id === '--' || node.skipped ? grey[400] :
    node.type === 'task' ?   node.focus ? lightBlue[200] : lightBlue[300] :
    node.type === 'switch' ? node.focus ? amber[400]     : amber[300] :
                             node.focus ? yellow[400]    : yellow[300];
  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w * ks.unit,
    height: node.rect.h * ks.unit,
    cornerRadius: ks.cornerRadius * ks.unit,
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

  const handleCheck = (e: any) => {
    e.cancelBubble = true;
    check(node);
  }

  const stroke = '#dddd';
  const strokeWidth = 2;
  const containerRectProps = {
    x: ks.spr.w * ks.unit,
    y: ks.spr.h * ks.unit,
    width: (node.self.w - ks.spr.w) * ks.unit,
    height: (node.self.h - ks.spr.h) * ks.unit,
    cornerRadius: ks.cornerRadius * ks.unit,
    stroke,
    strokeWidth,
  };

  const checkProps = {
    ks,
    x: 0,
    y: 0,
    checked: node.checked,
    backgroundColor: '#0000',
    onClick: handleCheck
  };


  const labelProps = {
    text: node.label,
    fontSize: ks.fontSize * ks.unit,
    x: (ks.fontSize + ks.icon) * ks.unit,
    y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit
  };

  const rectGroupProps = { x: 0, y: 0, onClick: handleClick };

  return (
    <Group x={node.point.x * ks.unit} y={node.point.y * ks.unit} >
      {node.open && node.children.length !== 0 && <Rect {...containerRectProps}/>}
      <Group {...rectGroupProps}>
        <Rect {...baseRectProps}/>
        {node.type !== 'case' ? <CheckBox {...checkProps}/> : <RadioButton {...checkProps}/>}
        <Text {...labelProps}/>
      </Group>
    </Group>
  );
};

export default CheckKNode;