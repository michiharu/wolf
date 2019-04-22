import * as React from 'react';

import { Group, Rect, Text } from 'react-konva';
import { SvgPath } from '../../data-types/svg-path';

import Icon, { IconProps } from './icon';
import { theme } from '../..';
import KSize from '../../data-types/k-size';

export interface IconWithBadgeProps {
  ks: KSize;
  x: number;
  y: number;
  svg: SvgPath[];
  color?: string;
  backgroundColor?: string;
  badgeContent: number;
  rotate?: number;
  scale?: {x: number, y: number};
  onClick?: (e: any) => void;
}

const IconWithBadge: React.FC<IconWithBadgeProps> = (props: IconWithBadgeProps) => {
  const {ks, x, y, svg, color, backgroundColor, badgeContent, rotate, scale} = props;
  const iconProps: IconProps = {
    ...props, ks, x: 0, y: 0
  };
  if (badgeContent < 1) { return <Group x={x} y={y}><Icon {...iconProps}/></Group>; }
  const badgeLength = String(badgeContent).length;

  const bl = ks.badgeFontHeight * 2;
  const rectProps = {
    x: (ks.rect.h / 2) * ks.unit,
    y: (ks.rect.h * 9 / 20 - bl) * ks.unit,
    width: (bl + (badgeLength - 1) * ks.badgeFontSize / 3) * ks.unit,
    height: bl * ks.unit,
    fill: theme.palette.primary.main,
    cornerRadius: bl / 2 * ks.unit,
  };

  const textProps = {
    x: (ks.rect.h / 2 + bl / 2.2 - (badgeLength) * ks.badgeFontSize / 6) * ks.unit,
    y: (ks.rect.h * 9 / 20 - bl * 0.76) * ks.unit,
    text: badgeContent,
    fontSize: ks.badgeFontSize * ks.unit,
    fill: '#fff',
  };

  return (
    <Group x={x} y={y}>
      <Icon {...iconProps}/>
      <Rect {...rectProps}/>
      <Text {...textProps}/>
    </Group>
  );
};

export default IconWithBadge;