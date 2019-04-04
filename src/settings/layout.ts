import KSize from '../data-types/k-size';

export const toolbarHeight = 64;
export const toolbarMinHeight = 56;

export const drawerWidth = 260;
export const rightPainWidth = 300;
export { default as Task } from '@material-ui/icons/Assignment';
export { default as Switch } from '@material-ui/icons/CallSplit';
export { default as Case } from '@material-ui/icons/Check';
export { default as Input } from '@material-ui/icons/GetApp';
export { default as Output } from '@material-ui/icons/Publish';

export const ks: KSize = {
  unit: 16,
  rect: {w: 24, h: 2},
  margin: {w: 1, h: 1},
  spr: {w: 1, h: 1},
  indent: 2,
  fontSize: 0.9,
  fontHeight: 0.75,
  textline: 1,
  icon: 1.25,
  badgeFontSize: 0.7,
  badgeFontHeight: 0.6,
  cornerRadius: 0.5,
};