import * as React from 'react';

import { Group, Rect, Text } from 'react-konva';
import { viewItem, unit } from '../../settings/layout';
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
  const bl = viewItem.rect.h * 0.9;
  const rectProps = {
    x: (viewItem.rect.h / 2 - ((over ? 1 : badgeContent.length - 1) * viewItem.badgeFontSize / 4)) * unit,
    y: viewItem.rect.h / 40 * unit,
    width: (bl / 2 + (over ? 1 : (badgeContent.length - 1)) * viewItem.badgeFontSize / 2) * unit,
    height: bl / 2 * unit,
    fill: theme.palette.primary.main,
    cornerRadius: bl / 2 * unit,
  };

  const textProps = {
    x: (viewItem.rect.h / 2 + bl / 4 - (over ? 1.5 : badgeContent.length) * viewItem.badgeFontSize / 3.7) * unit,
    y: (viewItem.rect.h * 0 + viewItem.rect.h / 4 - viewItem.badgeFontHeight / 2) * unit,
    text: over ? '...' : badgeContent,
    fontSize: viewItem.badgeFontSize * unit,
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