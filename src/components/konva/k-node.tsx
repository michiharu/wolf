import * as React from 'react';
import { lightBlue, amber, yellow, grey } from '@material-ui/core/colors';
import Konva from 'konva';
import { Rect, Group, Text, Arrow } from 'react-konva';
import { task, switchSvg, flag } from '../../resource/svg-icon';

import { KWithArrow, KTreeNode, Point, isTask, isSwitch } from '../../data-types/tree';

import { theme } from '../..';
import Util from '../../func/util';
import { phrase } from '../../settings/phrase';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import KSize from '../../data-types/k-size';
import check from '../../resource/svg-icon/check';
import Icon, { IconProps } from './icon';
import more from '../../resource/svg-icon/expand/more';
import less from '../../resource/svg-icon/expand/less';
import { NodeEditMode } from '../../data-types/node-edit-mode';

export interface KNodeProps {
  mode: NodeEditMode;
  node: KWithArrow;
  labelFocus: boolean;
  ks: KSize;
  focus: (node: KWithArrow) => void;
  expand: (node: KWithArrow) => void;
  dragStart: (node: KTreeNode) => void;
  dragMove: (node: KTreeNode, point: Point) => void;
  dragEnd: (node: KTreeNode, point: Point) => void;
  dragAnimationEnd: () => void;
  deleteFocus: () => void;
  stageRef: React.RefObject<any>;
}

class KNode extends React.Component<KNodeProps> {
  
  baseRef = React.createRef<any>();
  draggableRef = React.createRef<any>();

  componentDidMount() {
    process.nextTick(() => this.setState({}));
  }

