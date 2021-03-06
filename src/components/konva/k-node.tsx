import React, { useRef, memo } from 'react';
import { lightBlue, amber, yellow, grey } from '@material-ui/core/colors';
import Konva from 'konva';
import { Rect, Group, Text } from 'react-konva';
import { task, switchSvg } from '../../resource/svg-icon';

import { KWithArrow, KTreeNode, Point, isTask, isSwitch } from '../../data-types/tree';

import Util from '../../func/util';
import { phrase } from '../../settings/phrase';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import KSize from '../../data-types/k-size';
import check from '../../resource/svg-icon/check';
import Icon, { IconProps } from './icon';
import TreeUtil from '../../func/tree';
import moreVert from '../../resource/svg-icon/more/more-vert';

export interface KNodeProps {
  node: KWithArrow;
  isEditing: boolean;
  labelFocus: boolean;
  ks: KSize;
  focus: (node: KWithArrow) => void;
  expand: (node: KWithArrow) => void;
  dragStart: (node: KTreeNode) => void;
  dragMove: (node: KTreeNode, point: Point) => void;
  getCurrentTree: () => KTreeNode;
  dragEnd: () => void;
  openInfo: (node: KWithArrow) => void;
  stageRef: React.RefObject<any>;
}

const KNode: React.FC<KNodeProps> = memo(props => {

  const { node, ks, stageRef } = props;

  const baseRef = useRef<any>(null);
  const draggableRef = useRef<any>(null);
  const rectRef = useRef<any>(null);

  const onMouseEnterBaseRect = (e: any) => {
    e.cancelBubble = true;
    if (!props.isEditing) { return; }
    const stage = stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'grab';
    }
  }

  const onMouseLeaveBaseRect = (e: any) => {
    e.cancelBubble = true;
    if (!props.isEditing) { return; }
    const stage = stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'default';
    }
  }

  const handleFocus = (e: any) => {
    e.cancelBubble = true;
    props.focus(node);
  }

  const onMouseEnterText = (e: any) => {
    e.cancelBubble = true;
    if (!props.isEditing) { return; }
    const stage = stageRef.current;
    if (stage !== null) {
      const isFocus = node.focus;
      stage.container().style.cursor = isFocus ? 'text' : 'grab';
    }
  }

  const onMouseLeaveText = (e: any) => {
    e.cancelBubble = true;
    if (!props.isEditing) { return; }
    const stage = stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'default';
    }
  }

  // const handleInfoOpen= (e: any) => {
  //   e.cancelBubble = true;
  //   props.openInfo(node);
  // }

  // const handleExpand = (e: any) => {
  //   e.cancelBubble = true;
  //   props.expand(node);
  // }

  const onMouseEnterButton = (e: any) => {
    e.cancelBubble = true;
    const stage = stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'pointer';
    }
  }

  const onMouseLeaveButton = (e: any) => {
    e.cancelBubble = true;
    const stage = stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'default';
    }
  }

  const handleDragStart = () => {
    if (!props.isEditing) { return; }
    rectRef.current!.to({
      strokeWidth: 0,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetY: 6,
      shadowOpacity: 0.3,
      duration: 0.1
    });
    draggableRef.current.to({
      scaleX: 1.1,
      scaleY: 1.1,
      x: -node.rect.w * ks.unit * 0.05,
      duration: 0.1
    });
    stageRef.current!.container().style.cursor = 'grabbing';
    props.dragStart(node);
  }

  const handleDragMove = (e: any) => {
    if (!props.isEditing) { return; }
    const dragPoint = e.target.position();
    e.target.x(-node.rect.w * ks.unit * 0.05 + dragPoint.x);
    e.target.y(-node.rect.h * ks.unit * 0.05 + dragPoint.y);
    
    props.dragMove({...node, focus: false}, {
      x: node.point.x * ks.unit + dragPoint.x,
      y: node.point.y * ks.unit + dragPoint.y
    });
  }

  const handleDragEnd = () => {
    if (!props.isEditing) { return; }
    stageRef.current!.container().style.cursor = 'default';
    draggableRef.current.to({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      easing: Konva.Easings.EaseInOut,
      onFinish: props.dragEnd
    });
    const currentTree = props.getCurrentTree();
    const ct = TreeUtil._find(currentTree, node.id)!;
    baseRef.current!.to({
      x: ct.point.x * ks.unit,
      y: ct.point.y * ks.unit,
      easing: Konva.Easings.EaseInOut
    });
  }

  const fill = node.isDraft ? grey[50] :
    isTask(node.type) ? lightBlue[50] :
    isSwitch(node.type) ? amber[100] : yellow[100];

  const baseRectProps = {
    x: 0, y: 0,
    width: node.rect.w * ks.unit,
    height: node.rect.h * ks.unit,
    cornerRadius: 4,
    fill,
    onMouseEnter: onMouseEnterBaseRect,
    onMouseLeave: onMouseLeaveBaseRect,
  };

  const rectProps = node.focus ? {
    ...baseRectProps,
    stroke: '#80bdff',
    shadowColor: '#80bdff',
    strokeWidth: 6,
    shadowBlur: 6,
    shadowOffsetY: 0,
    shadowOpacity: 1,
  } : baseRectProps;

  const labelProps = {
    text: Util.isEmpty(node.label)
      ? isTask(node.type) ? phrase.empty.task : isSwitch(node.type) ? phrase.empty.switch : phrase.empty.case
      : node.label,
    fontSize: ks.fontSize * ks.unit,
    x: (ks.rect.h + ks.fontSize / 2) * ks.unit,
    y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit,
    onMouseEnter: onMouseEnterText,
    onMouseLeave: onMouseLeaveText,
  };

  const typeProps: IconProps = {
    ks,
    x: 0, y: 0,
    svg: isTask(node.type) ? task : isSwitch(node.type) ? switchSvg : check,
    scale: isSwitch(node.type) ? { x: 1, y: -1 } : undefined,
  };

  // onTouchStart?(evt: Konva.KonvaEventObject<TouchEvent>): void;
  // onTouchMove?(evt: Konva.KonvaEventObject<TouchEvent>): void;
  // onTouchEnd?(evt: Konva.KonvaEventObject<TouchEvent>): void;

  const rectGroupProps = {
    x: 0, y: 0,
    ref: draggableRef,
    onClick: handleFocus,
    onTap: handleFocus,
    draggable: props.isEditing,
    onDragStart: handleDragStart,
    onTouchStart: handleDragStart,
    onDragMove: handleDragMove,
    onTouchMove: handleDragMove,
    onDragEnd: handleDragEnd,
    onTouchEnd: handleDragEnd,
  };

  const baseEl = baseRef.current;
  const draggableEl = draggableRef.current;
  // dragElが要素の参照を持っていてもなぜか座標を持っていない場合があるため x の値をチェック
  const willAnimation = baseEl !== null && draggableEl !== null &&
    (baseEl.x() !== 0 && !draggableEl.isDragging());
  if (willAnimation) {
    baseEl.to({
      x: node.point.x * ks.unit,
      y: node.point.y * ks.unit,
      easing: Konva.Easings.EaseInOut
    });
  }

  const x = !willAnimation ? node.point.x * ks.unit : undefined;
  const y = !willAnimation ? node.point.y * ks.unit : undefined;

  const moreProps: IconWithBadgeProps = {
    ks,
    x: (ks.rect.w - ks.rect.h) * ks.unit, y: 0,
    svg: moreVert,
    badgeContent: node.children.length,
    onClick: handleFocus,
    onTap: handleFocus,
    onMouseEnter: onMouseEnterButton,
    onMouseLeave: onMouseLeaveButton,
  };

  return (
    <Group ref={baseRef} x={x} y={y} >
      <Group {...rectGroupProps}>
        <Rect ref={rectRef} {...rectProps} />
        <Icon {...typeProps} />
        {!(node.focus && props.labelFocus) && <Text {...labelProps} />}  
        <IconWithBadge {...moreProps} />
      </Group>
    </Group>
  );
}, (prev, next) => {
  return !prev.node.isDragging && next.node.isDragging;
});

export default KNode;