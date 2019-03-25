import * as React from 'react';
import ReactToPrint from 'react-to-print';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Fab,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Skip from '@material-ui/icons/SkipNext';
import Download from '@material-ui/icons/SaveAlt';
import PrintIcon from '@material-ui/icons/Print';
import Undo from '@material-ui/icons/Undo';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, CheckNode } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, viewItem, unit } from '../../../settings/layout';

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
  printContainerWrapper: {
    position: 'relative',
    width: 0,
    height: 0,
    overflow: 'hidden'
  },
  printContainer: {
    position: 'absolute',
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
  nodeHistory: CheckNode[];
  focusNode: CheckNode | null;
  skipFlag: boolean;
}

const point = { x: viewItem.spr.w * 2, y: viewItem.spr.h * 5};

class CheckList extends React.Component<Props, State> {

  stageContainerRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();
  printContainerRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    const { parent, node } = props;
    const newState = CheckNodeUtil.getInitialState(point, parent, node);
    this.state = newState;
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
      return CheckNodeUtil.getInitialState(point, nextProps.parent, nextProps.node);
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
    // const {node} = this.props;
    // const filename = `${node.label}.json`;
    // const nodeWithoutId = TreeUtil._removeId(node);
    // fileDownload(JSON.stringify(nodeWithoutId), filename);
  }

  click = (target: CheckNode) => {
    const {node: prevNode} = this.state;
    const node = CheckNodeUtil.open(point, prevNode, target.id, !target.open);
    this.setState({node});
  }

  check = (target: CheckNode) => {
    if (!target.focus) { return; }
    if (target.type === 'task') {
      const {node: prevNode, nodeHistory: history} = this.state;
      const node = CheckNodeUtil.check(point, prevNode);
      history.push(node);
      const focusNode = CheckNodeUtil._getFocusNode(node);
      this.setState({node, nodeHistory: history, focusNode});
    }
    if (target.type === 'case') {
      const {node: prevNode, nodeHistory: history} = this.state;
      const node = CheckNodeUtil.select(point, prevNode, target);
      history.push(node);
      const focusNode = CheckNodeUtil._getFocusNode(node);
      this.setState({node, nodeHistory: history, focusNode});
    }
  }

  skip = () => {
    const {node: prevNode, nodeHistory: history} = this.state;
    const node = CheckNodeUtil.skip(point, prevNode);
    history.push(node);
    const focusNode = CheckNodeUtil._getFocusNode(node);
    this.setState({node, nodeHistory: history, focusNode, skipFlag: false});
  }

  undo = () => {
    const { nodeHistory } = this.state;
    nodeHistory.pop();
    const node = nodeHistory[nodeHistory.length - 1];
    const focusNode = CheckNodeUtil._getFocusNode(node);
    this.setState({node, nodeHistory, focusNode});
  }


  render() {
    const { toolRef,  back, classes } = this.props;
    const { node, nodeHistory, focusNode, skipFlag } = this.state;
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

            <Grid item>
              <Fab color="primary" variant="extended" onClick={this.download}>
                記録のダウンロード<Download　className={classes.extendedIcon}/>
              </Fab>
            </Grid>

            <Grid item>
              <Fab color="primary" size="medium" onClick={this.download}>
                <ReactToPrint
                  trigger={() => <PrintIcon/>}
                  content={() => this.printContainerRef.current}
                />
              </Fab>
            </Grid>
            {focusNode !== null && (
            <Grid item>
              <Fab color="primary" size="medium" onClick={() => this.setState({skipFlag: true})}>
                <Skip/>
              </Fab>
            </Grid>)}

            {nodeHistory.length !== 1 && <Grid item>
              <Fab color="primary" size="medium" onClick={this.undo}>
                <Undo/>
              </Fab>
            </Grid>}
            
          </Grid>
        </ToolContainer>
        <Stage ref={this.stageRef} draggable>
          <Layer>
            {flatNodes.map(n => <CheckKNode key={n.id} node={n} {...nodeActionProps}/>)}
          </Layer>
        </Stage>
        <div className={classes.printContainerWrapper}>
          <div
            className={classes.printContainer}
            ref={this.printContainerRef}
          >
            <Stage width={(flatNodes[0].self.w + point.x) * unit} height={(flatNodes[0].self.h + point.y) * unit}>
              <Layer>
                {flatNodes.map(n => <CheckKNode key={n.id} node={n} {...nodeActionProps}/>)}
              </Layer>
            </Stage>
          </div>
        </div>
        {focusNode !== null && (
        <Dialog open={skipFlag} onClose={() => this.setState({skipFlag: false})}>
          <DialogTitle>次の項目をスキップしてもよろしいですか？</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`「${focusNode!.label}」`}
              {focusNode!.children.length !== 0 && (
                <>
                  <br/>{`詳細項目の数：${focusNode!.children.length}」`}
                </>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({skipFlag: false})}>Cancel</Button>
            <Button onClick={this.skip} color="primary" autoFocus>Skip</Button>
          </DialogActions>
        </Dialog>)}
        
      </div>
    );
  }
}

export default withStyles(styles)(CheckList);