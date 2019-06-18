import * as React from 'react';
import { lightBlue, amber, yellow, grey } from '@material-ui/core/colors';
import Konva from 'konva';
import { Rect, Group, Text, Arrow } from 'react-konva';
import { task, switchSvg, flag } from '../../resource/svg-icon';

import { KWithArrow, isSwitch, isTask } from '../../data-types/tree';

import { theme } from '../..';
import Util from '../../func/util';
import { phrase } from '../../settings/phrase';
import IconWithBadge, { IconWithBadgeProps } from './icon-with-badge';
import KSize from '../../data-types/k-size';
import check from '../../resource/svg-icon/check';
import Icon, { IconProps } from './icon';
import more from '../../resource/svg-icon/expand/more';
import less from '../../resource/svg-icon/expand/less';

export interface KNodeProps {
  node: KWithArrow;
  labelFocus: boolean;
  ks: KSize;
}

class KShadow extends React.Component<KNodeProps> {
  
  groupRef = React.createRef<any>();

  componentWillUnmount() {
    this.groupRef.current!.destroy();
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
    };

    const labelProps = {
      text: Util.isEmpty(node.label)
        ? isTask(node.type) ? phrase.empty.task : isSwitch(node.type) ? phrase.empty.switch : phrase.empty.case
        : node.label,
      fontSize: ks.fontSize * ks.unit,
      x: (ks.rect.h + ks.fontSize / 2) * ks.unit,
      y: (ks.rect.h - ks.fontHeight) / 2 * ks.unit
    };

    const typeProps: IconProps = {
      ks,
      x: 0, y: 0,
      svg: isTask(node.type) ? task : isSwitch(node.type) ? switchSvg : check,
      scale: isSwitch(node.type) ? undefined : {x: 1, y: -1},
    };

    const dragEl = this.groupRef.current;
    // dragElが要素の参照を持っていてもなぜか座標を持っていない場合があるため x の値をチェック
    const willAnimation = dragEl !== null && dragEl.x() !== 0;

    if (willAnimation) {
      dragEl.to({
        x: node.point.x * ks.unit,
        y: node.point.y * ks.unit,
        easing: Konva.Easings.EaseInOut
      });
    }

    const rectGroupProps = {
      x: !willAnimation ? node.point.x * ks.unit : undefined,
      y: !willAnimation ? node.point.y * ks.unit : undefined,
    };

    const containerRectProps = {
      x: (ks.indent / 2 - ks.spr.w) * ks.unit,
      y: ks.spr.h * ks.unit,
      width: (node.self.w - (ks.indent / 2 - ks.spr.w)) * ks.unit,
      height: (node.self.h - ks.spr.h) * ks.unit,
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
    };

    return (
      <Group ref={this.groupRef} {...rectGroupProps}>
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
    );
  }
}

export default KShadow;