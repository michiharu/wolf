import _ from 'lodash';
import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, IconButton, Modal, Paper,
} from '@material-ui/core';

import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, KTreeNode, Cell, Point, Tree, baseKTreeNode, baseKWithArrow } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, ks as defaultKS, rightPainWidth } from '../../../settings/layout';

import KTreeUtil from '../../../func/k-tree-util';
import KRectNode from '../../../components/konva-node/k-rect-node';
import RightPane, { RightPaneProps } from './right-pane';
import TreeUtil from '../../../func/tree';
import KSize from '../../../data-types/k-size';
import keys from '../../../settings/storage-keys';
import ViewSettings from './view-settings';
import KArrowNode from '../../../components/konva-node/k-arrow-node';
import KArrowUtil from '../../../func/k-arrow-util';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  toolbar: theme.mixins.toolbar,
  stageContainer: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
  rightPaneContainer: {
    position: 'fixed',
    overflow: 'scroll',
    width: '40vw',
    minWidth: rightPainWidth,
    right: 8,

    top: toolbarHeight + theme.spacing.unit * 2,
    maxHeight: `calc(100vh - ${toolbarHeight + theme.spacing.unit * 4}px)`,
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight + theme.spacing.unit * 2,
      maxHeight: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
  saveButton: {
    minWidth: 100,
  },
  extendedIcon: {
    marginLeft: theme.spacing.unit,
  },
  viewSettingButton: {
    position: 'fixed',
    top: toolbarHeight + theme.spacing.unit * 2,
    right: `calc(40vw + ${theme.spacing.unit * 2}px)`,
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight + theme.spacing.unit * 2,
    },
  },
  viewSettingModal: {
    backgroundColor: '#0002',
  },
  viewSettingPaper: {
    position: 'absolute',
    top: '75vh',
    left: '50vw',
    width: '90vw',
    maxHeight: '45vh',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing.unit * 2,
    outline: 'none',
  },
});

export interface NodeEditorProps {
  selected: boolean;
  parent: Tree | null;
  commonNodes: Tree[];
  tree: TreeNode;
  isCommon: string;
  edit: (node: TreeNode) => void;
  changeIsCommon: (e: any) => void;
  addCommonList: (node: Tree) => void;
  deleteCommonList: (node: Tree) => void;
  addNode: (node: Tree) => void;
}

interface Props extends NodeEditorProps, WithStyles<typeof styles> {}

interface State {
  ks: KSize;
  ft: FlowType;
  beforeCell: Cell | null;
  dragParent: TreeNode | null;
  focusNode: TreeNode | null;
  hasDifference: boolean;
  showViewSettings: boolean;
}

export type FlowType = 'rect' | 'arrow';
export const flowType = {rect: 'rect', arrow: 'arrow'};
export const sp = {x: 16, y: 16};

class NodeEditor extends React.Component<Props, State> {

  stageContainerRef = React.createRef<HTMLMainElement>();
  stageRef = React.createRef<any>();

  node: KTreeNode;
  map: Cell[][] | null = null; 

  constructor(props: Props) {
    super(props);
    
    const state = NodeEditor.getInitialState();
    this.state = state;
    this.node = KTreeUtil.get(props.tree, baseKTreeNode, state.ks);
  }

  static getInitialState = (): State => {
    const ksFromStorage = localStorage.getItem(keys.ks);
    const ks = ksFromStorage !== null ? JSON.parse(ksFromStorage) as KSize : defaultKS;
    const ftFromStorage = localStorage.getItem(keys.ft);
    const ft = ftFromStorage !== null ? JSON.parse(ftFromStorage) as FlowType : 'arrow';
    return {
      ks,
      ft,
      beforeCell: null,
      dragParent: null,
      focusNode: null,
      hasDifference: false,
      showViewSettings: false,
    };
  }
  
  componentDidMount() {
    process.nextTick(this.resize);
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const {ks} = this.state;
    const cref = this.stageContainerRef.current, sref = this.stageRef.current;
    if (cref === null || sref === null) { throw 'Cannot find elements.'; }
    sref.width(Math.max((this.node.self.w + ks.spr.w) * ks.unit + sp.x, cref.offsetWidth));
    sref.height(Math.max((this.node.self.h + ks.spr.h) * ks.unit + sp.y, cref.offsetHeight));
    sref.draw();
  }

