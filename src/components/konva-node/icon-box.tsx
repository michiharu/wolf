import * as React from 'react';

import { Group } from 'react-konva';

import { EditableNode } from '../../data-types/tree-node';
import { task, switchSvg} from '../../resource/svg-icon';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import check from '../../resource/svg-icon/check';
import KSize from '../../data-types/k-size';

export interface NodeIconBoxProps {
  ks: KSize;
  x: number;
  y: number;
  node: EditableNode;
  forCheck?: boolean;
}

const NodeIconBox: React.FC<NodeIconBoxProps> = (props: NodeIconBoxProps) => {
  const {ks, x, y, node, forCheck} = props;
  const backgroundColor = '#0000';
  const badgeContent = String(node.children.length);

  const selfIconProps: IconWithBadgeProps = {
    ks,
    x: 0, y: 0,
    svg: node.type === 'task' ? task : node.type === 'switch' ? switchSvg : check,
    backgroundColor, badgeContent,
    scale: node.type !== 'switch' ? undefined : {x: 1, y: -1},
  };
  const iconWidth = ks.rect.h * 0.7 * ks.unit;
  var count = 0;
  if (node.children.length !== 0 && !forCheck) { count++; }
  var anchorX = -(count * iconWidth + ks.rect.h * 0.28 * ks.unit);

  if (node.children.length !== 0) {
    selfIconProps.x = anchorX;
  }

  return (
    <Group x={x} y={y}>
      {node.children.length !== 0 && !forCheck && <IconWithBadge {...selfIconProps}/>}
    </Group>
  );
};

export default NodeIconBox;