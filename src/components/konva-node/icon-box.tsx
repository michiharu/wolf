import * as React from 'react';

import { Group } from 'react-konva';
import { viewItem, unit } from '../../settings/layout';
import { EditableNode } from '../../data-types/tree-node';
import Icon, { IconProps } from './icon';
import { input, output, task, switchSvg} from '../../resource/svg-icon';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import Util from '../../func/util';

export interface NodeIconBoxProps {
  x: number;
  y: number;
  node: EditableNode;
  forCheck?: boolean;
}

const NodeIconBox: React.FC<NodeIconBoxProps> = (props: NodeIconBoxProps) => {
  const {x, y, node, forCheck} = props;
  const backgroundColor = '#0000';
  const inputIconProps: IconProps = { x: 0, y: 0, svg: input, backgroundColor, };
  const outputIconProps: IconProps = { x: 0, y: 0, svg: output, backgroundColor, };
  const badgeContent = String(node.children.length);
  const isTask = node.type === 'task';
  const selfIconProps: IconWithBadgeProps = {
    x: 0, y: 0, svg: isTask ? task : switchSvg, backgroundColor, badgeContent,
    scale: node.type === 'task' ? undefined : {x: 1, y: -1},
  };
  const iconWidth = viewItem.rect.h * 0.7 * unit;
  var count = 0;
  if (!Util.isEmpty(node.input))  { count++; }
  if (!Util.isEmpty(node.output)) { count++; }
  if (node.children.length !== 0 && !forCheck) { count++; }
  var anchorX = -(count * iconWidth + viewItem.rect.h * 0.28 * unit);

  if (!Util.isEmpty(node.input))  {
    inputIconProps.x = anchorX;
    anchorX += iconWidth;
  }
  if (!Util.isEmpty(node.output)) {
    outputIconProps.x = anchorX;
    anchorX += iconWidth;
  }
  if (node.children.length !== 0) {
    selfIconProps.x = anchorX;
  }

  return (
    <Group x={x} y={y}>
      {!Util.isEmpty(node.input)  && <Icon {...inputIconProps}/>}
      {!Util.isEmpty(node.output) && <Icon {...outputIconProps}/>}
      {node.children.length !== 0 && !forCheck && <IconWithBadge {...selfIconProps}/>}
    </Group>
  );
};

export default NodeIconBox;