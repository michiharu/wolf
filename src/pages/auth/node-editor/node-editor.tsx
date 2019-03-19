import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Fab } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import Download from '@material-ui/icons/SaveAlt';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, EditableNode, Cell, Point } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, viewItem } from '../../../settings/layout';

import ToolContainer from '../../../components/tool-container/tool-container';
import EditableNodeUtil from '../../../func/editable-node-util';
import EditableKNode from '../../../components/konva-node/editable-k-node';
import RightPane from './right-pane';
import { fileDownload } from '../../../func/file-download';
import TreeUtil from '../../../func/tree';

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
});

export interface EditorProps {
  toolRef: HTMLDivElement;
  rightPaneRef: HTMLDivElement;
  parent: TreeNode | null;
  node: TreeNode;
  back: () => void;
  changeNode: (node: TreeNode) => void;
}

interface Props extends EditorProps, WithStyles<typeof styles> {}

interface State {
  node: EditableNode;
  map: Cell[][] | null;
  beforeCell: Cell | null;
  focusNode: EditableNode | null;
}

const point = { x: viewItem.spr.w * 2, y: viewItem.spr.h * 5};

class NodeEditor extends React.Component<Props, State> {

  stageContainerRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();

  constructor(props: Props) {
    super(props);
    const { parent, node } = props;
    const parentType: Type = parent !== null ? parent.type : 'task';
    const newNode = EditableNodeUtil.get(parentType, node);
    const openNode = EditableNodeUtil.open(point, newNode, newNode.id, true);
    this.state = {
      node: openNode,
      map: EditableNodeUtil.makeMap(EditableNodeUtil.toFlat(openNode)),
      beforeCell: null,
      focusNode: null,
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
      const parentType: Type = nextProps.parent !== null ? nextProps.parent.type : 'task';
      const newNode = EditableNodeUtil.get(parentType, nextProps.node);
      const openNode = EditableNodeUtil.open(point, newNode, newNode.id, true);
      return {
        node: openNode,
        map: EditableNodeUtil.makeMap(EditableNodeUtil.toFlat(openNode))
      };
    }
    return null;
  }

  resize = () => {
    const cref = this.stageContainerRef.current, sref = this.stageRef.current;
    if (cref === null || sref === null) { throw 'Cannot find elements.'; }
    sref.width(cref.offsetWidth);
    sref.height(cref.offsetHeight);
    sref.draw();
  }

  download = () => {
    const {node} = this.props;
    const filename = `${node.label}.json`;
    const nodeWithoutId = TreeUtil._removeId(node);
    fileDownload(JSON.stringify(nodeWithoutId), filename);
  }

  saveNodeState = (node: EditableNode) => {
    this.setState({node, map: EditableNodeUtil.makeMap(EditableNodeUtil.toFlat(node))});
  }

  setFocusState = (target: EditableNode, focus: boolean) => {
    const {node: prevNode} = this.state;
    const node = EditableNodeUtil.focus(prevNode, target.id);
    const focusNode: EditableNode = {...target, focus};
    this.setState({node, map: EditableNodeUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode});
  }

  setOpenState = (target: EditableNode, open: boolean) => {
    const {node: prevNode} = this.state;
    const node = EditableNodeUtil.open(point, prevNode, target.id, open);
    const focusNode: EditableNode = {...target, open};
    this.setState({node, map: EditableNodeUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode});
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
    this.setState({node, map: EditableNodeUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode: null});
  }

  dragStart = (target: EditableNode) => {
    const {node: prevNode} = this.state;
    const openNode = EditableNodeUtil.open(point, prevNode, target.id, false);
    const node = EditableNodeUtil._deleteFocus(openNode);
    this.setState({node, map: EditableNodeUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode: null});
  }

  dragMove = (target: EditableNode, p: Point) => {
    const {node: prevNode, map, beforeCell} = this.state;

    if (map !== null && 0 <= p.x && p.x < map.length) {
      const cell = map[p.x][p.y];
      if (cell === undefined || cell.node.id === target.id) { return; }
      if (beforeCell === null || !EditableNodeUtil.isEqualCell(beforeCell, cell)) {
        this.setState({beforeCell: cell});

        if (cell.action === 'move') {
          const newNode = EditableNodeUtil.move(point, prevNode, target, cell.node);
          this.saveNodeState(newNode);
        }

        if (cell.action === 'push') {
          const newNode = EditableNodeUtil.push(point, prevNode, target, cell.node);
          this.saveNodeState(newNode);
        }
      }
    }
  }

  dragEnd = () => {
    const {node: prevNode} = this.state;
    const newNode = EditableNodeUtil.deleteDummy(point, prevNode);
    this.saveNodeState(newNode);
  }

  changeFocusNode = (target: EditableNode) => {
    const {node: prevNode} = this.state;
    const node = EditableNodeUtil.replaceOnlySelf(point, prevNode, target)
    this.setState({node, map: EditableNodeUtil.makeMap(EditableNodeUtil.toFlat(node)), focusNode: target});
  }

  addBefore = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = EditableNodeUtil.addBefore(point, prevNode, focusNode!);
    this.saveNodeState(newNode);
  }

  addNext = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = EditableNodeUtil.addNext(point, prevNode, focusNode!);
    this.saveNodeState(newNode);
  }
  addDetails = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = EditableNodeUtil.addDetails(point, prevNode, focusNode!);
    this.saveNodeState(newNode);
  }
  deleteSelf = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = EditableNodeUtil.deleteById(point, prevNode, focusNode!.id);
    this.saveNodeState(newNode);
  }

  render() {
    const { toolRef, rightPaneRef, parent, changeNode, back, classes } = this.props;
    const { node, focusNode, map } = this.state;
    const flatNodes = EditableNodeUtil.toFlat(node);

    const nodeActionProps = {
      click: this.click,
      dragStart: this.dragStart,
      dragMove: this.dragMove,
      dragEnd: this.dragEnd,
      deleteFocus: this.deleteFocus
    };
    const rightPaneProps = {
      rightPaneRef,
      node: focusNode,
      changeNode: this.changeFocusNode,
      addBefore: this.addBefore,
      addNext: this.addNext,
      addDetails: this.addDetails,
      deleteSelf: this.deleteSelf,
    };

    return (
      <div className={classes.root} ref={this.stageContainerRef}>
        <ToolContainer containerRef={toolRef}>
          <Grid container spacing={16}>
            <Grid item>
              <Fab color="primary" onClick={back} size="medium"><ArrowBack/></Fab>
            </Grid>
            <Grid item>
              <Fab className={classes.saveButton} variant="extended" color="primary" onClick={() => changeNode(node)}>
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
        <Stage ref={this.stageRef} onClick={this.deleteFocus} draggable>
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
      </div>
    );
  }
}

export default withStyles(styles)(NodeEditor);