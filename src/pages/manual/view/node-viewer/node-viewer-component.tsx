import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
} from '@material-ui/core';

import { Stage, Layer, Group } from 'react-konva';

import { TreeNode, KTreeNode, DragRow, baseKTreeNode, baseKWithArrow, KWithArrow } from '../../../../data-types/tree';
import { toolbarHeight, toolbarMinHeight, ks as defaultKS, rightPainWidth } from '../../../../settings/layout';
import { rs as defaultRS } from '../../../../settings/reading';

import TreeUtil from '../../../../func/tree';
import TreeNodeUtil from '../../../../func/tree-node';
import KTreeUtil from '../../../../func/k-tree';
import KSize from '../../../../data-types/k-size';
import keys from '../../../../settings/storage-keys';
import { ViewSettingProps } from '../../../../components/view-settings';
import ReadingSetting from '../../../../data-types/reading-settings';
import KArrowUtil from '../../../../func/k-arrow';
import { theme } from '../../../../index';
import KViewNode from '../../../../components/konva/k-view-node';
import { NodeViewerActions } from './node-viewer-container';

const styles = (theme: Theme) => createStyles({
  root: {
    overflow: 'scroll',
    height: `calc(100vh - ${toolbarHeight * 2 + theme.spacing.unit}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight * 2 + theme.spacing.unit}px)`,
    },
  },
  toolbar: theme.mixins.toolbar,
  settingsButton: {
    position: 'fixed',
    right: theme.spacing.unit,
    top: toolbarHeight + theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight + theme.spacing.unit,
    },
  },
  rightPaneContainer: {
    
    width: '40vw',
    minWidth: rightPainWidth,
    right: 0,
    padding: theme.spacing.unit,
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
    marginLeft: theme.spacing.unit,
  },
});

export interface NodeEditorProps {
  node: TreeNode;
}

interface Props extends NodeViewerActions, WithStyles<typeof styles> {
  node: TreeNode;
}

interface State {
  didRender: boolean;
  ks: KSize;
  ft: FlowType;
  rs: ReadingSetting;
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
    const kTree = TreeUtil._get(props.node, baseKTreeNode);
    this.kTree = KTreeUtil.setCalcProps(kTree, state.ks);
  }

  static getInitialState = (): State => {
    const ksFromStorage = localStorage.getItem(keys.ks);
    const ks = ksFromStorage !== null ? JSON.parse(ksFromStorage) as KSize : defaultKS;
    const ftFromStorage = localStorage.getItem(keys.ft);
    const ft = ftFromStorage !== null ? JSON.parse(ftFromStorage) as FlowType : 'arrow';
    const rsFromStorage = localStorage.getItem(keys.rs);
    const rs = rsFromStorage !== null ? JSON.parse(rsFromStorage) as ReadingSetting : defaultRS;
    return {
      didRender: false,
      ks,
      ft,
      rs,
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
    if (scrollContainer === null) { throw 'Cannot find elements.'; }
    scrollContainer.addEventListener('scroll', this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    const scrollContainer = this.mainRef.current;
    if (scrollContainer === null) { throw 'Cannot find elements.'; }
    scrollContainer.removeEventListener('scroll', this.scroll);
  }

  resize = () => {
    const mref = this.mainRef.current;
    const stage = this.stageRef.current;
    if (mref === null || stage === null) { throw 'Cannot find elements.'; }
    stage.width(mref.offsetWidth - theme.spacing.unit * 2);
    stage.height(mref.offsetHeight - theme.spacing.unit * 2);
    stage.draw();
    this.setState({didRender: true});
  }

  scroll = () => {
    const { node, setNode } = this.props;
    const { ks } = this.state;
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw 'Cannot find elements.'; }
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
        setNode(TreeNodeUtil._deleteFocus(node));
      }
    }
  }

  expand = (target: KWithArrow, open: boolean) => {
    const { node, setNode } = this.props;
    var newNode = TreeNodeUtil._open(node, target.id, open);
    setNode(newNode);
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

  changeRS = (rs: ReadingSetting) => {
    this.setState({rs});
    localStorage.setItem(keys.rs, JSON.stringify(rs));
  }

  reset = () => {
    this.setState({ks: defaultKS, ft: 'arrow', rs: defaultRS});
    localStorage.setItem(keys.ks, JSON.stringify(defaultKS));
    localStorage.setItem(keys.ft, JSON.stringify('arrow'));
    localStorage.setItem(keys.rs, JSON.stringify(defaultRS));
    process.nextTick(() => this.resize());
  }

  render() {
    const { node: tree, classes } = this.props;
    const {
      ks, ft, rs,
    } = this.state;
    const kTreeNode = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks);
    const node = KArrowUtil.setArrow(kTreeNode, ks);
    this.kTree = node;
    const flatNodes = TreeNodeUtil.toArrayWithoutClose(node);
    const rows = KTreeUtil.makeDragMap(flatNodes, ks);
    this.rows = rows;

    const nodeActionProps = {
      ks,
      ft,
      expand: (target: KWithArrow) => this.expand(target, !target.open)
    };

    const main = this.mainRef.current;
    const largeContainerStyle: React.CSSProperties | undefined = main !== null ? {
      position: 'relative',
      overflow: 'hidden',
      width: Math.max((node.self.w + ks.spr.w * 2) * ks.unit, main.offsetWidth),
      height: Math.max((node.self.h + ks.spr.h * 2) * ks.unit + marginBottom, main.offsetHeight),
    } : undefined;

    return (
      <div className={classes.root} ref={this.mainRef}>
        <div style={largeContainerStyle}>
          <Stage ref={this.stageRef}>
            <Layer>
              <Group ref={this.convergentRef}>
                {/* dragging */}
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