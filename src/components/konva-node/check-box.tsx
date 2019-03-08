import * as React from 'react';

import { Group, Rect } from 'react-konva';
import { viewItem } from '../../settings/layout';
import { SvgPath } from '../../data-types/svg-path';
import SvgToPath from './svg-to-path';
import Icon, { IconProps } from './icon';
import checkedIcon from '../../resource/svg-icon/checked';
import checkBlank from '../../resource/svg-icon/check-blank';

interface Props {
  x: number;
  y: number;
  checked: boolean;
  color?: string;
  backgroundColor?: string;
}

const CheckBox: React.FC<Props> = (props: Props) => {
  const {x, y, checked, color, backgroundColor} = props;
  const iconButtonProps: IconProps = {
    x, y,
    svg: checked ? checkedIcon : checkBlank,
    color,
    backgroundColor
  };

  return <Icon {...iconButtonProps}/>;
};

export default CheckBox;