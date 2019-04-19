import * as React from 'react';

import { Group, Path } from 'react-konva';
import { SvgPath } from '../../data-types/svg-path';

export interface SvgToPathProps {
  svg: SvgPath[];
  x: number;
  y: number;
  fill: string;
  scale?: {x: number, y: number};
  rotation?: number;
}

const SvgToPath: React.FC<SvgToPathProps> = (props: SvgToPathProps) => {
  const {svg, x, y, fill, scale, rotation} = props;
  const basePathProps = {x: 0, y: 0};

  return (
    <Group x={x} y={y}>
      {svg.map(s => (
        <Path
          key={`svg-to-path-${s.d}`}
          {...basePathProps}
          data={s.d}
          fill={s.fill ? fill : '#0000'}
          scale={{x: scale ? scale.x : 1, y: scale ? scale.y : 1}}
          rotation={rotation || 0}
        />
      ))}
    </Group>
  );
};

export default SvgToPath;