import * as React from 'react';

import { Group } from 'react-konva';
import { SvgPath } from '../../data-types/svg-path';
import SvgToPath from './svg-to-path';
import KSize from '../../data-types/k-size';

export interface IconInRectProps {
  ks: KSize;
  x: number;
  y: number;
  svg: SvgPath[];
  color?: string;
}

const IconInRect: React.FC<IconInRectProps> = (props: IconInRectProps) => {
  const {ks, x, y, svg, color} = props;

  const transRate = ks.unit / 20;
  const svgProps = {
    x: (ks.rect.h - ks.icon) / 2 * ks.unit,
    y: (ks.rect.h - ks.icon) / 2 * ks.unit,
    svg,
    fill: color || 'black',
    scale: {x: transRate, y: transRate},
  };

  return (
    <Group x={x} y={y}>
      <SvgToPath {...svgProps}/>
    </Group>
  );
};

export default IconInRect;