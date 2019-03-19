import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Fab } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import Download from '@material-ui/icons/SaveAlt';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, CheckNode } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, viewItem } from '../../../settings/layout';

import ToolContainer from '../../../components/tool-container/tool-container';
import CheckNodeUtil from '../../../func/check-node-util';
import CheckKNode from '../../../components/konva-node/check-k-node';

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

export interface CheckListProps {
  toolRef: HTMLDivElement;
  parent: TreeNode | null;
  node: TreeNode;
  back: () => void;
}

interface Props extends CheckListProps, WithStyles<typeof styles> {}

interface State {
  node: CheckNode;
  focusNode: CheckNode | null;
}

const point = { x: viewItem.spr.w * 2, y: viewItem.spr.h * 5};

class CheckList extends React.Component<Props, State> {

  stageContainerRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();

  constructor(props: Props) {
    super(props);
    const { parent, node } = props;
    const parentType: Type = parent !== null ? parent.type : 'task';
    const newNode = CheckNodeUtil.get(parentType, node);
    const initNode = CheckNodeUtil.openFirst(point, newNode);
    this.state = {
      node: initNode,
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
      const newNode = CheckNodeUtil.get(parentType, nextProps.node);
      const openNode = CheckNodeUtil.open(point, newNode, newNode.id, true);
      return {
        node: openNode,
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

  setOpenState = (target: CheckNode, open: boolean) => {
    const {node: prevNode} = this.state;
    const node = CheckNodeUtil.open(point, prevNode, target.id, open);
    const focusNode: CheckNode = {...target, open};
    this.setState({node, focusNode});
  }

  click = (target: CheckNode) => {
    this.setOpenState(target, !target.open);
  }

  check = (target: CheckNode) => {
    if (!target.focus) { return; }
    if (target.parentType === 'task') {
      const {node: prevNode} = this.state;
      const node = CheckNodeUtil.check(point, prevNode);
      this.setState({node});
    } else {

    }
  }


  render() {
    const { toolRef,  back, classes } = this.props;
    const { node, focusNode } = this.state;
    const flatNodes = CheckNodeUtil.toFlat(node);

    const nodeActionProps = {
      click: this.click, check: this.check
    };

    return (
      <div className={classes.root} ref={this.stageContainerRef}>
        <ToolContainer containerRef={toolRef}>
          <Grid container spacing={16}>
            <Grid item>
              <Fab color="primary" onClick={back} size="medium"><ArrowBack/></Fab>
            </Grid>
            {/* <Grid item>
              <Fab className={classes.saveButton} variant="extended" color="primary" onClick={() => changeNode(node)}>
                保存<CheckIcon className={classes.extendedIcon}/>
              </Fab>
            </Grid> */}
            {/* {parent === null && (
            <Grid item>
              <Fab color="primary" onClick={this.download} size="medium">
                <Download/>
              </Fab>
            </Grid>)} */}
          </Grid>
        </ToolContainer>
        <Stage ref={this.stageRef} draggable>
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
            {flatNodes.map(n => <CheckKNode key={n.id} node={n} {...nodeActionProps}/>)}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default withStyles(styles)(CheckList);