import * as React from 'react';

import Icon, { IconProps } from './icon';
import radioChecked from '../../resource/svg-icon/radio-button/radio-button-checked';
import radioUnchecked from '../../resource/svg-icon/radio-button/radio-button-unchecked';
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

const RadioButton: React.FC<CheckBoxProps> = (props: CheckBoxProps) => {
  const {ks, x, y, checked, color, backgroundColor, onClick} = props;
  const iconButtonProps: IconProps = {
    ks, x, y,
    svg: checked ? radioChecked : radioUnchecked,
    color,
    backgroundColor,
    onClick
  };

  return <Icon {...iconButtonProps}/>;
};

export default RadioButton;