import * as React from 'react';

import { Group } from 'react-konva';
import { viewItem, unit } from '../../settings/layout';
import { EditableNode } from '../../data-types/tree-node';
import Icon, { IconProps } from './icon';
import { input, output, task, switchSvg} from '../../resource/svg-icon';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import Util from '../../func/util';
import check from '../../resource/svg-icon/check';

export interface NodeIconBoxProps {
  x: number;
  y: number;
  node: EditableNode;
  forCheck?: boolean;
}

const NodeIconBox: React.FC<NodeIconBoxProps> = (props: NodeIconBoxProps) => {
  const {x, y, node, forCheck} = props;
  const backgroundColor = '#0000';
  const badgeContent = String(node.children.length);

  const selfIconProps: IconWithBadgeProps = {
    x: 0, y: 0,
    svg: node.type === 'task' ? task : node.type === 'switch' ? switchSvg : check,
    backgroundColor, badgeContent,
    scale: node.type !== 'switch' ? undefined : {x: 1, y: -1},
  };
  const iconWidth = viewItem.rect.h * 0.7 * unit;
  var count = 0;
  if (node.children.length !== 0 && !forCheck) { count++; }
  var anchorX = -(count * iconWidth + viewItem.rect.h * 0.28 * unit);

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