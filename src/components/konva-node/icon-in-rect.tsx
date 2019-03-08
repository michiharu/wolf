import * as React from 'react';

import { Group } from 'react-konva';
import { viewItem } from '../../settings/layout';
import { SvgPath } from '../../data-types/svg-path';
import SvgToPath from './svg-to-path';

export interface IconInRectProps {
  x: number;
  y: number;
  svg: SvgPath[];
  color?: string;
}

const IconInRect: React.FC<IconInRectProps> = (props: IconInRectProps) => {
  const {x, y, svg, color} = props;

  const svgProps = {
    x: (viewItem.rect.h - viewItem.icon) / 2,
    y: (viewItem.rect.h - viewItem.icon) / 2,
    svg,
    fill: color || 'black',
  };

  return (
    <Group x={x} y={y}>
      <SvgToPath {...svgProps}/>
    </Group>
  );
};

export default IconInRect;