import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
  Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Modal, Badge, TextField, Fab, Paper, MuiThemeProvider, createMuiTheme, 
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import AddNext from '@material-ui/icons/Forward';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, KTreeNode, DragRow, Point, Tree, baseKTreeNode, baseKWithArrow, baseTreeNode, KWithArrow } from '../../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, ks as defaultKS, rightPainWidth, Task, Switch, Case, Delete, More, Less } from '../../../../settings/layout';
import { rs as defaultRS } from '../../../../settings/reading';

import TreeUtil from '../../../../func/tree';
import TreeNodeUtil from '../../../../func/tree-node';
import KTreeUtil from '../../../../func/k-tree';
import KSize from '../../../../data-types/k-size';
import keys from '../../../../settings/storage-keys';
import ViewSettings, { ViewSettingProps } from '../../../../components/view-settings';
import { phrase } from '../../../../settings/phrase';
import ReadingSetting from '../../../../data-types/reading-settings';
import KNode from '../../../../components/konva/k-node';
import Util from '../../../../func/util';
import KArrowUtil from '../../../../func/k-arrow';
import { theme } from '../../../..';
import { NodeEditMode } from '../../../../data-types/node-edit-mode';
import { grey } from '@material-ui/core/colors';
import KMemo from '../../../../components/konva/k-memo';
import KShadow from '../../../../components/konva/k-shadow';


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
  mode: NodeEditMode;
  commons: Tree[];
  node: TreeNode;
  memoList: KTreeNode[];
  showViewSettings: boolean;
  edit: (node: TreeNode) => void;
  addMemo: (memo: KTreeNode) => void;
  editMemo: (memo: KTreeNode) => void;
  deleteMemo: (memo: KTreeNode) => void;
  closeViewSettings: () => void;
}

interface Props extends NodeEditorProps, WithStyles<typeof styles> {}

interface State {
  didRender: boolean;
  ks: KSize;
  ft: FlowType;
  rs: ReadingSetting;
  dragParent: TreeNode | null;
  dragMemo: KTreeNode | null;
  labelFocus: boolean;
  memoLabelFocus: KTreeNode | null;
  typeAnchorEl: any;
  deleteFlag: boolean;
  hasDifference: boolean;
  createBoxText: string;
}

export type FlowType = 'rect' | 'arrow';
export const flowType = {rect: 'rect', arrow: 'arrow'};
export const marginBottom = 40;

class NodeEditor extends React.Component<Props, State> {

  mainRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();
  convergentRef = React.createRef<any>();
  convergentShadowRef = React.createRef<any>();

  createBoxRef = React.createRef<HTMLDivElement>();
  labelRef = React.createRef<any>();
  memoLabelRef = React.createRef<any>();


  kTree: KTreeNode;
  rows: DragRow[] | null = null;
  dropRow: number = 0;

  constructor(props: Props) {
    super(props);
    const state = NodeEditor.getInitialState();
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
      dragParent: null,
      dragMemo: null,
      labelFocus: false,
      memoLabelFocus: null,
      typeAnchorEl: null,
      deleteFlag: false,
      hasDifference: false,
      createBoxText: '',
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
    const { mode, node, edit } = this.props;
    const { ks } = this.state;
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw 'Cannot find elements.'; }
    // canvasをmainと一致するよう移動
    const dx = scrollContainer.scrollLeft;
    const dy = scrollContainer.scrollTop;
    stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';

    if (mode !== 'c') {
      const createBox = this.createBoxRef.current;
      if (createBox === null) { throw 'Cannot find elements.'; }
      createBox.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    }

    const convergent = this.convergentRef.current;
    const convergentShadow = this.convergentShadowRef.current;
    if (convergent === null || convergentShadow === null) { return; }

    // convergent領域をスクロール
    convergent.x(-dx + (mode === 'dc' ? stage.width() / 2 : 0));
    convergent.y(-dy);
    convergentShadow.x(-dx + (mode === 'dc' ? stage.width() / 2 : 0));
    convergentShadow.y(-dy);
    stage.draw();

