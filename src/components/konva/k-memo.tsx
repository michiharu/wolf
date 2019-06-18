import * as React from 'react';
import { useRef } from 'react';
import { lightBlue, amber, yellow } from '@material-ui/core/colors';
import Konva from 'konva';
import { Rect, Group, Text } from 'react-konva';

import { KTreeNode, isTask, isSwitch } from '../../data-types/tree';

import Util from '../../func/util';
import { phrase } from '../../settings/phrase';
import KSize from '../../data-types/k-size';
import { NodeEditMode } from '../../data-types/node-edit-mode';

export interface KMemoProps {
  mode: NodeEditMode;
  node: KTreeNode;
  labelFocus: boolean;
  ks: KSize;
  focus: (node: KTreeNode) => void;
  dragStart: (node: KTreeNode) => void;
  dragEnd: (node: KTreeNode) => void;
  moveToConvergent: (node: KTreeNode) => void;
}

const KMemo: React.FC<KMemoProps> = props => {
  
  const draggableRef = useRef<any>(null);

  const handleFocus = (e: any) => {
    e.cancelBubble = true;
    const {node, focus} = props;
    focus(node);
  }

  const handleDragStart = () => {
    const { node, dragStart } = props;
    dragStart(node);
  }

  const handleDragEnd = (e: any) => {
    const { node, dragEnd } = props;
    const point = { x: e.target.position().x, y: e.target.position().y };
    dragEnd({...node, point});
  }
  
  const { node, ks, labelFocus, moveToConvergent } = props;
  const fill = isTask(node.type) ? lightBlue[50] : isSwitch(node.type) ? amber[100] : yellow[100];
  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w * ks.unit,
    height: node.rect.h * ks.unit,
    cornerRadius: 4,
    fill,
    stroke: node.focus ? '#80bdff' : '#0000',
    strokeWidth: 6,
    shadowColor: node.focus ? '#80bdff' : 'black',
    shadowBlur: 6,
    shadowOffsetY: node.focus ? 0 : 3,
    shadowOpacity: node.focus ? 1 : 0.2,
  };

  const labelProps =  {
    text: Util.isEmpty(node.label)
      ? isTask(node.type) ? phrase.empty.task : isSwitch(node.type) ? phrase.empty.switch : phrase.empty.case
      : node.label,
    fontSize: ks.fontSize * ks.unit,
    x: (ks.rect.h + ks.fontSize / 2) * ks.unit,
    y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit
  };

  const dragEl = draggableRef.current;
  const willAnimation = dragEl !== null && (!dragEl.isDragging() || dragEl.x() !== 0);

  if (willAnimation) {
    dragEl!.to({
      x: node.point.x,
      y: node.point.y,
      easing: Konva.Easings.EaseInOut,
      onFinish: node.isMemo ? undefined : () => moveToConvergent(node),
    });
  }

  const x = !willAnimation ? node.point.x : undefined;
  const y = !willAnimation ? node.point.y : undefined;
  const rectGroupProps = {
    x, y,
    onClick: handleFocus,
    draggable: true,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };

  return (
    <Group ref={draggableRef} {...rectGroupProps}>
      <Rect {...baseRectProps}/>
      {!labelFocus &&  <Text {...labelProps}/>}
    </Group>
  );
}

export default KMemo;