  setFocusState = (target: KTreeNode, focus: boolean) => {
    const { edit } = this.props;
    const {ks} = this.state;
    const newNode = TreeUtil._focus(this.node, target.id);
    edit(newNode);
    const focusNode: KTreeNode = {...target, focus};
    this.setState({focusNode});
  }

  setOpenState = (target: KTreeNode, open: boolean) => {
    const { edit } = this.props;
    edit(TreeUtil._open(this.node, target.id, open));
    const focusNode: KTreeNode = {...target, open};
    this.setState({focusNode});
    process.nextTick(() => this.resize());
  }

  click = (target: KTreeNode) => {
    // before: {focus: false, open: false}
    // after:  {focus: true,  open: false}
    // action => focus: true
    if (!target.focus && !target.open) { this.setFocusState(target, true); }

    // before: {focus: true, open: false}
    // after:  {focus: true, open: true}
    // action => open: true
    if (target.focus && !target.open)  { this.setOpenState(target, true); }

    // before: {focus: false, open: true}
    // after:  {focus: true,  open: true}
    // action => focus: true
    if (!target.focus && target.open)  { this.setFocusState(target, true); }

    // before: {focus: true, open: true}
    // after:  {focus: true, open: false}
    // action => open: false
    if (target.focus && target.open)   { this.setOpenState(target, false); }
  }

  deleteFocus = () => {
    const { edit } = this.props;
    edit(TreeUtil._deleteFocus(this.node));
    this.setState({focusNode: null});
  }

  dragStart = (target: KTreeNode) => {
    const { edit } = this.props;
    const dragParent = KTreeUtil._getPrent(this.node, target);
    const openNode = TreeUtil._open(this.node, target.id, false);
    edit(TreeUtil._deleteFocus(openNode));
    this.setState({dragParent, focusNode: null});
    
  }

  dragMove = (target: KTreeNode, p: Point) => {
    const { edit } = this.props;
    const {dragParent, beforeCell} = this.state;
    const map = this.map;

    if (map !== null && 0 <= p.x && p.x < map.length) {
      const cell = map[p.x][p.y];
      if (cell === undefined || cell.node.id === target.id) { return; }
      if (beforeCell === null || !KTreeUtil.isEqualCell(beforeCell, cell)) {
        this.setState({beforeCell: cell});
        
        if (target.type === 'case') {
          if (cell.action === 'move' && dragParent!.children.find(c => c.id === cell.node.id) !== undefined) {
            edit(TreeUtil.move(this.node, target, cell.node));
            process.nextTick(() => this.resize());
          }
          if (cell.action === 'push' && dragParent!.id === cell.node.id) {
            edit(TreeUtil.push(this.node, target, cell.node));
            process.nextTick(() => this.resize());
          }
          return;
        }

        if (cell.action === 'move' && cell.node.type !== 'case') {
          edit(TreeUtil.move(this.node, target, cell.node));
          process.nextTick(() => this.resize());
        }

        if (cell.action === 'push' && cell.node.type !== 'switch') {
          edit(TreeUtil.push(this.node, target, cell.node));
          process.nextTick(() => this.resize());
        }
      }
    }
  }

  dragEnd = () => {
    this.setState({dragParent: null});
  }

  changeFocusNode = (target: TreeNode) => {
    const { edit } = this.props;
    edit(TreeUtil._replace(this.node, target));
    this.setState({focusNode: target});
  }

  addDetails = () => {
    const { edit } = this.props;
    const {focusNode} = this.state;
    edit(TreeUtil.addDetails(this.node, focusNode!));
    process.nextTick(() => this.resize());
  }

  addFromCommon = (e: any) => {
    const { edit, commonNodes } = this.props;
    const common = commonNodes.find(c => c.id === e.target.value);
    if (common === undefined) { return; }
    
    const setIdCommon = TreeUtil._setId(common);
    const {focusNode} = this.state;
    edit(TreeUtil.addFromCommon(this.node, focusNode!, setIdCommon));
    process.nextTick(() => this.resize());
  }