    const f = TreeNodeUtil._getFocusNode(this.kTree)!;
    if (f !== undefined) {
      if (f.point.x * ks.unit < dx || stage.width() / 2 + dx < (f.point.x + f.rect.w) * ks.unit) {
        edit(TreeNodeUtil._deleteFocus(node));
      }
    }
  }

  scrollToNew = (result: { node: TreeNode, newNode: TreeNode }) => {
    const main = this.mainRef.current;
    const stage = this.stageRef.current;
    if (main === null || stage === null) { throw 'Cannot find elements.'; }

    const { edit } = this.props;
    const { ks } = this.state;
    var  kTree = TreeUtil._get(result.node, baseKTreeNode);
    kTree = KTreeUtil.setCalcProps(kTree, ks);
    const focusNode = TreeUtil._find(kTree, result.newNode.id)!;
    if ((focusNode.point.y + ks.rect.h) * ks.unit < main.scrollTop + main.offsetHeight) {
      setTimeout(() => edit(TreeNodeUtil._focus(kTree, result.newNode.id)), 300);
      return;
    }
    const largeContainerHeight = (kTree.self.h + ks.spr.h * 2) * ks.unit + marginBottom;
    const maxScroll = largeContainerHeight - main.offsetHeight;

    const dx = main.scrollLeft;
    const dy = Math.min((focusNode.point.y + ks.rect.h * 2 + ks.margin.h) * ks.unit - main.offsetHeight, maxScroll);

    const onFinish = () => {
      main.scrollTop = dy;
      stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      edit(TreeNodeUtil._focus(kTree, result.newNode.id));
    };
    
    stage.to({x: -dx, y: -dy, duration: 1, onFinish});
  }

  expand = (target: KWithArrow, open: boolean) => {
    const { node, edit } = this.props;
    var newNode = TreeNodeUtil._open(node, target.id, open);
    edit(newNode);
    process.nextTick(() => this.resize());
  }

  focus = (target: KTreeNode) => {
    const { node, edit } = this.props;
    const { rs, ks } = this.state;
    if (!target.focus && rs.playOnClick) {
      const ssu = new SpeechSynthesisUtterance();
      ssu.text = !Util.isEmpty(target.label) ? target.label :
      target.type === 'task' ? phrase.empty.task :
      target.type === 'switch' ? phrase.empty.switch : phrase.empty.case;
      ssu.lang = 'ja-JP';
      ssu.rate = rs.rate;
      ssu.pitch = rs.pitch;
      speechSynthesis.cancel();
      speechSynthesis.speak(ssu);
    }

    const stage = this.stageRef.current!;
    const scrollContainer = this.mainRef.current!;
    const dx = scrollContainer.scrollLeft;
    const targetLeft = target.point.x * ks.unit;
    const targetRight = (target.point.x + target.rect.w) * ks.unit;
    if (targetLeft < dx || stage.width() / 2 + dx < targetRight) { return; }

    if (!target.focus) {
      const newNode = TreeNodeUtil._focus(node, target.id);
      edit(newNode);
      this.setState({labelFocus: false});
      process.nextTick(() => this.resize());
    } else {
      this.setState({labelFocus: true});
      process.nextTick(() => this.labelRef.current!.focus());
    }
  }

  focusMemo = (target: KTreeNode) => {
    console.log('focusMemo');
    const { memoLabelFocus } = this.state;
    const { rs } = this.state;
    if (!target.focus && rs.playOnClick) {
      const ssu = new SpeechSynthesisUtterance();
      ssu.text = !Util.isEmpty(target.label) ? target.label :
      target.type === 'task' ? phrase.empty.task :
      target.type === 'switch' ? phrase.empty.switch : phrase.empty.case;
      ssu.lang = 'ja-JP';
      ssu.rate = rs.rate;
      ssu.pitch = rs.pitch;
      speechSynthesis.cancel();
      speechSynthesis.speak(ssu);
    }
    const next = memoLabelFocus === null ? target : null;
    this.setState({memoLabelFocus: next});
    if (next !== null) { this.memoLabelRef.current!.focus() }
  }

  deleteFocus = () => {
    const { node, edit } = this.props;
    edit(TreeNodeUtil._deleteFocus(node));
    this.setState({labelFocus: false, memoLabelFocus: null});
    process.nextTick(() => this.resize());
  }

  dragStart = (target: KTreeNode) => {
    const { node, edit } = this.props;
    const dragParent = TreeUtil._getPrent(node, target);
    var newNode = TreeNodeUtil._open(node, target.id, false);
    newNode = TreeNodeUtil._drag(newNode, target.id, true);
    newNode = TreeNodeUtil._deleteFocus(newNode);
    edit(newNode);
    this.setState({dragParent, labelFocus: false});
  }

  dragMove = (target: KTreeNode, p: Point) => {
    const { node: tree, edit } = this.props;
    const {dragParent, ks} = this.state;
    const pointX = Math.round(p.x / ks.unit + ks.rect.w / 2);
    const pointY = Math.round(p.y / ks.unit + ks.rect.h / 2);

    const rows = this.rows;
    const node = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks);

    if (rows !== null && 0 <= pointX && pointX < node.self.w) {
      const row = rows[pointY];
      if (row === undefined || row.node.id === target.id) { return; }
        
        if (target.type === 'case') {
          if (row.action === 'moveToBrother' && dragParent!.children.find(c => c.id === row.node.id) !== undefined) {
            edit(TreeUtil.moveBrother(node, target, row.node));
            process.nextTick(() => this.resize());
          }
          if (row.action === 'moveInOut' && dragParent!.id === row.node.id) {
            edit(TreeUtil.moveInOut(node, target, row.node));
            process.nextTick(() => this.resize());
          }
          return;
        }

        if (row.action === 'moveToBrother' && row.node.type !== 'case') {
          edit(TreeUtil.moveBrother(node, target, row.node));
          process.nextTick(() => this.resize());
        }

        if (row.action === 'moveInOut') {
          const out = TreeUtil._find(row.node, target.id) === undefined;
          if (row.node.type === 'task' || (out && row.node.type === 'case') || (!out && row.node.type === 'switch')) {
            edit(TreeUtil.moveInOut(node, target, row.node));
          }
          process.nextTick(() => this.resize());
        }
    }
  }

  dragEnd = (target: KTreeNode, p: Point) => {
    const { mode, node, edit, addMemo } = this.props;
    const { ks } = this.state;
    if (mode === 'dc' && p.x < 0) {
      const scrollContainer = this.mainRef.current;
      const stage = this.stageRef.current;
      if (scrollContainer === null || stage === null) { throw 'Cannot find elements.'; }
      const dx = scrollContainer.scrollLeft;
      const dy = scrollContainer.scrollTop;
      var x = stage.width() / 2 - Math.max(-p.x, target.rect.w) - dx;
      if (stage.width() / 2 < x + target.rect.w * ks.unit) {
        x = stage.width() / 2 - target.rect.w * ks.unit;
      }
      const y = p.y - dy;
      addMemo({...target, point: {x, y}, isMemo: true});
      edit(TreeUtil._deleteById(node, target.id));
    }
  }

  dragAnimationEnd = () => {
    const { node, edit } = this.props;
    var newNode = TreeNodeUtil._dragEnd(node);
    edit(newNode);
    this.setState({dragParent: null});
  }

  dragStartMemo = (memo: KTreeNode) => {
    this.setState({dragMemo: memo, memoLabelFocus: null});
  }

  dragEndMemo = (memo: KTreeNode) => {

    const { mode, node: tree } = this.props;
    this.setState({dragMemo: null});
    const { ks } = this.state;
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw 'Cannot find elements.'; }
    
    if (mode === 'dc') {
      const memoX = memo.point.x + (memo.rect.w / 2 * ks.unit);
      if (stage.width() / 2 < memoX) {
        // node.point = scrollDelta + groupDelta + memo.point
        const scrollDelta = {x: scrollContainer.scrollLeft, y: scrollContainer.scrollTop};
        const groupDelta = {x: -stage.width() / 2, y: 0};
        this.dropRow = Math.round((scrollDelta.y + groupDelta.y + memo.point.y) / ks.unit);
        const kTreeNode = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks);
        const flatNodes = TreeNodeUtil.toArrayWithoutClose(kTreeNode);
        const rows = KTreeUtil.makeDropMap(flatNodes, ks);
        const row = rows[this.dropRow];

        if (row === undefined) { return this.keepMemo(memo); }
        if (row.action === 'insertBefore' && row.node.type === 'case')   { return this.keepMemo(memo); }
        if (row.action === 'insertNext'   && row.node.type === 'case')   { return this.keepMemo(memo); }
        if (row.action === 'insertLast'   && row.node.type === 'switch') { return this.keepMemo(memo); }
      
        var newKTreeNode;
        if (row.action === 'insertBefore') {
          newKTreeNode = TreeUtil._insert(kTreeNode, memo, row.node, false);
        } else if (row.action === 'insertNext') {
          newKTreeNode = TreeUtil._insert(kTreeNode, memo, row.node, true);
        } else {
          newKTreeNode = TreeUtil._push(kTreeNode, memo, row.node);
        }
        const newKTreeCalcedNode = KTreeUtil.setCalcProps(TreeUtil._get(newKTreeNode, baseKWithArrow), ks);
        const droppedTarget = TreeUtil._find(newKTreeCalcedNode, memo.id)!;
        // memo.point = node.point - scrollDelta - groupDelta
        const point = {
          x: droppedTarget.point.x * ks.unit - scrollDelta.x - groupDelta.x,
          y: droppedTarget.point.y * ks.unit - scrollDelta.y - groupDelta.y,
        };

        this.props.editMemo({...memo, point, isMemo: false});
        return;
      }
    }
    this.keepMemo(memo);
  }

  keepMemo = (memo: KTreeNode) => {
    const { mode } = this.props;
    const { ks } = this.state;
    const stage = this.stageRef.current;
    if (stage === null) { throw 'Cannot find elements.'; }

    const sw = stage.width(), rw = ks.rect.w * ks.unit;
    var x = memo.point.x * (mode === 'd' ? (1 - sw / (2 * (sw - rw))) : 1);
    const y = memo.point.y;

    if (x < 0) { x = 0; }
    if (sw / 2 < x + rw) { x = sw / 2 - rw; }

    this.props.editMemo({...memo, point: {x, y}});
  }

  moveToConvergent = (memo: KTreeNode) => {
    const { mode, node: tree, memoList, edit, deleteMemo } = this.props;
    if (memoList.find(m => m.id === memo.id) === undefined) { return; }
    const { ks } = this.state;
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw 'Cannot find elements.'; }
    if (mode === 'dc') {
      const kTreeNode = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks);
      const flatNodes = TreeNodeUtil.toArrayWithoutClose(kTreeNode);
      const rows = KTreeUtil.makeDropMap(flatNodes, ks);
      const row = rows[this.dropRow];
      
      if (row !== undefined) {
        if (row.action === 'insertBefore') { edit(TreeUtil._insert(tree, memo, row.node, false)); }
        if (row.action === 'insertNext') { edit(TreeUtil._insert(tree, memo, row.node, true)); }
        if (row.action === 'insertLast') { edit(TreeUtil._push(tree, memo, row.node)); }
        process.nextTick(() => this.resize());
        deleteMemo(memo);
      }
    }
  }

  changeFocusNode = (target: TreeNode) => {
    const { node, edit } = this.props;
    edit(TreeUtil._replace(node, target));
  }

  changeType = (type: Type) => {
    const { node: tree } = this.props;
    this.setState({typeAnchorEl: null});

    const node = TreeNodeUtil._getFocusNode(tree)!;
    if (node.type === type) { return; }

    if (node.children.length === 0) {
      const newNode = { ...node, type };
      this.changeFocusNode(newNode);
    }

    if (type === 'task') {
      const children = node.children.map(c => c.children).reduce((a, b) => a.concat(b));
      const newNode = { ...node, type, children, open: true };
      this.changeFocusNode(newNode);
    } else {
      const newCase = TreeUtil.getNewNode('switch', baseKWithArrow);
      const children = [{ ...newCase, children: node.children }];
      const newNode = { ...node, type, children, open: true };
      this.changeFocusNode(newNode);
    }
  };

  addDetails = () => {
    const { node, edit } = this.props;
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    const addDetailsNode = TreeNodeUtil.addDetails(node, focusNode);
    edit(addDetailsNode);
    process.nextTick(() => this.resize());
  }

  addNextBrother = () => {
    const { node, edit } = this.props;
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    const addNextBrotherResult = TreeNodeUtil.addNextBrother(node, focusNode);
    edit(addNextBrotherResult.node);
    process.nextTick(() => {this.resize(); this.scrollToNew(addNextBrotherResult)});
  }

  addFromCommon = (e: any) => {
    const { node, edit, commons } = this.props;
    const common = commons.find(c => c.id === e.target.value);
    if (common === undefined) { return; }
    
    const setIdCommon = TreeUtil._setId(common);
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    edit(TreeNodeUtil.addFromCommon(node, focusNode, setIdCommon, baseTreeNode));
    process.nextTick(() => this.resize());
  }

  registAsCommon = (target: TreeNode) => {
    // const { addNode} = this.props;
    // const newNode = TreeUtil._setId(target);
    // addNode(newNode);
  }

  deleteSelf = () => {
    const { node, edit } = this.props;
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    edit(TreeUtil._deleteById(node, focusNode.id));
    this.setState({deleteFlag: false});
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

  createMemo = () => {
    const { addMemo } = this.props;
    const { createBoxText, ks } = this.state;
    const newMemo = TreeUtil.getNewNode('task', baseKTreeNode);
    const stage = this.stageRef.current;
    if (stage === null) { throw 'Cannot find elements.'; }
    addMemo({
      ...newMemo,
      label: createBoxText,
      isMemo: true,
      point: {
        x: (stage.width() / 2 - ks.rect.w * ks.unit) * Math.random(),
        y: 50 + stage.height() * 4 / 5 * Math.random()
      },
      rect: ks.rect
    });
    this.setState({createBoxText: ''});
  }

  changeMemoLabel = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { editMemo } = this.props;
    const { memoLabelFocus } = this.state;
    const newMemo = {...memoLabelFocus!, label: e.target.value};
    this.setState({memoLabelFocus: newMemo});
    editMemo(newMemo);
  }

  render() {
    const { mode, node: tree, memoList, editMemo, showViewSettings, closeViewSettings, classes } = this.props;
    const {
      ks, ft, rs, labelFocus, memoLabelFocus, typeAnchorEl, deleteFlag, dragParent, dragMemo, createBoxText
    } = this.state;
    const kTreeNode = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks);
    const node = KArrowUtil.setArrow(kTreeNode, ks);
    this.kTree = node;
    const flatNodes = TreeNodeUtil.toArrayWithoutClose(node);
    const rows = KTreeUtil.makeDragMap(flatNodes, ks);
    this.rows = rows;

    const stage = this.stageRef.current;
    const nodeActionProps = {
      ks,
      ft,
      focus: this.focus,
      expand: (target: KWithArrow) => this.expand(target, !target.open),
      dragStart: this.dragStart,
      dragMove: this.dragMove,
      dragEnd: this.dragEnd,
      dragAnimationEnd: this.dragAnimationEnd,
      deleteFocus: this.deleteFocus
    };

    const memoActionProps = {
      ks,
      ft,
      mode,
      focus: this.focusMemo,
      dragStart: this.dragStartMemo,
      dragEnd: this.dragEndMemo,
      moveToConvergent: this.moveToConvergent,
    };

    const viewSettingProps: ViewSettingProps = {
      ks, ft, rs,
      changeKS: this.changeKS, changeFT: this.changeFT, changeRS: this.changeRS, reset: this.reset
    };
    var CreateBox:        JSX.Element | undefined = undefined;
    var ActionButtonBox:  JSX.Element | undefined = undefined;
    var TypeButton:       JSX.Element | undefined = undefined;
    var ExpandButton:     JSX.Element | undefined = undefined;
    var Label:            JSX.Element | undefined = undefined;
    var MemoLabel:        JSX.Element | undefined = undefined;

    if (mode !== 'c') {

      const boxPosition: React.CSSProperties | undefined = stage !== null ? {
        position: 'absolute',
        left: mode === 'd' ? stage.width() / 2 : mode === 'dc' ? stage.width() / 4 : stage.width() * 3 / 4,
        top: theme.spacing.unit * 2,
        transform: 'translateX(-50%)',
      } : undefined;

      const boxStyle: React.CSSProperties | undefined = stage !== null ? {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing.unit,
      } : undefined;

      CreateBox = (
        <div style={boxPosition}>
          <div ref={this.createBoxRef} style={boxStyle}>
            <TextField
              value={createBoxText}
              onChange={e => this.setState({createBoxText: e.target.value})}
              onKeyDown={e => {
                if (e.keyCode === 13) { this.createMemo(); }
              }}
            />
            <Button style={{marginLeft: theme.spacing.unit}} onClick={this.createMemo}>作成</Button>
          </div>
        </div>
      );
    }
    if (mode !== 'c' && memoLabelFocus !== null) {
      console.log(memoLabelFocus.point.x);
      const labelStyle: React.CSSProperties = {
        position: 'absolute',
        left: memoLabelFocus !== null ? memoLabelFocus.point.x + (ks.rect.h + ks.spr.w / 2) * ks.unit : 0,
        top:  memoLabelFocus !== null ? memoLabelFocus.point.y + (ks.rect.h / 2) * ks.unit : 0,
        width: (ks.rect.w - (ks.rect.h + ks.spr.w / 2) * 2) * ks.unit,
        transform: `translateY(-50%)`,
        display: memoLabelFocus !== null ? undefined : 'none',
      };
      const fontSize: React.CSSProperties = {
        fontSize: 18.2 / 20 * ks.unit
      };
      MemoLabel = (
        <TextField
          inputRef={this.memoLabelRef}
          style={labelStyle}
          InputProps={{style: fontSize}}
          InputLabelProps={{shrink: true}}
          value={memoLabelFocus !== null ? memoLabelFocus.label : ''}
          onChange={this.changeMemoLabel}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              this.memoLabelRef.current!.blur();
              this.setState({memoLabelFocus: null});
            }
          }}
        />
      );
    }

    const focusNode = TreeNodeUtil._getFocusNode(node);
    if (mode !== 'd' && focusNode) {

      if (!labelFocus && typeAnchorEl === null) {
        const isRoot = focusNode.depth.top === 0;
        const boxStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x) * ks.unit + 8 + (mode === 'dc' ? stage.width() / 2 : 0),
          top: (focusNode!.point.y + focusNode.rect.h) * ks.unit - 8,
          backgroundColor: theme.palette.grey[800],
        };
        ActionButtonBox = (
          <Paper style={boxStyle}>
            <MuiThemeProvider theme={createMuiTheme({typography: {useNextVariants: true}, palette: {type: 'dark'}})}>
              {!isRoot && <Button onClick={this.addNextBrother}>
                次の項目を追加<AddNext style={{transform: 'rotate(90deg)'}} /><Add/>
              </Button>}
              <Button onClick={this.addDetails}>
                詳細項目を追加<AddNext/><Add/>
              </Button>
              {!isRoot && <Button onClick={() => focusNode.children.length === 0 ? this.deleteSelf() : this.setState({deleteFlag: true})}>
                削除<Delete/>
              </Button>}
            </MuiThemeProvider>
          </Paper>
        );
      }

      (() => {
        const buttonStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks.rect.h / 2) * ks.unit + (mode === 'dc' ? stage.width() / 2 : 0),
          top:  (focusNode!.point.y + ks.rect.h / 2) * ks.unit,
          transform: `translate(-50%, -50%) scale(${ks.unit / 24})`,
          color: '#000',
        };
        TypeButton = (
          <div>
            <IconButton style={buttonStyle} onClick={e => this.setState({typeAnchorEl: e.currentTarget})} disableRipple>
              {focusNode.type === 'task' ? <Task/> : focusNode.type === 'switch' ? <Switch style={{transform: 'scale(1, -1)'}}/> : <Case/>}
            </IconButton>
            <Menu
              anchorEl={typeAnchorEl}
              open={Boolean(typeAnchorEl)}
              onClose={() => {
                this.deleteFocus();
                this.setState({typeAnchorEl: null});
              }}
            >
              {focusNode.type !== 'case' &&
              <MenuItem onClick={() => this.changeType('task')}>
                <ListItemIcon><Task/></ListItemIcon>
                <ListItemText inset primary="作業"/>
              </MenuItem>}
              {focusNode.type !== 'case' &&
              <MenuItem onClick={() => this.changeType('switch')}>
                <ListItemIcon><Switch style={{transform: 'scale(1, -1)'}}/></ListItemIcon>
                <ListItemText inset primary="分岐"/>
              </MenuItem>}
              {focusNode.type === 'case' &&
              <MenuItem onClick={() => this.changeType('case')}>
                <ListItemIcon><Case/></ListItemIcon>
                <ListItemText inset primary="条件"/>
              </MenuItem>}
            </Menu>
          </div>
        );
      })();

      (() => {
        const buttonStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks.rect.w - ks.rect.h / 2) * ks.unit + (mode === 'dc' ? stage.width() / 2 : 0),
          top:  (focusNode!.point.y + ks.rect.h / 2) * ks.unit,
          transform: `translate(-50%, -50%) scale(${ks.unit / 24})`,
          color: '#000',
        };
        ExpandButton = (
          <IconButton style={buttonStyle} onClick={() => this.expand(focusNode, !focusNode.open)} disableRipple>
            {!focusNode.open ? <More/> : <Less/>}
          </IconButton>
        );
      })();

      (() => {
        const labelStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks.rect.h + ks.spr.w / 2) * ks.unit + (mode === 'dc' ? stage.width() / 2 : 0),
          top:  (focusNode!.point.y + ks.rect.h / 2) * ks.unit,
          width: (ks.rect.w - (ks.rect.h + ks.spr.w / 2) * 2) * ks.unit,
          transform: `translateY(-50%)`,
          display: labelFocus ? undefined : 'none',
        };
        const fontSize: React.CSSProperties = {
          fontSize: 18.2 / 20 * ks.unit
        };
        Label = (
          <TextField
            inputRef={this.labelRef}
            style={labelStyle}
            InputProps={{style: fontSize}}
            placeholder={
              focusNode.type === 'task' ? phrase.placeholder.task :
              focusNode.type === 'switch' ? phrase.placeholder.switch : phrase.placeholder.case
            }
            InputLabelProps={{shrink: true}}
            value={focusNode.label}
            onChange={(e: any) => this.changeFocusNode({ ...focusNode!, label: e.target.value })}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                this.labelRef.current!.blur();
                this.setState({labelFocus: false});
              }
            }}
          />
        );
      })();
    }

    const main = this.mainRef.current;
    const largeContainerStyle: React.CSSProperties | undefined = main !== null ?
    mode !== 'd' ? {
      position: 'relative',
      overflow: 'hidden',
      width: Math.max((node.self.w + ks.spr.w * 2) * ks.unit + (mode === 'dc' ? stage.width() / 2 : 0), main.offsetWidth),
      height: Math.max((node.self.h + ks.spr.h * 2) * ks.unit + marginBottom, main.offsetHeight),
    } :{
      position: 'relative',
      overflow: 'hidden',
      width: main.offsetWidth,
      height: main.offsetHeight,
    } : undefined;
    const divergentContainerRectProps = stage !== null ? {
      x: 0,
      y: 0,
      width: mode !== 'd' ? stage.width() / 2 : stage.width(),
      height: stage.height(),
      fill: theme.palette.background.default,
    } : undefined;

    const sw = stage !== null ? stage.width() : 0, rw = ks.rect.w * ks.unit;

    const MemoGroup = (
      <Group>
        <Rect {...divergentContainerRectProps}/>
        {memoList.filter(m => dragMemo !== null && dragMemo.id !== m.id)
        .map(m => ({...m, point: {x: m.point.x * (mode === 'd' ? (1 + sw / (sw - 2 * rw)) : 1) , y: m.point.y}}))
        .map(n => <KMemo key={n.id} node={n} labelFocus={memoLabelFocus !== null && memoLabelFocus.id === n.id} {...memoActionProps}/>)}
        {memoList.filter(m => dragMemo === null || dragMemo.id === m.id)
        .map(m => ({...m, point: {x: m.point.x * (mode === 'd' ? (1 + sw / (sw - 2 * rw)) : 1) , y: m.point.y}}))
        .map(n => <KMemo key={n.id} node={n} labelFocus={memoLabelFocus !== null && memoLabelFocus.id === n.id} {...memoActionProps}/>)}
      </Group>);

    return (
      <div className={classes.root} ref={this.mainRef}>
          <div style={largeContainerStyle}>
            <Stage ref={this.stageRef} onClick={this.deleteFocus}>
              <Layer>
                {mode !== 'd' && stage !== null && (
                <Group ref={this.convergentShadowRef} x={mode === 'dc' ? stage.width() / 2 : 0}>
                  {/* shadow */}
                  {flatNodes
                  .filter(n => dragParent !== null && !n.isDragging)
                  .map(n => <KShadow key={n.id} node={n} labelFocus={labelFocus} {...nodeActionProps}/>)}
                </Group>)}

                {mode !== 'c' && dragParent !== null && MemoGroup}
                
                {mode !== 'd' && stage !== null && (
                <Group ref={this.convergentRef} x={mode === 'dc' ? stage.width() / 2 : 0}>
                  {/* dragging */}
                  {flatNodes
                  .filter(n => dragParent === null ? true : n.isDragging)
                  .map(n => <KNode key={n.id} mode={mode} node={n} labelFocus={labelFocus} {...nodeActionProps}/>)}
                  {/* <DragMapForTree node={node} rows={rows} ks={ks} /> */}
                  {/* <DropMap node={node} flatNodes={flatNodes} ks={ks}/> */}
                </Group>)}
                {mode === 'dc' && stage !== null && (
                <Rect
                  x={stage.width() / 2}
                  y={0}
                  width={2}
                  height={stage.height()}
                  fill={grey[300]}
                />)}
                {mode !== 'c' && dragParent === null && MemoGroup}
              </Layer>
            </Stage>
            {CreateBox}
            {ActionButtonBox}
            {Label}
            {TypeButton}
            {ExpandButton}
            {MemoLabel}
          </div>

          <Dialog open={deleteFlag} onClose={() => this.setState({deleteFlag: false})}>
            <DialogTitle>この項目を削除してもよろしいですか？</DialogTitle>
            {focusNode !== undefined && focusNode.children.length !== 0 &&
            <DialogContent>
              <DialogContentText>この項目には詳細項目が含まれています。削除してもよろしいですか？</DialogContentText>
            </DialogContent>}
            
            <DialogActions>
              <Button onClick={() => this.setState({deleteFlag: false})}>キャンセル</Button>
              <Button onClick={this.deleteSelf} color="primary" autoFocus>削除</Button>
            </DialogActions>
          </Dialog>
          
          <Modal
            open={showViewSettings}
            onClose={closeViewSettings}
            BackdropProps={{className: classes.viewSettingModal}}
            disableAutoFocus
          >
            <ViewSettings {...viewSettingProps}/>
          </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(NodeEditor);