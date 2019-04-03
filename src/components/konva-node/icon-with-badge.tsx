import * as React from 'react';

import { Group, Rect, Text } from 'react-konva';
import { ks } from '../../settings/layout';
import { SvgPath } from '../../data-types/svg-path';

import Icon, { IconProps } from './icon';
import { theme } from '../..';

export interface IconWithBadgeProps {
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
  const {x, y, svg, color, backgroundColor, badgeContent, rotate, scale} = props;
  const iconProps: IconProps = {
    x: 0, y: 0, svg, color, backgroundColor: backgroundColor || '#0000', rotate, scale
  };
  if (badgeContent === false) { return <Group x={x} y={y}><Icon {...iconProps}/></Group>; }

  const over = 3 < badgeContent.length;
  const bl = ks.rect.h * 0.9;
  const rectProps = {
    x: (ks.rect.h / 2 - ((over ? 1 : badgeContent.length - 1) * ks.badgeFontSize / 4)) * ks.unit,
    y: ks.rect.h / 40 * ks.unit,
    width: (bl / 2 + (over ? 1 : (badgeContent.length - 1)) * ks.badgeFontSize / 2) * ks.unit,
    height: bl / 2 * ks.unit,
    fill: theme.palette.primary.main,
    cornerRadius: bl / 2 * ks.unit,
  };

  const textProps = {
    x: (ks.rect.h / 2 + bl / 4 - (over ? 1.5 : badgeContent.length) * ks.badgeFontSize / 3.7) * ks.unit,
    y: (ks.rect.h * 0 + ks.rect.h / 4 - ks.badgeFontHeight / 2) * ks.unit,
    text: over ? '...' : badgeContent,
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