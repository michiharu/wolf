import * as React from 'react';
import { lightBlue, amber, yellow, grey } from '@material-ui/core/colors';
import { Rect, Group, Text, Arrow } from 'react-konva';
import { task, switchSvg, flag } from '../../resource/svg-icon';

import { KWithArrow, isSwitch, isTask } from '../../data-types/tree';

import { theme } from '../..';
import Util from '../../func/util';
import { phrase } from '../../settings/phrase';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import KSize from '../../data-types/k-size';
import check from '../../resource/svg-icon/check';
import Icon, { IconProps } from './icon';
import more from '../../resource/svg-icon/expand/more';
import less from '../../resource/svg-icon/expand/less';

export interface KNodeProps {
  node: KWithArrow;
  ks: KSize;
  expand: (node: KWithArrow) => void;
}

const KViewNode: React.FC<KNodeProps> = props => {
  const { node, ks, expand } = props;
  const fill = isTask(node.type) ? lightBlue[50] :
  isSwitch(node.type) ? amber[100] : yellow[100];
  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w * ks.unit,
    height: node.rect.h * ks.unit,
    cornerRadius: 4,
    fill,
    stroke: '#0000',
    strokeWidth: 6,
    shadowColor: 'black',
    shadowBlur: 6,
    shadowOffsetY: 3,
    shadowOpacity: 0.2,
  };

  const labelProps = {
    text: Util.isEmpty(node.label)
      ? isTask(node.type) ? phrase.empty.task : isSwitch(node.type) ? phrase.empty.switch : phrase.empty.case
      : node.label,
    fontSize: ks.fontSize * ks.unit,
    x: (ks.rect.h + ks.fontSize / 2) * ks.unit,
    y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit
  };

  const typeProps: IconProps = {
    ks,
    x: 0, y: 0,
    svg: isTask(node.type) ? task : isSwitch(node.type) ? switchSvg : check,
    scale: isSwitch(node.type) ? {x: 1, y: -1} : undefined,
  };

  const containerRectProps = {
    x: (ks.indent / 2 - ks.spr.w) * ks.unit,
    y: ks.spr.h * ks.unit,
    width: (node.self.w - (ks.indent / 2 - ks.spr.w)) * ks.unit,
    height: (node.self.h - ks.spr.h) * ks.unit,
    cornerRadius: ks.cornerRadius * ks.unit,
    stroke: grey[500],
    fill: node.depth.top === 0 ? theme.palette.background.paper : '#00000009',
    strokeWidth: ks.hasArrow ? 0 : 1,
  };

  const arrowBaseProps = {
    stroke: grey[700],
    fill: grey[700],
    pointerLength: ks.pointerLength * ks.unit,
    pointerWidth: ks.pointerWidth * ks.unit,
  }
  const endIconProps: IconProps = {
    ks,
    x: -ks.rect.h * ks.unit, y: 0,
    svg: flag,
    color: theme.palette.secondary.main,
  };

  const expandProps: IconWithBadgeProps = {
    ks,
    x: (ks.rect.w - ks.rect.h) * ks.unit, y: 0,
    svg: node.open ? less : more,
    badgeContent: node.children.length,
    onClick: () => expand(node)
  };

  return (
    <Group x={node.point.x * ks.unit} y={node.point.y * ks.unit} >
        
        {node.open && <Rect {...containerRectProps}/>}
        <Rect {...baseRectProps}/>
        <Icon {...typeProps}/>
        <Text {...labelProps}/>
        {node.children.length !== 0 && <IconWithBadge {...expandProps}/>}
        {ks.hasArrow && node.arrows.map((a, i) => {
          const points = a.map(point => [point.x, point.y]).reduce((before, next) => before.concat(next)).map(p => p * ks.unit);
          return <Arrow key={`${node.id}-arrow-${i}`} {...arrowBaseProps} points={points}/>;
        })}
        {node.arrows.length === 0 && node.depth.top !== 0 && <Icon {...endIconProps}/>}
    </Group>
  );
}

export default KViewNode;