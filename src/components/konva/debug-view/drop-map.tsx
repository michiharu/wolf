import _ from 'lodash';
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { KWithArrow } from '../../../data-types/tree-node';
import KSize from '../../../data-types/k-size';
import KTreeUtil from '../../../func/k-tree';
import { blue } from '@material-ui/core/colors';

interface Props {
  node: KWithArrow;
  flatNodes: KWithArrow[];
  ks: KSize;
}

const DropMap: React.SFC<Props> = ({node, flatNodes, ks}: Props) => (
  <Group x={0} y={0} draggable>
    {KTreeUtil.makeDropMap(flatNodes, ks).map((row, y) => {
      if (row === undefined) { return <Rect key={`${y}`}/>; }
      const fill = row.action === 'insertBefore' ? blue[100] :
                  row.action === 'insertNext' ? blue[400] : 'grey';
      const labelProps = {
        text: `${row.node.type} : ${row.node.label}`,
        fontSize: ks.fontSize * ks.unit,
      };
      return (
        <Group key={`${y}`} x={500} y={y * ks.unit}>
          <Rect x={0} y={0} width={node.self.w * ks.unit} height={ks.unit} fill={fill} stroke="#000" strokeWidth={1}/>
          <Text {...labelProps}/>
        </Group>
      );
    })}
  </Group>
);

export default DropMap;