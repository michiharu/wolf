import React, { useRef, memo } from 'react';
import { teal, grey } from '@material-ui/core/colors';
import Konva from 'konva';
import { Rect, Group, Text, Arrow } from 'react-konva';
import { flag } from '../../resource/svg-icon';

import { KWithArrow } from '../../data-types/tree';

import KSize from '../../data-types/k-size';
import Icon, { IconProps } from './icon';
import { theme } from '../..';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import moreVert from '../../resource/svg-icon/more/more-vert';

export interface KStartProps {
  node: KWithArrow;
  isEditing: boolean;
  nowDragging: boolean;
  ks: KSize;
  focus: (node: KWithArrow) => void;
  openInfo: (node: KWithArrow) => void;
  stageRef: React.RefObject<any>;
}

const KStart: React.FC<KStartProps> = memo(props => {

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
    if (node.focus) { return; }
    props.focus(node);
  }

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

  const fill = teal.A100;

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
    shadowOpacity: node.focus ? 1 : props.nowDragging ? 0.2 : 0.1,
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
    text: "スタート",
    fontSize: ks.fontSize * ks.unit,
    x: (ks.rect.h + ks.fontSize / 2) * ks.unit,
    y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit,
  };

  const typeProps: IconProps = {
    ks,
    x: 0, y: 0,
    svg: flag,
    color: theme.palette.primary.main
  };

  // onTouchStart?(evt: Konva.KonvaEventObject<TouchEvent>): void;
  // onTouchMove?(evt: Konva.KonvaEventObject<TouchEvent>): void;
  // onTouchEnd?(evt: Konva.KonvaEventObject<TouchEvent>): void;

  const rectGroupProps = {
    x: 0, y: 0,
    ref: draggableRef,
    onClick: handleFocus,
    onTap: handleFocus,
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
    onMouseEnter: onMouseEnterButton,
    onMouseLeave: onMouseLeaveButton,
  };

  const arrowBaseProps = {
    stroke: grey[700],
    fill: grey[700],
    pointerLength: ks.pointerLength * ks.unit,
    pointerWidth: ks.pointerWidth * ks.unit,
  }

  return (
    <Group ref={baseRef} x={x} y={y} >
      <Group {...rectGroupProps}>
        <Rect ref={rectRef} {...rectProps} />
        <Icon {...typeProps} />
        <Text {...labelProps} />
        <IconWithBadge {...moreProps} />
        {ks.hasArrow && node.arrows.map((a, i) => {
          const points = a.map(point => [point.x, point.y]).reduce((before, next) => before.concat(next)).map(p => p * ks.unit);
          return <Arrow key={`${node.id}-arrow-${i}`} {...arrowBaseProps} points={points} />;
        })}
      </Group>
    </Group>
  );
}, (prev, next) => {
  return !prev.node.isDragging && next.node.isDragging;
});

export default KStart;