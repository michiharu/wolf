import * as React from 'react';

import { Rect, Group, Text, Path } from 'react-konva';

import TreeNode from '../../data-types/tree-node';
import outlineFlag from '../../resource/svg-outline-flag';
import { SvgPath } from '../../data-types/svg-path';

interface Props {
  svg: SvgPath[];
  x: number;
  y: number;
  fill: string;
  scale?: number;
}

const SvgToPath: React.FC<Props> = (props: Props) => {
  const {svg, x, y, fill, scale} = props;
  const basePathProps = {x: 0, y: 0};

  return (
    <Group x={x} y={y}>
      {svg.map((s, i) => (
        <Path
          key={`svg-to-path-${s.d}`}
          {...basePathProps}
          data={s.d}
          fill={s.fill ? fill : '#0000'}
          scale={{x: scale || 1, y: scale || 1}}
        />
      ))}
    </Group>
  );
};

export default SvgToPath;