import _ from 'lodash';
import * as React from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';
import { DragRow, KWithArrow } from '../../../data-types/tree';
import KSize from '../../../data-types/k-size';

interface Props {
  node: KWithArrow;
  rows: DragRow[];
  ks: KSize;
}

const DragMap: React.SFC<Props> = ({node, rows, ks}: Props) => (
  <Group draggable>
    {rows !== null && rows.map((___, y) => {
      const row = rows[y];
      if (row === undefined) { return <Rect key={`${y}`}/>; }
      const fill = row.action === 'moveInOut' ? ('#ccff' + _.padStart(String(row.node.depth.top * 16), 2, '0')) :
                  row.action === 'moveToBrother' ? 'blue' : 'grey';
      const labelProps = {
        text: row.node.type.toString(),
        fontSize: ks.fontSize * ks.unit,
      };
      return (
        <Group key={`${y}`} x={400} y={y * ks.unit}>
          <Rect x={0} y={0} width={node.self.w * ks.unit} height={ks.unit} fill={fill} stroke="#000" strokeWidth={1}/>
          <Text {...labelProps}/>
        </Group>
      );
    })}
  </Group>
);

export default DragMap;