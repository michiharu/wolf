import * as React from 'react';

import { Group, Rect } from 'react-konva';
import { viewItem } from '../../settings/layout';
import { SvgPath } from '../../data-types/svg-path';
import SvgToPath from './svg-to-path';
import { number } from 'prop-types';

export interface IconProps {
  x: number;
  y: number;
  svg: SvgPath[];
  color?: string;
  backgroundColor?: string;
  rotate?: number;
  scale?: {x: number, y: number};
}

const Icon: React.FC<IconProps> = (props: IconProps) => {
  const {x, y, svg, color, backgroundColor, rotate, scale} = props;
  const baseRectProps = {
    x: 0, y: 0,
    width: viewItem.rect.h,
    height: viewItem.rect.h,
    fill: backgroundColor || '#ccc',
    opacity: 0.2,
    cornerRadius: viewItem.rect.h / 2,
  };

  const svgProps = {
    x: (viewItem.rect.h - viewItem.icon) / 2,
    y: (viewItem.rect.h - viewItem.icon) / 2,
    svg,
    fill: color || 'black',
    rotate: rotate || 0,
    scale
  };

  return (
    <Group x={x} y={scale ? y + viewItem.icon : y}>
      <Rect {...baseRectProps}/>
      <SvgToPath {...svgProps}/>
    </Group>
  );
};

export default Icon;