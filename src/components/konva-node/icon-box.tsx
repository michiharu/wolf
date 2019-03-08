import * as React from 'react';

import { Group, Rect } from 'react-konva';
import { viewItem } from '../../settings/layout';
import { SvgPath } from '../../data-types/svg-path';
import SvgToPath from './svg-to-path';
import { TreeViewNode } from '../../data-types/tree-node';
import Icon, { IconProps } from './icon';
import { input, output, task, switchSvg} from '../../resource/svg-icon';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import Util from '../../func/util';

export interface NodeIconBoxProps {
  x: number;
  y: number;
  node: TreeViewNode;
}

const NodeIconBox: React.FC<NodeIconBoxProps> = (props: NodeIconBoxProps) => {
  const {x, y, node} = props;
  const backgroundColor = '#0000';
  const inputIconProps: IconProps = { x: 0, y: 0, svg: input, backgroundColor, };
  const outputIconProps: IconProps = { x: 0, y: 0, svg: output, backgroundColor, };
  const badgeContent = String(node.children.length);
  const selfIconProps: IconWithBadgeProps = {
    x: 0, y: 0, svg: node.type === 'task' ? task : switchSvg, backgroundColor, badgeContent,
    scale: node.type === 'task' ? undefined : {x: 1, y: -1},
  };
  const iconWidth = viewItem.rect.h * 0.7;
  var count = 0;
  if (!Util.isEmpty(node.input))  { count++; }
  if (!Util.isEmpty(node.output)) { count++; }
  if (node.children.length !== 0) { count++; }
  var anchorX = -(count * iconWidth + viewItem.rect.h * 0.28);

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
      {node.children.length !== 0 && <IconWithBadge {...selfIconProps}/>}
    </Group>
  );
};

export default NodeIconBox;