  onMouseEnterBaseRect = (e: any) => {
    e.cancelBubble = true;
    const stage = this.props.stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'grab';
    }
  }

  onMouseLeaveBaseRect = (e: any) => {
    e.cancelBubble = true;
    const stage = this.props.stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'default';
    }
  }

  handleFocus = (e: any) => {
    e.cancelBubble = true;
    const {node, focus} = this.props;
    focus(node);
  }

  onMouseEnterText = (e: any) => {
    e.cancelBubble = true;
    const stage = this.props.stageRef.current;
    if (stage !== null) {
      const focus = this.props.node.focus;
      stage.container().style.cursor = focus ? 'text' : 'grab';
    }
  }

  onMouseLeaveText = (e: any) => {
    e.cancelBubble = true;
    const stage = this.props.stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'default';
    }
  }

  handleExpand = (e: any) => {
    e.cancelBubble = true;
    const {node, expand} = this.props;
    expand(node);
  }

  onMouseEnterExpand = (e: any) => {
    e.cancelBubble = true;
    const stage = this.props.stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'pointer';
    }
  }

  onMouseLeaveExpand = (e: any) => {
    e.cancelBubble = true;
    const stage = this.props.stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'default';
    }
  }

  handleDragStart = (e: any) => {
    const {node, dragStart} = this.props;
    const stage = this.props.stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'grabbing';
    }
    dragStart(node);
  }

  handleDragMove = (e: any) => {
    const {node, ks, dragMove} = this.props;
    const dragPoint = e.target.position();
    dragMove(node, {
      x: node.point.x * ks.unit + dragPoint.x,
      y: node.point.y * ks.unit + dragPoint.y
    });
  }

  handleDragEnd = (e: any) => {
    const {mode, node, ks, dragEnd, dragAnimationEnd} = this.props;
    const dragPoint = e.target.position();
    const x = node.point.x * ks.unit + dragPoint.x;
    const y = node.point.y * ks.unit + dragPoint.y;
    dragEnd(node, { x, y });
    const stage = this.props.stageRef.current;
    if (stage !== null) {
      stage.container().style.cursor = 'default';
    }
    if (mode === 'dc' && x < 0) {
      e.target.destroy();
      process.nextTick(() => dragAnimationEnd());
    } else {
      e.target.to({
        x: 0, y: 0, easing: Konva.Easings.EaseInOut,
        onFinish: dragAnimationEnd,
      });
    }
  }

  handleDeleteFocus = (e: any) => {
    e.cancelBubble = true;
    this.props.deleteFocus();
  }
  
  render() {
    const { node, ks, labelFocus } = this.props;
    const fill = isTask(node.type) ? lightBlue[50] :
               isSwitch(node.type) ? amber[100] : yellow[100];
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
      onMouseEnter: this.onMouseEnterBaseRect,
      onMouseLeave: this.onMouseLeaveBaseRect,
    };

    const labelProps = {
      text: Util.isEmpty(node.label)
        ? isTask(node.type) ? phrase.empty.task : isSwitch(node.type) ? phrase.empty.switch : phrase.empty.case
        : node.label,
      fontSize: ks.fontSize * ks.unit,
      x: (ks.rect.h + ks.fontSize / 2) * ks.unit,
      y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit,
      onMouseEnter: this.onMouseEnterText,
      onMouseLeave: this.onMouseLeaveText,
    };

    const typeProps: IconProps = {
      ks,
      x: 0, y: 0,
      svg: isTask(node.type) ? task : isSwitch(node.type) ? switchSvg : check,
      scale: isSwitch(node.type) ? {x: 1, y: -1} : undefined,
    };

    // onTouchStart?(evt: Konva.KonvaEventObject<TouchEvent>): void;
    // onTouchMove?(evt: Konva.KonvaEventObject<TouchEvent>): void;
    // onTouchEnd?(evt: Konva.KonvaEventObject<TouchEvent>): void;

    const rectGroupProps = {
      x: 0, y:0,
      ref: this.draggableRef,
      onClick: this.handleFocus,
      onTap: this.handleFocus,
      draggable: true,
      onDragStart: this.handleDragStart,
      onTouchStart: this.handleDragStart,
      onDragMove: this.handleDragMove,
      onTouchMove: this.handleDragMove,
      onDragEnd: this.handleDragEnd,
      onTouchEnd: this.handleDragEnd,
    };

    const baseEl = this.baseRef.current;
    const draggableEl = this.draggableRef.current;
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

    const containerRectProps = {
      x: (ks.indent / 2 - ks.spr.w) * ks.unit,
      y: ks.spr.h * ks.unit,
      width: (node.self.w - (ks.indent / 2 - ks.spr.w)) * ks.unit,
      height: (node.self.h - ks.spr.h) * ks.unit,
      onClick: this.handleDeleteFocus,
      onTap: this.handleDeleteFocus,
      cornerRadius: ks.cornerRadius * ks.unit,
      stroke: grey[500],
      fill: node.depth.top === 0 ? theme.palette.background.paper : '#00000009',
      strokeWidth: ks.hasArrow ? 0 : 1,
    };

    const arrowBaseProps = {
      stroke: grey[700],
      fill: grey[700],
      pointerLength: ks.pointerLength * ks.unit,
      pointerWidth: ks.pointerWidth * ks.unit,
    }
    const endIconProps: IconProps = {
      ks,
      x: -ks.rect.h * ks.unit, y: 0,
      svg: flag,
      color: theme.palette.secondary.main,
    };

    const expandProps: IconWithBadgeProps = {
      ks,
      x: (ks.rect.w - ks.rect.h) * ks.unit, y: 0,
      svg: node.open ? less : more,
      badgeContent: node.children.length,
      onClick: this.handleExpand,
      onMouseEnter: this.onMouseEnterExpand,
      onMouseLeave: this.onMouseLeaveExpand,
    };

    return (
      <Group ref={this.baseRef} x={x} y={y} >
        <Group {...rectGroupProps}>
          
          {node.open && <Rect {...containerRectProps}/>}
          <Rect {...baseRectProps}/>
          <Icon {...typeProps}/>
          {!(node.focus && labelFocus) &&  <Text {...labelProps}/>}
          <IconWithBadge {...expandProps}/>
          {ks.hasArrow && node.arrows.map((a, i) => {
            const points = a.map(point => [point.x, point.y]).reduce((before, next) => before.concat(next)).map(p => p * ks.unit);
            return <Arrow key={`${node.id}-arrow-${i}`} {...arrowBaseProps} points={points}/>;
          })}
          {node.arrows.length === 0 && node.depth.top !== 0 && <Icon {...endIconProps}/>}
        </Group>
      </Group>
    );
  }
}

export default KNode;