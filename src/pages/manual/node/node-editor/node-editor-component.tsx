import * as React from 'react';
import {
  Theme, createStyles, WithStyles,
  Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Paper, createMuiTheme, 
} from '@material-ui/core';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import Add from '@material-ui/icons/Add';
import AddNext from '@material-ui/icons/Forward';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, KTreeNode, DragRow, Point, baseKTreeNode, baseKWithArrow,  KWithArrow, isSwitch, isTask, isCase } from '../../../../data-types/tree';
import { toolbarHeight, toolbarMinHeight, Task, Switch, Case, Delete, More, Less } from '../../../../settings/layout';

import TreeUtil from '../../../../func/tree';
import TreeNodeUtil from '../../../../func/tree-node';
import KTreeUtil from '../../../../func/k-tree';
import { phrase } from '../../../../settings/phrase';
import KNode from '../../../../components/konva/k-node';
import Util from '../../../../func/util';
import KArrowUtil from '../../../../func/k-arrow';
import { theme } from '../../../..';
import { NodeEditMode } from '../../../../data-types/node-edit-mode';
import { grey } from '@material-ui/core/colors';
import KMemo from '../../../../components/konva/k-memo';
import KShadow from '../../../../components/konva/k-shadow';
import { KSState } from '../../../../redux/states/ksState';
import { RSState } from '../../../../redux/states/rsState';

