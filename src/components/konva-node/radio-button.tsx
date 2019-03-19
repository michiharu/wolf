import * as React from 'react';

import Icon, { IconProps } from './icon';
import radioChecked from '../../resource/svg-icon/radio-button-checked';
import radioUnchecked from '../../resource/svg-icon/radio-button-unchecked';

export interface CheckBoxProps {
  x: number;
  y: number;
  checked: boolean;
  color?: string;
  backgroundColor?: string;
  onClick?: (e: any) => void;
}

const RadioButton: React.FC<CheckBoxProps> = (props: CheckBoxProps) => {
  const {x, y, checked, color, backgroundColor, onClick} = props;
  const iconButtonProps: IconProps = {
    x, y,
    svg: checked ? radioChecked : radioUnchecked,
    color,
    backgroundColor,
    onClick
  };

  return <Icon {...iconButtonProps}/>;
};

export default RadioButton;