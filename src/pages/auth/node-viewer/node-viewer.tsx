import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Fab } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, KNode, Cell, Point } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, viewItem, unit } from '../../../settings/layout';

import ToolContainer from '../../../components/tool-container/tool-container';
import KNodeUtil from '../../../func/k-node';
import NodeRect from '../../../components/konva-node/node-rect';
import RightPane from './right-pane';

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

export interface NodeViewProps {
  toolRef: HTMLDivElement;
  rightPaneRef: HTMLDivElement;
  parentType: Type;
  node: TreeNode;
  back: () => void;
  changeNode: (node: TreeNode) => void;
}

interface Props extends NodeViewProps, WithStyles<typeof styles> {}

interface State {
  node: KNode;
  map: Cell[][] | null;
  beforeCell: Cell | null;
  focusNode: KNode | null;
}

const point = { x: viewItem.spr.w * 2, y: viewItem.spr.h * 5};

class NodeViewer extends React.Component<Props, State> {

  stageContainerRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();

  constructor(props: Props) {
    super(props);
    const { parentType, node } = props;
    const newNode = KNodeUtil.getViewNode(parentType, node);
    const openNode = KNodeUtil.open(point, newNode, newNode.id, true);
    this.state = {
      node: openNode,
      map: KNodeUtil.makeMap(KNodeUtil.toFlat(openNode)),
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
      const newNode = KNodeUtil.getViewNode(nextProps.parentType, nextProps.node);
      const openNode = KNodeUtil.open(point, newNode, newNode.id, true);
      return {
        node: openNode,
        map: KNodeUtil.makeMap(KNodeUtil.toFlat(openNode))
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

  saveNodeState = (node: KNode) => {
    this.setState({node, map: KNodeUtil.makeMap(KNodeUtil.toFlat(node))});
  }

  setFocusState = (target: KNode, focus: boolean) => {
    const {node: prevNode} = this.state;
    const node = KNodeUtil.focus(prevNode, target.id);
    const focusNode: KNode = {...target, focus};
    this.setState({node, map: KNodeUtil.makeMap(KNodeUtil.toFlat(node)), focusNode});
  }

  setOpenState = (target: KNode, open: boolean) => {
    const {node: prevNode} = this.state;
    const node = KNodeUtil.open(point, prevNode, target.id, open);
    const focusNode: KNode = {...target, open};
    this.setState({node, map: KNodeUtil.makeMap(KNodeUtil.toFlat(node)), focusNode});
  }

  click = (target: KNode) => {
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
    const node = KNodeUtil._deleteFocus(prevNode);
    this.setState({node, map: KNodeUtil.makeMap(KNodeUtil.toFlat(node)), focusNode: null});
  }

  dragStart = (target: KNode) => {
    const {node: prevNode} = this.state;
    const openNode = KNodeUtil.open(point, prevNode, target.id, false);
    const node = KNodeUtil._deleteFocus(openNode);
    this.setState({node, map: KNodeUtil.makeMap(KNodeUtil.toFlat(node)), focusNode: null});
  }

  dragMove = (target: KNode, p: Point) => {
    const {node: prevNode, map, beforeCell} = this.state;

    if (map !== null && 0 <= p.x && p.x < map.length) {
      const cell = map[p.x][p.y];
      if (cell === undefined || cell.node.id === target.id) { return; }
      if (beforeCell === null || !KNodeUtil.isEqualCell(beforeCell, cell)) {
        this.setState({beforeCell: cell});

        if (cell.action === 'move') {
          const newNode = KNodeUtil.move(point, prevNode, target, cell.node);
          this.saveNodeState(newNode);
        }

        if (cell.action === 'push') {
          const newNode = KNodeUtil.push(point, prevNode, target, cell.node);
          this.saveNodeState(newNode);
        }
      }
    }
  }

  dragEnd = () => {
    const {node: prevNode} = this.state;
    const newNode = KNodeUtil.deleteDummy(point, prevNode);
    this.saveNodeState(newNode);
  }

  changeFocusNode = (target: KNode) => {
    const {node: prevNode} = this.state;
    const node = KNodeUtil.replaceOnlySelf(point, prevNode, target)
    this.setState({node, map: KNodeUtil.makeMap(KNodeUtil.toFlat(node)), focusNode: target});
  }

  addBefore = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = KNodeUtil.addBefore(point, prevNode, focusNode!);
    this.saveNodeState(newNode);
  }

  addNext = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = KNodeUtil.addNext(point, prevNode, focusNode!);
    this.saveNodeState(newNode);
  }
  addDetails = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = KNodeUtil.addDetails(point, prevNode, focusNode!);
    this.saveNodeState(newNode);
  }
  deleteSelf = () => {
    const {node: prevNode, focusNode} = this.state;
    const newNode = KNodeUtil.deleteById(point, prevNode, focusNode!.id);
    this.saveNodeState(newNode);
  }

  render() {
    const { toolRef, rightPaneRef, changeNode, back, classes } = this.props;
    const { node, focusNode } = this.state;
    const flatNodes = KNodeUtil.toFlat(node);

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
            {flatNodes.map(n => <NodeRect key={n.id} node={n} {...nodeActionProps}/>)}
          </Layer>
        </Stage>
        <RightPane {...rightPaneProps}/>
      </div>
    );
  }
}

export default withStyles(styles)(NodeViewer);