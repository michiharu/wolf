import * as React from 'react';

import Icon, { IconProps } from './icon';
import checkedIcon from '../../resource/svg-icon/check-box/checked';
import checkBlank from '../../resource/svg-icon/check-box/check-blank';

export interface CheckBoxProps {
  x: number;
  y: number;
  checked: boolean;
  color?: string;
  backgroundColor?: string;
  onClick?: (e: any) => void;
}

const CheckBox: React.FC<CheckBoxProps> = (props: CheckBoxProps) => {
  const {x, y, checked, color, backgroundColor, onClick} = props;
  const iconButtonProps: IconProps = {
    x, y,
    svg: checked ? checkedIcon : checkBlank,
    color,
    backgroundColor,
    onClick
  };

  return <Icon {...iconButtonProps}/>;
};

export default CheckBox;