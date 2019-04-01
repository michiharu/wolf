import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Fab, Snackbar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import Download from '@material-ui/icons/SaveAlt';
import CloseIcon from '@material-ui/icons/Close';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, EditableNode, Cell, Point } from '../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, viewItem, unit } from '../../settings/layout';

import ToolContainer from '../../components/tool-container/tool-container';
import EditableNodeUtil from '../../func/editable-node-util';
import EditableKNode from '../../components/konva-node/editable-k-node';
import RightPane, { RightPaneProps } from './right-pane';
import { fileDownload } from '../../func/file-download';
import TreeUtil from '../../func/tree';
import EditableNodeViewUtil from '../../func/editable-node-view-util';
import { common } from '@material-ui/core/colors';

const styles = (theme: Theme) => createStyles({
  root: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
  saveButton: {
    minWidth: 100,
  },
  extendedIcon: {
    marginLeft: theme.spacing.unit,
  },
  close: {
    padding: theme.spacing.unit * 0.5,
  },
});

export interface EditorProps {
  toolRef: HTMLDivElement;
  rightPaneRef: HTMLDivElement;
  parent: TreeNode | null;
  commonNodes: TreeNode[];
  node: TreeNode;
  back: () => void;
  changeNode: (node: TreeNode) => void;
  addCommonList: (node: TreeNode) => void;
  deleteCommonList: (node: TreeNode) => void;
  addNode: (node: TreeNode) => void;
}

interface Props extends EditorProps, WithStyles<typeof styles> {}

interface State {
  isCommon: string;
  node: EditableNode;
  map: Cell[][] | null;
  beforeCell: Cell | null;
  dragParent: EditableNode | null;
  focusNode: EditableNode | null;
  hasDifference: boolean;
  cannotSaveReason: CannotSaveReason;
  saved: boolean;
}

type CannotSaveReason = 'switch' | 'case' | null;

const point = { x: viewItem.spr.w * 2, y: viewItem.spr.h * 5};

class NodeEditor extends React.Component<Props, State> {

  stageContainerRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();

  constructor(props: Props) {
    super(props);
    const { parent, commonNodes, node } = props;

    this.state = NodeEditor.getInitialState(commonNodes, point, parent, node);
  }