export const styles = (theme: Theme) => createStyles({
  root: {
    overflow: 'scroll',
    height: `calc(100vh - ${toolbarHeight + toolbarMinHeight * 2}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight * 3}px)`,
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
  saveButton: {
    minWidth: 100,
  },
  extendedIcon: {
    marginLeft: theme.spacing(1),
  },
  viewSettingModal: {
    backgroundColor: '#0002',
  },
  img: {
    width: '100%',
    height: 400,
    objectFit: 'contain',
    verticalAlign: 'bottom',
  },
});

export interface NodeEditorProps {
  mode: NodeEditMode;
  node: TreeNode;
  memos: KTreeNode[];
  edit: (node: TreeNode) => void;
  addMemo: (memo: KTreeNode) => void;
  editMemo: (memo: KTreeNode) => void;
  deleteMemo: (memo: KTreeNode) => void;
}

interface Props extends KSState, RSState, NodeEditorProps, WithStyles<typeof styles> {}

interface State {
  didRender: boolean;
  dragParent: TreeNode | null;
  dragMemo: KTreeNode | null;
  labelFocus: boolean;
  memoLabelFocus: KTreeNode | null;
  typeAnchorEl: any;
  deleteFlag: boolean;
  hasDifference: boolean;
  createBoxText: string;
}

export const marginBottom = 40;

class NodeEditorComponent extends React.Component<Props, State> {

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
    const state = NodeEditorComponent.getInitialState();
    this.state = state;
    const kTree = TreeUtil._get(props.node, baseKTreeNode);
    this.kTree = KTreeUtil.setCalcProps(kTree, props.ks);
  }

  static getInitialState = (): State => {
    return {
      didRender: false,
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
    if (scrollContainer === null) { throw new Error('Cannot find elements.'); }
    scrollContainer.addEventListener('scroll', this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    const scrollContainer = this.mainRef.current;
    if (scrollContainer === null) { throw new Error('Cannot find elements.'); }
    scrollContainer.removeEventListener('scroll', this.scroll);
  }

  resize = () => {
    const mref = this.mainRef.current;
    const stage = this.stageRef.current;
    if (mref === null || stage === null) { throw new Error('Cannot find elements.'); }
    stage.width(mref.offsetWidth - theme.spacing(2));
    stage.height(mref.offsetHeight - theme.spacing(2));
    stage.draw();
    this.setState({didRender: true});
  }

  scroll = () => {
    const { mode, node, ks, edit } = this.props;
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw new Error('Cannot find elements.'); }
    // canvasをmainと一致するよう移動
    const dx = scrollContainer.scrollLeft;
    const dy = scrollContainer.scrollTop;
    stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';

    if (mode !== 'c') {
      const createBox = this.createBoxRef.current;
      if (createBox === null) { throw new Error('Cannot find elements.'); }
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
    if (main === null || stage === null) { throw new Error('Cannot find elements.'); }

    const { mode, ks, edit } = this.props;
    var  kTree = TreeUtil._get(result.node, baseKTreeNode);
    kTree = KTreeUtil.setCalcProps(kTree, ks);
    const focusNode = TreeUtil._find(kTree, result.newNode.id)!;
    setTimeout(() => edit(TreeNodeUtil._focus(kTree, result.newNode.id)), 300);

    if (main.scrollTop + main.offsetHeight < (focusNode.point.y + ks.rect.h) * ks.unit) {
      const largeContainerHeight = (kTree.self.h + ks.spr.h * 2) * ks.unit + marginBottom;
      const maxScroll = largeContainerHeight - main.offsetHeight;

      const dx = main.scrollLeft;
      const dy = Math.min((focusNode.point.y + ks.rect.h * 2 + ks.margin.h) * ks.unit - main.offsetHeight, maxScroll);

      const onFinish = () => {
        main.scrollTop = dy;
        stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        edit(TreeNodeUtil._focus(kTree, result.newNode.id));
      };
      const convergent = this.convergentRef.current;
      const convergentShadow = this.convergentShadowRef.current;
      if (convergent === null || convergentShadow === null) { return; }
      convergent.to({x: -dx + (mode === 'dc' ? stage.width() / 2 : 0), y: -dy, duration: 0.5, onFinish});
      convergentShadow.to({x: -dx + (mode === 'dc' ? stage.width() / 2 : 0), y: -dy, duration: 0.5});
    }
  }

  expand = (target: KWithArrow, open: boolean) => {
    const { node, edit } = this.props;
    var newNode = TreeNodeUtil._open(node, target.id, open);
    edit(newNode);
    process.nextTick(() => this.resize());
  }

  focus = (target: KTreeNode) => {
    const { node, rs, edit } = this.props;
    if (!target.focus && rs.playOnClick) {
      const ssu = new SpeechSynthesisUtterance();
      ssu.text = !Util.isEmpty(target.label) ? target.label :
      isTask(target.type) ? phrase.empty.task :
      isSwitch(target.type) ? phrase.empty.switch : phrase.empty.case;
      ssu.lang = 'ja-JP';
      ssu.rate = rs.rate;
      ssu.pitch = rs.pitch;
      speechSynthesis.cancel();
      speechSynthesis.speak(ssu);
    }

    if (!target.focus) {
      const newNode = TreeNodeUtil._focus(node, target.id);
      edit(newNode);
      this.setState({labelFocus: false});
      process.nextTick(() => this.resize());
    } else {
      if (target.depth.top !== 0) {
        this.setState({labelFocus: true});
        process.nextTick(() => this.labelRef.current!.focus());
      }
    }
  }

  focusMemo = (target: KTreeNode) => {
    const { rs } = this.props;
    const { memoLabelFocus } = this.state;
    if (!target.focus && rs.playOnClick) {
      const ssu = new SpeechSynthesisUtterance();
      ssu.text = !Util.isEmpty(target.label) ? target.label :
      isTask(target.type) ? phrase.empty.task :
      isSwitch(target.type) ? phrase.empty.switch : phrase.empty.case;
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
    const { node: tree, ks, edit } = this.props;
    const {dragParent} = this.state;
    const pointX = Math.round(p.x / ks.unit + ks.rect.w / 2);
    const pointY = Math.round(p.y / ks.unit + ks.rect.h / 2);

    const rows = this.rows;
    const node = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks);

    if (rows !== null && 0 <= pointX && pointX < node.self.w) {
      const row = rows[pointY];
      if (row === undefined || row.node.id === target.id) { return; }
        
        if (isCase(target.type)) {
          if (row.action === 'moveToBrother' && dragParent!.children.find(c => c.id === row.node.id) !== undefined) {
            edit(TreeUtil.moveBrother(node, target, row.node));
            process.nextTick(() => this.resize());
          }
          return;
        }

        if (row.action === 'moveToBrother' && !isCase(row.node.type)) {
          edit(TreeUtil.moveBrother(node, target, row.node));
          process.nextTick(() => this.resize());
        }

        if (row.action === 'moveInOut') {
          const out = TreeUtil._find(row.node, target.id) === undefined;
          if (isTask(row.node.type) || (out && isCase(row.node.type)) || (!out && isSwitch(row.node.type))) {
            edit(TreeUtil.moveInOut(node, target, row.node));
          }
          process.nextTick(() => this.resize());
        }
    }
  }

  dragEnd = (target: KTreeNode, p: Point) => {
    const { mode, node, ks, edit, addMemo } = this.props;
    if (mode === 'dc' && p.x < 0) {
      const scrollContainer = this.mainRef.current;
      const stage = this.stageRef.current;
      if (scrollContainer === null || stage === null) { throw new Error('Cannot find elements.'); }
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

    const { mode, node: tree, ks } = this.props;
    this.setState({dragMemo: null});
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw new Error('Cannot find elements.'); }
    
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
        if (row.action === 'insertBefore' && isCase(row.node.type))   { return this.keepMemo(memo); }
        if (row.action === 'insertNext'   && isCase(row.node.type))   { return this.keepMemo(memo); }
        if (row.action === 'insertLast'   && isSwitch(row.node.type)) { return this.keepMemo(memo); }
      
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
    const { mode, ks } = this.props;
    const stage = this.stageRef.current;
    if (stage === null) { throw new Error('Cannot find elements.'); }

    const sw = stage.width(), rw = ks.rect.w * ks.unit;
    var x = memo.point.x * (mode === 'd' ? (1 - sw / (2 * (sw - rw))) : 1);
    const y = memo.point.y;

    if (x < 0) { x = 0; }
    if (sw / 2 < x + rw) { x = sw / 2 - rw; }

    this.props.editMemo({...memo, point: {x, y}});
  }

  moveToConvergent = (memo: KTreeNode) => {
    const { mode, node: tree, memos, ks, edit, deleteMemo } = this.props;
    if (memos.find(m => m.id === memo.id) === undefined) { return; }
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw new Error('Cannot find elements.'); }
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

    if (isTask(type)) {
      console.log('task')
      const children = node.children.map(c => c.children).reduce((a, b) => a.concat(b));
      const newNode = { ...node, type, children, open: true };
      this.changeFocusNode(newNode);
    } else {
      console.log('not task')
      const newCase = TreeUtil.getNewNode(Type.switch, baseKWithArrow);
      const children = [
        {
          ...newCase,
          open: true,
          children: node.children.length === 0
            ? [{...baseKWithArrow, id: 'rand:' + String(Math.random()).slice(2)}]
            : node.children
        }
      ];
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

  deleteSelf = () => {
    const { node, edit } = this.props;
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    edit(TreeUtil._deleteById(node, focusNode.id));
    this.setState({deleteFlag: false});
    process.nextTick(() => this.resize());
  }

  createMemo = () => {
    const { ks, addMemo } = this.props;
    const { createBoxText } = this.state;
    const newMemo = TreeUtil.getNewNode(Type.task, baseKTreeNode);
    const stage = this.stageRef.current;
    if (stage === null) { throw new Error('Cannot find elements.'); }
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
    const { mode, node: tree, memos, ks, classes } = this.props;
    const {
      labelFocus, memoLabelFocus, typeAnchorEl, deleteFlag, dragParent, dragMemo, createBoxText
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
      mode,
      focus: this.focusMemo,
      dragStart: this.dragStartMemo,
      dragEnd: this.dragEndMemo,
      moveToConvergent: this.moveToConvergent,
    };

    var CreateBox:        JSX.Element | undefined = undefined;
    var ActionButtonBox:  JSX.Element | undefined = undefined;
    var ImageBox:         JSX.Element | undefined = undefined;
    var TypeButton:       JSX.Element | undefined = undefined;
    var ExpandButton:     JSX.Element | undefined = undefined;
    var Label:            JSX.Element | undefined = undefined;
    var MemoLabel:        JSX.Element | undefined = undefined;

    if (mode !== 'c') {

      const boxPosition: React.CSSProperties | undefined = stage !== null ? {
        position: 'absolute',
        left: mode === 'd' ? stage.width() / 2 : mode === 'dc' ? stage.width() / 4 : stage.width() * 3 / 4,
        top: theme.spacing(2),
        transform: 'translateX(-50%)',
      } : undefined;

      const boxStyle: React.CSSProperties | undefined = stage !== null ? {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(1),
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
            <Button style={{marginLeft: theme.spacing(1)}} onClick={this.createMemo}>作成</Button>
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
            <MuiThemeProvider theme={createMuiTheme({palette: {type: 'dark'}})}>
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

      if (!labelFocus && typeAnchorEl === null && focusNode.imageBlob.length !== 0) {
        const boxStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks.rect.w) * ks.unit + (mode === 'dc' ? stage.width() / 2 : 0),
          top: (focusNode!.point.y) * ks.unit,
          width: '400px',
          height: '400px',
        };
        ImageBox = (
          <div style={boxStyle}>
            <img src={focusNode.imageBlob} className={classes.img} alt={focusNode.imageName} />
          </div>
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
            <IconButton
              style={buttonStyle}
              onClick={e => this.setState({typeAnchorEl: e.currentTarget})}
              disableRipple
              disabled={focusNode.depth.top === 0}
            >
              {isTask(focusNode.type) ? <Task/> : isSwitch(focusNode.type) ? <Switch style={{transform: 'scale(1, -1)'}}/> : <Case/>}
            </IconButton>
            <Menu
              anchorEl={typeAnchorEl}
              open={Boolean(typeAnchorEl)}
              onClose={() => {
                this.deleteFocus();
                this.setState({typeAnchorEl: null});
              }}
            >
              {!isCase(focusNode.type) &&
              <MenuItem onClick={() => this.changeType(Type.task)}>
                <ListItemIcon><Task/></ListItemIcon>
                <ListItemText inset primary="作業"/>
              </MenuItem>}
              {!isCase(focusNode.type) &&
              <MenuItem onClick={() => this.changeType(Type.switch)}>
                <ListItemIcon><Switch style={{transform: 'scale(1, -1)'}}/></ListItemIcon>
                <ListItemText inset primary="分岐"/>
              </MenuItem>}
              {isCase(focusNode.type) &&
              <MenuItem onClick={() => this.changeType(Type.case)}>
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
            variant="standard"
            InputProps={{style: fontSize}}
            placeholder={
              isTask(focusNode.type) ? phrase.placeholder.task :
              isSwitch(focusNode.type) ? phrase.placeholder.switch : phrase.placeholder.case
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
        {memos.filter(m => dragMemo !== null && dragMemo.id !== m.id)
        .map(m => ({...m, point: {x: m.point.x * (mode === 'd' ? (1 + sw / (sw - 2 * rw)) : 1) , y: m.point.y}}))
        .map(n => <KMemo key={n.id} node={n} labelFocus={memoLabelFocus !== null && memoLabelFocus.id === n.id} {...memoActionProps}/>)}
        {memos.filter(m => dragMemo === null || dragMemo.id === m.id)
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
                {/* <DragMap node={node} rows={rows} ks={ks} /> */}
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
          {ImageBox}
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
      </div>
    );
  }
}

export default withStyles(styles)(NodeEditorComponent);