  registAsCommon = (target: TreeNode) => {
    const { addNode, addCommonList } = this.props;
    const newNode = TreeUtil._setId(target);
    addNode(newNode);
    addCommonList(newNode);
  }

  deleteSelf = () => {
    const { edit } = this.props;
    const {focusNode} = this.state;
    edit(TreeUtil._deleteById(this.node, focusNode!.id));
    this.setState({focusNode: null});
    process.nextTick(() => this.resize());
  }

  changeKS = (ks: KSize) => {
    this.setState({ks});
    localStorage.setItem(keys.ks, JSON.stringify(ks));
    process.nextTick(() => this.resize());
  }

  changeFT = (ft: FlowType) => {
    this.setState({ft});
    localStorage.setItem(keys.ft, JSON.stringify(ft));
    process.nextTick(() => this.resize());
  }

  render() {
    const { selected, parent, tree, isCommon, commonNodes, changeIsCommon, classes } = this.props;
    const {
      ks, ft, focusNode, showViewSettings
    } = this.state;

    const node  = KTreeUtil.get(tree, baseKTreeNode, ks);
    this.node = node;
    const flatNodes = KTreeUtil.toFlat(node);
    const map = KTreeUtil.makeMap(flatNodes, ks);
    this.map = map;

    const nodeActionProps = {
      ks,
      click: this.click,
      dragStart: this.dragStart,
      dragMove: this.dragMove,
      dragEnd: this.dragEnd,
      deleteFocus: this.deleteFocus
    };

    const rightPaneProps: RightPaneProps = {
      node: focusNode,
      commonNodes,
      isRoot: focusNode === null ? false : parent === null && focusNode.id === node.id,
      isCommon,
      changeIsCommon,
      changeNode: this.changeFocusNode,
      addDetails: this.addDetails,
      addFromCommon: this.addFromCommon,
      registAsCommon: this.registAsCommon,
      deleteSelf: this.deleteSelf,
    };

    return (
      <div className={classes.root}>
        <main className={classes.stageContainer} ref={this.stageContainerRef}>
          <Stage ref={this.stageRef} onClick={this.deleteFocus}>
            <Layer>
              {/* {map !== null && map.map((___, x) => (
              <Group key={`group-${x}`} x={sp.x} y={sp.y}>
                {___.map((__, y) => {
                const cell = map[x][y];
                if (cell === undefined) { return <Rect key={`${x}-${y}`}/>; }
                const fill = cell.action === 'push' ? ('#ccff' + _.padStart(String(cell.node.depth.top * 16), 2, '0')) :
                            cell.action === 'move' ? 'blue'   : 'grey';
                return (
                  <Rect key={`${x}-${y}`} x={x * ks.unit} y={y * ks.unit + 300} width={ks.unit} height={ks.unit}
                        fill={fill} stroke="#000" strokeWidth={1}/>);
                })}
              </Group>))} */}
              {ft === 'arrow' &&
              KTreeUtil.toFlat(KArrowUtil.get(node, baseKWithArrow, ks))
              .map(n => <KArrowNode key={n.id} node={n} {...nodeActionProps}/>)}
              {ft === 'rect' && flatNodes.map(n => <KRectNode key={n.id} node={n} {...nodeActionProps}/>)}
            </Layer>
          </Stage>
          {selected &&
          <>
            <IconButton className={classes.viewSettingButton} onClick={() => this.setState({showViewSettings: true})}>
              <ViewSettingsIcon/>
            </IconButton>
            <Paper className={classes.rightPaneContainer}>
              <RightPane {...rightPaneProps}/>
            </Paper>
          </>}
          
          <Modal
            open={showViewSettings}
            onClose={() => this.setState({showViewSettings: false})}
            BackdropProps={{className: classes.viewSettingModal}}
            disableAutoFocus
          >
            <ViewSettings ks={ks} ft={ft} changeKS={this.changeKS} changeFT={this.changeFT}/>
          </Modal>

        </main>
      </div>
    );
  }
}

export default withStyles(styles)(NodeEditor);