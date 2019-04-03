import * as React from 'react';

import { Group, Rect } from 'react-konva';
import { ks } from '../../settings/layout';
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
  onClick?: (e: any) => void;
}

const Icon: React.FC<IconProps> = (props: IconProps) => {
  const {x, y, svg, color, backgroundColor, rotate, scale, onClick} = props;
  const baseRectProps = {
    x: 0, y: 0,
    width: ks.rect.h * ks.unit,
    height: ks.rect.h * ks.unit,
    fill: backgroundColor || '#ccc',
    opacity: 0.2,
    cornerRadius: ks.rect.h / 2 * ks.unit,
  };
  const transRate = ks.unit / 20;
  const svgProps = {
    x: (ks.rect.h - ks.icon) / 2 * ks.unit,
    y: (ks.rect.h - ks.icon) / 2 * ks.unit,
    svg,
    fill: color || 'black',
    rotate: rotate || 0,
    scale: scale
      ? {x: scale.x * transRate, y: scale.y * transRate}
      : {x: transRate, y: transRate}
  };

  return (
    <Group x={x} y={scale ? y + ks.icon * ks.unit : y} onClick={onClick}>
      <Rect {...baseRectProps}/>
      <SvgToPath {...svgProps}/>
    </Group>
  );
};

export default Icon;