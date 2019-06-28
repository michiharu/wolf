import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
} from '@material-ui/core';

import { Stage, Layer, Group } from 'react-konva';

import { TreeNode, KTreeNode, DragRow, baseKTreeNode, baseKWithArrow, KWithArrow } from '../../../../data-types/tree';
import { toolbarHeight, toolbarMinHeight, rightPainWidth } from '../../../../settings/layout';
import TreeUtil from '../../../../func/tree';
import TreeNodeUtil from '../../../../func/tree-node';
import KTreeUtil from '../../../../func/k-tree';
import KArrowUtil from '../../../../func/k-arrow';
import { theme } from '../../../../index';
import KViewNode from '../../../../components/konva/k-view-node';
import { NodeViewerActions } from './node-viewer-container';
import { RSState } from '../../../../redux/states/rsState';
import { KSState } from '../../../../redux/states/ksState';

const headerHeight = 96;
const styles = (theme: Theme) => createStyles({
  root: {
    overflow: 'scroll',
    height: `calc(100vh - ${toolbarHeight + theme.spacing(2) + headerHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight + theme.spacing(2) + headerHeight}px)`,
    },
  },
  toolbar: theme.mixins.toolbar,
  settingsButton: {
    position: 'fixed',
    right: theme.spacing(1),
    top: toolbarHeight + theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight + theme.spacing(1),
    },
  },
  rightPaneContainer: {
    
    width: '40vw',
    minWidth: rightPainWidth,
    right: 0,
    padding: theme.spacing(1),
    top: toolbarHeight,
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight,
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
  saveButton: {
    minWidth: 100,
  },
  extendedIcon: {
    marginLeft: theme.spacing(1),
  },
});

interface Props extends KSState, RSState, NodeViewerActions, WithStyles<typeof styles> {
  node: TreeNode | null;
}

interface State {
  didRender: boolean;
}

export type FlowType = 'rect' | 'arrow';
export const flowType = {rect: 'rect', arrow: 'arrow'};
export const marginBottom = 40;

class NodeViewerComponent extends React.Component<Props, State> {

  mainRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();
  convergentRef = React.createRef<any>();

  kTree: KTreeNode;
  rows: DragRow[] | null = null;
  dropRow: number = 0;

  constructor(props: Props) {
    super(props);
    const state = NodeViewerComponent.getInitialState();
    this.state = state;
    const kTree = props.node === null ? baseKTreeNode : TreeUtil._get(props.node, baseKTreeNode);
    this.kTree = KTreeUtil.setCalcProps(kTree, props.ks);
  }

  static getInitialState = (): State => {
    return {
      didRender: false,
    };
  }
  
  componentDidMount() {
    process.nextTick(() => {
      this.resize();
      this.addScrollEventListener();
      this.setState({didRender: true});
    });
    window.addEventListener('resize', this.resize);
  }

  addScrollEventListener = () => {
    const scrollContainer = this.mainRef.current;
    if (scrollContainer === null) { return; }
    scrollContainer.addEventListener('scroll', this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    const scrollContainer = this.mainRef.current;
    if (scrollContainer === null) { throw  new Error('Cannot find elements.'); }
    scrollContainer.removeEventListener('scroll', this.scroll);
  }

  resize = () => {
    const mref = this.mainRef.current;
    const stage = this.stageRef.current;
    if (mref === null || stage === null) { return; }
    stage.width(mref.offsetWidth - theme.spacing(2));
    stage.height(mref.offsetHeight - theme.spacing(2));
    stage.draw();
    this.setState({didRender: true});
  }

  scroll = () => {
    const { node, ks, update } = this.props;
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw  new Error('Cannot find elements.'); }
    // canvasをmainと一致するよう移動
    const dx = scrollContainer.scrollLeft;
    const dy = scrollContainer.scrollTop;
    stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';

    const convergent = this.convergentRef.current;
    if (convergent === null) { return; }

    // convergent領域をスクロール
    convergent.x(-dx);
    convergent.y(-dy);
    stage.draw();

    const f = TreeNodeUtil._getFocusNode(this.kTree)!;
    if (f !== undefined) {
      if (f.point.x * ks.unit < dx || stage.width() / 2 + dx < (f.point.x + f.rect.w) * ks.unit) {
        update(TreeNodeUtil._deleteFocus(node!));
      }
    }
  }

  expand = (target: KWithArrow, open: boolean) => {
    const { node, update } = this.props;
    update(TreeNodeUtil._open(node!, target.id, open));
    process.nextTick(() => this.resize());
  }

  render() {
    const { node: tree, ks, classes } = this.props;
    const kTreeNode = KTreeUtil.setCalcProps(tree === null ? baseKWithArrow : TreeUtil._get(tree, baseKWithArrow), ks);
    const node = KArrowUtil.setArrow(kTreeNode, ks);
    this.kTree = node;
    const flatNodes = TreeNodeUtil.toArrayWithoutClose(node);
    const rows = KTreeUtil.makeDragMap(flatNodes, ks);
    this.rows = rows;

    const nodeActionProps = {
      ks,
      expand: (target: KWithArrow) => this.expand(target, !target.open)
    };

    const stage = this.stageRef.current;
    const largeContainerStyle: React.CSSProperties | undefined = stage !== null ? {
      position: 'relative',
      overflow: 'hidden',
      width: Math.max((node.self.w + ks.spr.w * 2) * ks.unit, stage.x()),
      height: Math.max((node.self.h + ks.spr.h * 2) * ks.unit + marginBottom, stage.y()),
    } : undefined;

    return (
      <div className={classes.root} ref={this.mainRef}>
        <div style={largeContainerStyle}>
          <Stage ref={this.stageRef}>
            <Layer>
              <Group ref={this.convergentRef}>
                {flatNodes
                .map(n => <KViewNode key={n.id} node={n} {...nodeActionProps}/>)}
                {/* <DragMapForTree node={node} rows={rows} ks={ks} /> */}
                {/* <DropMap node={node} flatNodes={flatNodes} ks={ks}/> */}
              </Group>
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(NodeViewerComponent);