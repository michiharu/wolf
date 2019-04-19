import * as React from 'react';

import { Group, Rect } from 'react-konva';
import { SvgPath } from '../../data-types/svg-path';
import SvgToPath from './svg-to-path';
import KSize from '../../data-types/k-size';
import { PropTypes } from '@material-ui/core';
import ColorUtil from '../../func/color';
import { theme } from '../..';

export interface KFABProps extends Partial<DefaultProps> {
  ks: KSize;
  x: number;
  y: number;
  svg: SvgPath[];
  onClick: (e: any) => void;
}

interface DefaultProps {
  color: PropTypes.Color;
  rotate: number;
  size?: 'small' | 'medium' | 'large'; 
}

interface State {
  hover: boolean;
  on: boolean;
}

class KFAB extends React.Component<KFABProps, State> {

  public static defaultProps: Partial<DefaultProps> = {
    color: "primary",
    rotate: 0,
    size: 'medium',
  };

  constructor(props: KFABProps) {
    super(props);
    this.state = {hover: false, on: false};
  }

  render() {
    const {ks, x, y, svg, color, rotate, size, onClick} = this.props;
    const { hover, on } = this.state;

    const colorString = ColorUtil.getBase(theme, color!, on);

    const scale = size === 'medium' ? 1 : 0.8;

    const baseRectProps = {
      x: ks.rect.h * (1 - scale) / 2 * ks.unit, y: ks.rect.h * (1 - scale) / 2 * ks.unit,
      width: ks.rect.h * ks.unit,
      height: ks.rect.h * ks.unit,
      scale: {x: scale, y: scale},
      fill: colorString,
      cornerRadius: ks.rect.h / 2 * ks.unit,
      shadowColor: 'black',
      shadowBlur: hover ? 10 : 6,
      shadowOffset: { x: 0, y: 3},
      shadowOpacity: hover ? 0.3 : 0.2,
    };
    const textColorString = theme.palette.getContrastText(colorString);
    const transRate = ks.unit / 20; // 20はsvgアイコンのサイズ

    const svgProps = {
      x: (ks.rect.h - ks.icon * scale) / 2 * ks.unit,
      y: (ks.rect.h - ks.icon * scale) / 2 * ks.unit,
      svg,
      fill: textColorString,
      rotate: rotate || 0,
      scale: {x: transRate, y: transRate}
    };

    const groupProps = {
      x, y,
      onClick,

      onMouseEnter: () => this.setState({hover: true}),

      onMouseDown: () => this.setState({on: true}),
      onTouchStart: () => this.setState({on: true}),
      
      onMouseUp: () => this.setState({on: false}),
      onTouchEnd: () => this.setState({on: false}),

      onMouseLeave: () => this.setState({hover: false, on: false}),
      onTouchMove: (e: any) => {
        const tr = e.target.getClientRect();
        if (tr.x < 0 || baseRectProps.width < tr.x || tr.y < 0 || baseRectProps.height < tr.y) {
          this.setState({on: false});
        }
      },
    }

    return (
      <Group {...groupProps}>
        <Rect {...baseRectProps}/>
        <SvgToPath {...svgProps}/>
      </Group>
    );
  }
}

export default KFAB;