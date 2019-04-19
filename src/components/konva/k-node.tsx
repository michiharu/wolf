import * as React from 'react';
import { lightBlue, amber, yellow } from '@material-ui/core/colors';
import Konva from 'konva';
import { Rect, Group, Text, Arrow } from 'react-konva';
import { task, switchSvg, flag } from '../../resource/svg-icon';

import { KWithArrow, KTreeNode, Point } from '../../data-types/tree-node';

import { sp, FlowType } from '../../pages/editor/node-editor/node-editor';
import IconInRect, { IconInRectProps } from './icon-in-rect';
import { theme } from '../..';
import Util from '../../func/util';
import { phrase } from '../../settings/phrase';
import { add } from '../../resource/svg-icon/add';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import KSize from '../../data-types/k-size';
import check from '../../resource/svg-icon/check';
import Icon, { IconProps } from './icon';

export interface KNodeProps {
  node: KWithArrow;
  isRoot: boolean;
  ks: KSize;
  ft: FlowType;
  click: (node: KWithArrow) => void;
  dragStart: (node: KTreeNode) => void;
  dragMove: (node: KTreeNode, point: Point) => void;
  dragEnd: () => void;
  addNextBrother: () => void;
  deleteFocus: () => void;
}

class KNode extends React.Component<KNodeProps> {
  
  baseRef = React.createRef<any>();
  draggableRef = React.createRef<any>();

  constructor(props: KNodeProps) {
    super(props);
  }

  componentDidMount() {
    process.nextTick(() => this.setState({}));
  }

  handleClick = (e: any) => {
    e.cancelBubble = true;
    const {node, click} = this.props;
    click(node);
  }

  handleDragStart = (e: any) => {
    const {node, dragStart} = this.props;
    dragStart(node);
  }

  handleDragMove = (e: any) => {
    const {node, ks, dragMove} = this.props;
    const tr = e.target.getClientRect();
    const point = {
      x: Math.round((tr.x - sp.x) / ks.unit + ks.rect.w / 2),
      y: Math.round((tr.y - sp.y) / ks.unit + ks.rect.h / 2),
    };
    dragMove(node, point);
  }

  handleDragEnd = (e: any) => {
    const {dragEnd} = this.props;
    e.target.to({ x: 0, y: 0, easing: Konva.Easings.EaseInOut });
    dragEnd();
  }

  handleDeleteFocus = (e: any) => {
    e.cancelBubble = true;
    this.props.deleteFocus();
  }
  
  render() {
    const { isRoot, node, ks, ft, addNextBrother } = this.props;
    const fill = node.type === 'task' ?   node.focus ? lightBlue[100] : lightBlue[50] :
               node.type === 'switch' ? node.focus ? amber[200] : amber[100] :
                                        node.focus ? yellow[200] : yellow[100];
    const baseRectProps = {
      x: 0, y: 0,
      width: node.rect.w * ks.unit,
      height: node.rect.h * ks.unit,
      cornerRadius: 4,
      fill,
      shadowColor: 'black',
      shadowBlur: node.focus ? 10 : 6,
      shadowOffset: { x: 0, y: 3},
      shadowOpacity: 0.2,
    };

    const labelProps = {
      text: Util.isEmpty(node.label)
        ? node.type === 'task' ? phrase.empty.task : node.type === 'switch' ? phrase.empty.switch : phrase.empty.case
        : node.label,
      fontSize: ks.fontSize * ks.unit,
      x: (ks.rect.h + ks.fontSize / 2) * ks.unit,
      y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit
    };

    const iconProps: IconProps = {
      ks,
      x: 0, y: 0,
      svg: node.type === 'task' ? task : node.type === 'switch' ? switchSvg : check,
      backgroundColor: node.focus ? '#0006' : undefined,
      scale: node.type !== 'switch' ? undefined : {x: 1, y: -1},
    };

    const rectGroupProps = {
      x: 0, y:0,
      ref: this.draggableRef,
      onTap: this.handleClick,
      onClick: this.handleClick,
      draggable: true,
      onDragStart: this.handleDragStart,
      onDragMove: this.handleDragMove,
      onDragEnd: this.handleDragEnd,
    };

    const baseEl = this.baseRef.current;
    const dragEl = this.draggableRef.current;
    const willAnimation = dragEl !== null && !dragEl.isDragging();

    if (willAnimation) {
      baseEl!.to({
        x: sp.x + node.point.x * ks.unit,
        y: sp.y + node.point.y * ks.unit,
        easing: Konva.Easings.EaseInOut
      });
    }

    const x = !willAnimation ? sp.x + node.point.x * ks.unit : undefined;
    const y = !willAnimation ? sp.y + node.point.y * ks.unit : undefined;

    const containerRectProps = {
      x: (ks.indent / 2 - ks.spr.w) * ks.unit,
      y: ks.spr.h * ks.unit,
      width: (node.self.w - (ks.indent / 2 - ks.spr.w)) * ks.unit,
      height: (node.self.h - ks.spr.h) * ks.unit,
      onClick: this.handleDeleteFocus,
      cornerRadius: ks.cornerRadius * ks.unit,
      stroke: (ft === 'rect' || node.focus) ? '#dddd' : '#0000',
      strokeWidth: 2,
    };

    const arrowBaseProps = {
      stroke: '#999',
      fill: '#999',
      pointerLength: ks.pointerLength * ks.unit,
      pointerWidth: ks.pointerWidth * ks.unit,
    }
    const endIconProps: IconInRectProps = {
      ks,
      x: ks.spr.w * ks.unit, y: 0,
      svg: flag,
      color: theme.palette.secondary.main,
    };

    return (
      <Group ref={this.baseRef} x={x} y={y} >
        <Group {...rectGroupProps}>
          {node.arrows.length === 0 && node.point.x !== 0 && <IconInRect {...endIconProps}/>}
          {node.open && <Rect {...containerRectProps}/>}
          <Rect {...baseRectProps}/>
          <Icon {...iconProps}/>
          {!node.focus && <Text {...labelProps}/>}
          {ft === 'arrow' && node.arrows.map((a, i) => {
            const points = a.map(point => [point.x, point.y]).reduce((before, next) => before.concat(next)).map(p => p * ks.unit);
            return <Arrow key={`${node.id}-arrow-${i}`} {...arrowBaseProps} points={points}/>;
          })}
        </Group>
      </Group>
    );
  }
}

export default KNode;