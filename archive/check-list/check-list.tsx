import * as React from 'react';
import ReactToPrint from 'react-to-print';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Fab,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Start from '@material-ui/icons/PlayArrow';
import Skip from '@material-ui/icons/SkipNext';
import Download from '@material-ui/icons/SaveAlt';
import PrintIcon from '@material-ui/icons/Print';
import Undo from '@material-ui/icons/Undo';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, CheckNode, CheckRecord, isTask } from '../../src/data-types/tree';
import { toolbarHeight, toolbarMinHeight, defaultKS as ks } from '../../src/settings/layout';

import CheckNodeUtil from '../../src/func/check-node-util';
import CheckKNode from '../../src/components/konva/check-k-node';
import { fileDownload } from '../../src/func/file-download';

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
    marginLeft: theme.spacing(1),
  },
});

export interface CheckListProps {
  toolRef: HTMLDivElement;
  parent: TreeNode | null;
  node: TreeNode;
  back: () => void;
}

interface Props extends CheckListProps, WithStyles<typeof styles> {}

export interface CheckListState {
  node: CheckNode;
  nodeHistory: CheckNode[];
  focusNode: CheckNode | null;
  skipFlag: boolean;
  checkRecords: CheckRecord[];
}

const point = { x: ks.spr.w * 2, y: ks.spr.h * 5};

class CheckList extends React.Component<Props, CheckListState> {

  stageContainerRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();
  printContainerRef = React.createRef<HTMLDivElement>();
  timer = -1;

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

  static getDerivedStateFromProps(nextProps: Props, prevState: CheckListState) {
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
    const {node} = this.props;
    const {checkRecords} = this.state;
    const filename = `${node.label}-${new Date().toString}.json`;
    fileDownload(JSON.stringify(checkRecords), filename);
  }

  start = () => {
    this.timer = new Date().getTime();
    const {node: prevNode, nodeHistory: history} = this.state;
    const node = CheckNodeUtil.openFirst(point, prevNode);
    history.push(node);
    const focusNode = CheckNodeUtil._getFocusNode(node);
    this.setState({node, nodeHistory: history, focusNode});
  }

  click = (target: CheckNode) => {
    const {node: prevNode} = this.state;
    const node = CheckNodeUtil.open(point, prevNode, target.id, !target.open);
    this.setState({node});
  }

  check = (target: CheckNode) => {
    if (!target.focus) { return; }
    const {node: prevNode, nodeHistory: history, checkRecords} = this.state;
    const node = isTask(target.type)
      ? CheckNodeUtil.check(point, prevNode)
      : CheckNodeUtil.select(point, prevNode, target);
    history.push(node);
    const focusNode = CheckNodeUtil._getFocusNode(node);
    const now = new Date().getTime();
    const newRecord: CheckRecord = {
      at: now,
      from: now - this.timer,
      time: now - this.timer - (checkRecords.length === 0 ? 0 : checkRecords[checkRecords.length - 1].from),
      node: target
    };
    console.log(newRecord.time);
    checkRecords.push(newRecord);
    this.setState({node, nodeHistory: history, focusNode, checkRecords});
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
      ks,
      click: this.click, check: this.check
    };

    return (
      <div className={classes.root} ref={this.stageContainerRef}>
          <Grid container spacing={2}>
            <Grid item>
              <Fab color="primary" onClick={back} size="medium"><ArrowBack/></Fab>
            </Grid>
            {/* <Grid item>
              <Fab className={classes.saveButton} variant="extended" color="primary" onClick={() => changeNode(node)}>
                保存<CheckIcon className={classes.extendedIcon}/>
              </Fab>
            </Grid> */}

            {focusNode === null && nodeHistory.length === 1 &&
            <Grid item>
              <Fab color="primary" variant="extended" onClick={this.start}>
                スタート<Start className={classes.extendedIcon}/>
              </Fab>
            </Grid>}

            {focusNode === null && nodeHistory.length !== 1 && 
            <Grid item>
              <Fab color="primary" variant="extended" onClick={this.download}>
                記録のダウンロード<Download　className={classes.extendedIcon}/>
              </Fab>
            </Grid>}

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
            <Stage width={32 + flatNodes[0].self.w * ks.unit} height={80 + flatNodes[0].self.h * ks.unit}>
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