import * as React from 'react';

import Icon, { IconProps } from './icon';
import checkedIcon from '../../resource/svg-icon/check-box/checked';
import checkBlank from '../../resource/svg-icon/check-box/check-blank';
import KSize from '../../data-types/k-size';

export interface CheckBoxProps {
  ks: KSize;
  x: number;
  y: number;
  checked: boolean;
  color?: string;
  backgroundColor?: string;
  onClick?: (e: any) => void;
}

const CheckBox: React.FC<CheckBoxProps> = (props: CheckBoxProps) => {
  const {ks, x, y, checked, color, backgroundColor, onClick} = props;
  const iconButtonProps: IconProps = {
    ks, x, y,
    svg: checked ? checkedIcon : checkBlank,
    color,
    backgroundColor,
    onClick
  };

  return <Icon {...iconButtonProps}/>;
};

export default CheckBox;