import * as React from 'react';
import { Rect, Group, Text } from 'react-konva';

import outlineFlag from '../../resource/svg-icon/outline-flag';
import SvgToPath, { SvgToPathProps } from './svg-to-path';
import { viewItem } from '../../settings/layout';

interface Props {
  x: number;
  y: number;
}

const StartNode: React.FC<Props> = (props: Props) => {
  const {x, y} = props;
  const width = viewItem.rect.w;
  const height = viewItem.rect.h;viewItem.cornerRadius
  const fill = '#fff'
  const baseRectProps = {x: 0, y: 0, width, height, cornerRadius: viewItem.cornerRadius, fill};
  const labelProps = {
    text: 'スタート',
    fontSize: viewItem.fontSize,
    x: 130,
    y: (viewItem.rect.h - viewItem.fontHeight) / 2
  };
  const svgProps: SvgToPathProps = {
    x: 200,
    y: (viewItem.rect.h - viewItem.icon) / 2,
    svg: outlineFlag,
    fill: 'green'
  };

  return (
    <Group x={x} y={y}>
      <Rect {...baseRectProps}/>
      <Text {...labelProps}/>
      <SvgToPath {...svgProps}/>
    </Group>
  );
};

export default StartNode;