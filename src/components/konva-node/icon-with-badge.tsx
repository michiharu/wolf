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
  badgeContent: string | false;
  rotate?: number;
  scale?: {x: number, y: number};
}

const IconWithBadge: React.FC<IconWithBadgeProps> = (props: IconWithBadgeProps) => {
  const {ks, x, y, svg, color, backgroundColor, badgeContent, rotate, scale} = props;
  const iconProps: IconProps = {
    ks, x: 0, y: 0, svg, color, backgroundColor: backgroundColor || '#0000', rotate, scale
  };
  if (badgeContent === false) { return <Group x={x} y={y}><Icon {...iconProps}/></Group>; }

  const bl = ks.badgeFontHeight * 2;
  const rectProps = {
    x: (ks.rect.h / 2 - ((badgeContent.length - 1) * bl / 7)) * ks.unit,
    y: (ks.rect.h / 2 - bl) * ks.unit,
    width: (bl + (badgeContent.length - 1) * ks.badgeFontSize / 2) * ks.unit,
    height: bl * ks.unit,
    fill: theme.palette.primary.main,
    cornerRadius: bl / 2 * ks.unit,
  };

  const textProps = {
    x: (ks.rect.h / 2 + bl / 2 - (badgeContent.length) * ks.badgeFontSize / 3.7) * ks.unit,
    y: (ks.rect.h / 2 - bl * 0.75) * ks.unit,
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