  static getInitialState = (commonList: TreeNode[], point: Point, parent: TreeNode | null, node: TreeNode): State => {
    const parentType: Type = parent !== null ? parent.type : 'task';
    const newNode = EditableNodeUtil.get(point, parentType, node);
    return {
      isCommon: commonList.find(c => c.id === node.id) !== undefined ? 'true' : 'false',
      node: newNode,
      map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(newNode)),
      beforeCell: null,
      dragParent: null,
      focusNode: null,
      hasDifference: false,
      cannotSaveReason: null,
      saved: false,
    };
  }
  
  componentDidMount() {
    process.nextTick(this.resize);
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (prevState.node.id !== nextProps.node.id) {
      const { parent, commonNodes, node } = nextProps;
      return NodeEditor.getInitialState(commonNodes, point, parent, node);
    }
    return null;
  }

  resize = () => {
    const {node} = this.state;
    const cref = this.stageContainerRef.current, sref = this.stageRef.current;
    if (cref === null || sref === null) { throw 'Cannot find elements.'; }
    sref.width(Math.max((point.x + node.self.w + viewItem.spr.w) * unit, cref.offsetWidth));
    sref.height(Math.max((point.y + node.self.h + viewItem.spr.h) * unit, cref.offsetHeight));
    sref.draw();
  }

  differenceCheck = () => {
    if (EditableNodeUtil._hasDifference(this.props.node, this.state.node)) {
      this.setState({hasDifference: true});
    } else {
      this.props.back();
    }
  }

  save = () => {
    const { parent, commonNodes, changeNode, addCommonList, deleteCommonList } = this.props;
    const {isCommon, node} = this.state;
    const isAllSwitchHasCase = EditableNodeUtil._isAllSwitchHasCase(node);
    const isAllCaseHasItem = EditableNodeUtil._isAllCaseHasItem(node);
    const cannotSaveReason: CannotSaveReason = !isAllSwitchHasCase ? 'switch' :
                                               !isAllCaseHasItem   ? 'case'   : null;
    if (cannotSaveReason === null) {
      changeNode(node);
      if (parent === null) {
        if (isCommon === 'true' && commonNodes.find(c => c.id === node.id) === undefined) {
          addCommonList(node);
        }
        if (isCommon === 'false' && commonNodes.find(c => c.id === node.id) !== undefined) {
          deleteCommonList(node);
        }
      }
      this.setState({saved: true});
    } else {
      this.setState({cannotSaveReason});
    }
  }

  download = () => {
    const {node} = this.props;
    const filename = `${node.label}.json`;
    const nodeWithoutId = TreeUtil._removeId(node);
    fileDownload(JSON.stringify(nodeWithoutId), filename);
  }

  setFocusState = (target: EditableNode, focus: boolean) => {
    const {node: prevNode} = this.state;
    const node = EditableNodeUtil.focus(prevNode, target.id);
    const focusNode: EditableNode = {...target, focus};
    this.setState({node, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode});
  }

  setOpenState = (target: EditableNode, open: boolean) => {
    const {node: prevNode} = this.state;
    const node = EditableNodeUtil.open(point, prevNode, target.id, open);
    const focusNode: EditableNode = {...target, open};
    this.setState({node, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode});
    process.nextTick(() => this.resize());
  }

  click = (target: EditableNode) => {
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
    const {node: prevNode} = this.state;
    const node = EditableNodeUtil._deleteFocus(prevNode);
    this.setState({node, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode: null});
  }

  dragStart = (target: EditableNode) => {
    const {node: prevNode} = this.state;
    const dragParent = EditableNodeUtil._getPrent(prevNode, target);
    const openNode = EditableNodeUtil.open(point, prevNode, target.id, false);
    const node = EditableNodeUtil._deleteFocus(openNode);
    const map = EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(node));
    this.setState({node, dragParent, map, focusNode: null});
  }

  dragMove = (target: EditableNode, p: Point) => {
    const {node: prevNode, dragParent, map, beforeCell} = this.state;

    if (map !== null && 0 <= p.x && p.x < map.length) {
      const cell = map[p.x][p.y];
      if (cell === undefined || cell.node.id === target.id) { return; }
      if (beforeCell === null || !EditableNodeUtil.isEqualCell(beforeCell, cell)) {
        this.setState({beforeCell: cell});

        if (target.type === 'case') {
          if (cell.action === 'move' && dragParent!.children.find(c => c.id === cell.node.id) !== undefined) {
            const newNode = EditableNodeUtil.move(point, prevNode, target, cell.node);
            this.setState({node: newNode, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(newNode))});
            process.nextTick(() => this.resize());
          }
          if (cell.action === 'push' && dragParent!.id === cell.node.id) {
            const newNode = EditableNodeUtil.push(point, prevNode, target, cell.node);
            this.setState({node: newNode, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(newNode))});
            process.nextTick(() => this.resize());
          }
          return;
        }

        if (cell.action === 'move' && cell.node.type !== 'case') {
          const newNode = EditableNodeUtil.move(point, prevNode, target, cell.node);
          this.setState({node: newNode, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(newNode))});
          process.nextTick(() => this.resize());
        }

        if (cell.action === 'push' && cell.node.type !== 'switch') {
          const newNode = EditableNodeUtil.push(point, prevNode, target, cell.node);
          this.setState({node: newNode, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(newNode))});
          process.nextTick(() => this.resize());
        }
      }
    }
  }

  dragEnd = () => {
    this.setState({dragParent: null});
  }

  changeFocusNode = (target: EditableNode) => {
    const {node: prevNode} = this.state;
    const node = EditableNodeUtil.replace(point, prevNode, target)
    this.setState({node, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode: target});
  }

  addDetails = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = EditableNodeUtil.addDetails(point, prevNode, focusNode!);
    this.setState({node: newNode, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(newNode))});
    process.nextTick(() => this.resize());
  }

  addFromCommon = (e: any) => {
    const { commonNodes } = this.props;
    const common = commonNodes.find(c => c.id === e.target.value);
    if (common === undefined) { return; }
    
    const setIdCommon = TreeUtil._setId(common);
    const {node: prevNode, focusNode} = this.state;
    const newNode = EditableNodeUtil.addFromCommon(point, prevNode, focusNode!, setIdCommon);
    this.setState({node: newNode, map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(newNode))});
    process.nextTick(() => this.resize());
  }

  registAsCommon = (target: EditableNode) => {
    const { addNode, addCommonList } = this.props;
    const newNode = TreeUtil._setId(target);
    addNode(newNode);
    addCommonList(newNode);
  }

  deleteSelf = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = EditableNodeUtil.deleteById(point, prevNode, focusNode!.id);
    this.setState({
      node: newNode,
      map: EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(newNode)),
      focusNode: null});
    process.nextTick(() => this.resize());
  }

  render() {
    const { toolRef, rightPaneRef, parent, commonNodes, back, classes } = this.props;
    const { isCommon, node, focusNode, map, hasDifference, cannotSaveReason, saved } = this.state;
    const flatNodes = EditableNodeUtil.toFlat(node);
    // const cref = this.stageContainerRef.current;
    const nodeActionProps = {
      // cref,
      click: this.click,
      dragStart: this.dragStart,
      dragMove: this.dragMove,
      dragEnd: this.dragEnd,
      deleteFocus: this.deleteFocus
    };

    const rightPaneProps: RightPaneProps = {
      rightPaneRef,
      node: focusNode,
      commonNodes,
      isRoot: focusNode === null ? false : parent === null && focusNode.id === node.id,
      isCommon,
      changeIsCommon: (e: any) => this.setState({isCommon: e.target.value}),
      changeNode: this.changeFocusNode,
      addDetails: this.addDetails,
      addFromCommon: this.addFromCommon,
      registAsCommon: this.registAsCommon,
      deleteSelf: this.deleteSelf,
    };

    return (
      <div className={classes.root} ref={this.stageContainerRef}>
        <ToolContainer containerRef={toolRef}>
          <Grid container spacing={16}>
            <Grid item>
              <Fab color="primary" onClick={this.differenceCheck} size="medium"><ArrowBack/></Fab>
            </Grid>
            <Grid item>
              <Fab className={classes.saveButton} variant="extended" color="primary" onClick={this.save}>
                保存<CheckIcon className={classes.extendedIcon}/>
              </Fab>
            </Grid>
            {parent === null && (
            <Grid item>
              <Fab color="primary" onClick={this.download} size="medium">
                <Download/>
              </Fab>
            </Grid>)}
          </Grid>
        </ToolContainer>

        <Stage ref={this.stageRef} onClick={this.deleteFocus}>
          <Layer>
            {/* {map !== null && map.map((_, x) => (
            <Group key={`group-${x}`}>
              {_.map((__, y) => {
                const cell = map[x][y];
                if (cell === undefined) { return <Rect key={`${x}-${y}`}/>; }
                const fill = cell.action === 'push' ? 'yellow' :
                            cell.action === 'move' ? 'blue'   : 'grey';
                return <Rect key={`${x}-${y}`} x={x * unit} y={y * unit + 300} width={unit} height={unit} fill={fill}/>;
                })}
            </Group>))} */}
            {flatNodes.map(n => <EditableKNode key={n.id} node={n} {...nodeActionProps}/>)}
          </Layer>
        </Stage>
        <RightPane {...rightPaneProps}/>

        <Dialog open={hasDifference} onClose={() => this.setState({hasDifference: false})}>
          <DialogTitle>マニュアルは編集されています。</DialogTitle>
          <DialogContent>
            <DialogContentText>
              保存せずに画面を移動してもよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({hasDifference: false})}>Cancel</Button>
            <Button onClick={back} color="primary" autoFocus>OK</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={cannotSaveReason !== null} onClose={() => this.setState({cannotSaveReason: null})}>
          <DialogTitle>このデータは保存できません</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {cannotSaveReason === 'switch' && 'すべての分岐には、１つ以上の条件を設定して下さい。'}
              {cannotSaveReason === 'case'   && 'すべての条件には、１つ以上の詳細項目を設定して下さい。'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({cannotSaveReason: null})} color="primary" autoFocus>OK</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={saved}
          autoHideDuration={3000}
          onClose={() => this.setState({saved: false})}
          message={<span>保存しました</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={() => this.setState({saved: false})}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(NodeEditor);