import KSize from '../data-types/k-size';
import TextEditSettings from '../data-types/text-edit-settings';

export const toolbarHeight = 64;
export const toolbarMinHeight = 56;

export const drawerWidth = 260;
export const rightPainWidth = 300;
export { default as Task } from '@material-ui/icons/Assignment';
export { default as Switch } from '@material-ui/icons/CallSplit';
export { default as Case } from '@material-ui/icons/Check';
export { default as Input } from '@material-ui/icons/GetApp';
export { default as Output } from '@material-ui/icons/Publish';
export { default as PreConditions } from '@material-ui/icons/AssignmentLate';
export { default as PostConditions } from '@material-ui/icons/AssignmentTurnedIn';
export { default as WorkerInCharge } from '@material-ui/icons/People';
export { default as Remarks } from '@material-ui/icons/InfoOutlined';
export { default as NecessaryTools } from '@material-ui/icons/Build';
export { default as Exceptions } from '@material-ui/icons/Error';
export { default as Image } from '@material-ui/icons/Photo';
export { default as Delete } from '@material-ui/icons/Delete';
export { default as Close } from '@material-ui/icons/Close';
export { default as More } from '@material-ui/icons/ExpandMore';
export { default as Less } from '@material-ui/icons/ExpandLess';
export { default as Divergent } from '@material-ui/icons/BlurOn';    // divergent  thinking（発散思考）、
export { default as Convergent } from '@material-ui/icons/ClearAll'; // convergent thinking（収束思考）



export const defaultKS: KSize = {
  unit: 16,
  rect: {w: 24, h: 3},
  margin: {w: 1, h: 2},
  spr: {w: 1, h: 1},
  indent: 4,
  fontSize: 0.9,
  fontHeight: 0.75,
  textline: 1,
  icon: 1,
  badgeFontSize: 0.7,
  badgeFontHeight: 0.6,
  cornerRadius: 0.5,
  hasArrow: true,
  pointerSpace: 0.2,
  pointerLength: 0.4,
  pointerWidth: 0.4
};

export const tes: TextEditSettings = {
  showAll: true,
};