import * as React from 'react';

import { Group, Rect } from 'react-konva';
import { SvgPath } from '../../data-types/svg-path';
import SvgToPath from './svg-to-path';
import KSize from '../../data-types/k-size';

export interface IconProps {
  ks: KSize;
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
  const {ks, x, y, svg, color, backgroundColor, rotate, scale, onClick} = props;
  const baseRectProps = {
    x: (ks.rect.h - ks.icon * 2) / 2 * ks.unit,
    y: (ks.rect.h - ks.icon * 2) / 2 * ks.unit,
    width: ks.icon * 2 * ks.unit,
    height: ks.icon * 2 * ks.unit,
    fill: backgroundColor,
    opacity: 0.2,
    cornerRadius: ks.rect.h / 2 * ks.unit,
  };
  const transRate = ks.unit / 24;
  const svgProps = {
    x: (ks.rect.h - ks.icon) / 2 * ks.unit,
    y: scale === undefined
      ? (ks.rect.h - ks.icon) / 2 * ks.unit
      : (ks.rect.h - ks.icon * scale.y) / 2 * ks.unit,
    svg,
    fill: color || 'black',
    rotate: rotate || 0,
    scale: scale
      ? {x: scale.x * transRate, y: scale.y * transRate}
      : {x: transRate, y: transRate}
  };

  return (
    <Group x={x} y={y} onClick={onClick}>
      <Rect {...baseRectProps}/>
      <SvgToPath {...svgProps}/>
    </Group>
  );
};

export default Icon;