import * as React from 'react';
import {
  Theme, createStyles, WithStyles,
  Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Paper, createMuiTheme, MenuList, Typography,
} from '@material-ui/core';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import Add from '@material-ui/icons/Add';
import AddNext from '@material-ui/icons/Forward';

import { Stage, Layer } from 'react-konva';

import { Type, KTreeNode, DragRow, Point, baseKTreeNode, baseKWithArrow, KWithArrow, isSwitch, isTask, isCase } from '../../../data-types/tree';
import { Task, Switch, Case, Delete, More, Less } from '../../../settings/layout';

import TreeUtil from '../../../func/tree';
import TreeNodeUtil from '../../../func/tree-node';
import KTreeUtil from '../../../func/k-tree';
import { phrase } from '../../../settings/phrase';
import KNode from '../../../components/konva/k-node';
import Util from '../../../func/util';
import KArrowUtil from '../../../func/k-arrow';
import { theme, toolbarHeight } from '../../..';
import KShadow from '../../../components/konva/k-shadow';
import { KSState } from '../../../redux/states/ksState';
import { RSState } from '../../../redux/states/rsState';
import { CheckBox, CheckBoxOutlineBlank, Info } from '@material-ui/icons';
import InfoContentComponent, { InfoContentProps } from './info-content-component';
import KStart from '../../../components/konva/k-start';

const headerHeight = 96;

export const styles = (theme: Theme) => createStyles({
  main: {
    overflow: 'scroll',
    height: `calc(100vh - ${toolbarHeight + headerHeight + theme.spacing(2)}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarHeight + headerHeight + theme.spacing(4)}px)`,
    },
  },
  toolbar: theme.mixins.toolbar,

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
  node: KTreeNode;
  isEditing: boolean;
  edit: (node: KTreeNode) => void;
}

interface Props extends KSState, RSState, NodeEditorProps, WithStyles<typeof styles> { }

interface State {
  didRender: boolean;
  dragParent: KTreeNode | null;
  labelFocus: boolean;
  infoNode: KTreeNode | null;
  typeAnchorEl: any;
  deleteFlag: boolean;
  hasDifference: boolean;
}

export const marginBottom = 40;

class NodeEditorComponent extends React.Component<Props, State> {

  mainRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();

  labelRef = React.createRef<any>();
  actionMenuRef = React.createRef<any>();
  nextBrotherButtonRef = React.createRef<any>();


  kTree: KTreeNode;
  rows: DragRow[] | null = null;
  dropRow: number = 0;

  constructor(props: Props) {
    super(props);
    const state = NodeEditorComponent.getInitialState();
    this.state = state;
    const kTree = TreeUtil._get(props.node, baseKTreeNode);
    this.kTree = KTreeUtil.setCalcProps(kTree, props.ks, props.isEditing);
  }

  static getInitialState = (): State => {
    return {
      didRender: false,
      dragParent: null,
      labelFocus: false,
      infoNode: null,
      typeAnchorEl: null,
      deleteFlag: false,
      hasDifference: false,
    };
  }

  componentDidMount() {
    process.nextTick(() => {
      this.resize();
      this.addScrollEventListener();
      this.setState({ didRender: true });
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
    this.setState({ didRender: true });
  }

  scroll = () => {
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw new Error('Cannot find elements.'); }
    const dx = scrollContainer.scrollLeft;
    const dy = scrollContainer.scrollTop;
    stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    stage.x(-dx);
    stage.y(-dy);
    stage.draw();
  }

  scrollToNew = (result: { node: KTreeNode, newNode: KTreeNode }) => {
    const main = this.mainRef.current;
    const stage = this.stageRef.current;
    if (main === null || stage === null) { throw new Error('Cannot find elements.'); }

    const { isEditing, ks, edit } = this.props;
    var kTree = TreeUtil._get(result.node, baseKTreeNode);
    kTree = KTreeUtil.setCalcProps(kTree, ks, isEditing);
    const focusNode = TreeUtil._find(kTree, result.newNode.id)!;
    setTimeout(() => {
      edit(TreeNodeUtil._focus(kTree, result.newNode.id));
      this.setState({ labelFocus: true });
      process.nextTick(() => this.labelRef.current!.focus());
    }, 300);

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

      stage.to({ x: -dx, y: -dy, duration: 0.5, onFinish });
    }
  }

  expand = (target: KWithArrow) => {
    const { node, edit } = this.props;
    var newNode = TreeNodeUtil._open(node, target.id, !target.open);
    edit(newNode);
    process.nextTick(() => this.resize());
  }

  changeDraft = () => {
    const { node, edit } = this.props;
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    var newNode = TreeNodeUtil._changeDraft(node, focusNode.id, !focusNode.isDraft);
    edit(newNode);
    process.nextTick(() => this.resize());
  }

  openInfo = (target: KWithArrow) => {
    this.setState({ infoNode: target });
  }

  focus = (target: KTreeNode) => {
    const { node, rs, edit, isEditing } = this.props;
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

    if (!target.focus || !isEditing) {
      const newNode = TreeNodeUtil._focus(node, target.id);
      edit(newNode);
      this.setState({ labelFocus: false });
      process.nextTick(() => this.resize());
    } else {
      if (target.depth.top !== 0) {
        this.setState({ labelFocus: true });
        process.nextTick(() => this.labelRef.current!.focus());
      }
    }
  }

  deleteFocus = () => {
    const { node, edit } = this.props;
    edit(TreeNodeUtil._deleteFocus(node));
    this.setState({ labelFocus: false });
    process.nextTick(this.resize);
  }

  dragStart = (target: KTreeNode) => {
    const { node, edit } = this.props;
    const dragParent = TreeUtil._getPrent(node, target);
    var newNode = TreeNodeUtil._open(node, target.id, false);
    newNode = TreeNodeUtil._drag(newNode, target.id, true);
    newNode = TreeNodeUtil._deleteFocus(newNode);
    edit(newNode);
    this.setState({ dragParent, labelFocus: false });
  }

  dragMove = (target: KTreeNode, p: Point) => {
    const { node: tree, isEditing, ks, edit } = this.props;
    const { dragParent } = this.state;
    const pointX = Math.round(p.x / ks.unit + ks.rect.w / 2);
    const pointY = Math.round(p.y / ks.unit + ks.rect.h / 2);

    const rows = this.rows;
    const node = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks, isEditing);

    if (rows !== null && 0 <= pointX && pointX < node.self.w) {
      const row = rows[pointY];
      if (row === undefined || row.node.id === target.id) { return; }
      const closeTarget: KTreeNode = { ...target, open: false };
      if (isCase(target.type)) {
        if (row.action === 'moveToBrother' && dragParent!.children.find(c => c.id === row.node.id) !== undefined) {
          const newNode = TreeUtil.moveBrother(node, closeTarget, row.node);
          edit(TreeNodeUtil._drag(newNode, target.id, true));
          process.nextTick(this.resize);
        }
        return;
      }

      if (row.action === 'moveToBrother' && !isCase(row.node.type)) {
        const newNode = TreeUtil.moveBrother(node, closeTarget, row.node);
        edit(TreeNodeUtil._drag(newNode, target.id, true));
        process.nextTick(this.resize);
      }

      if (row.action === 'moveInOut') {
        const out = TreeUtil._find(row.node, target.id) === undefined;
        if (isTask(row.node.type) || (out && isCase(row.node.type)) || (!out && isSwitch(row.node.type))) {
          const newNode = TreeUtil.moveInOut(node, closeTarget, row.node);
          edit(TreeNodeUtil._drag(newNode, target.id, true));
        }
        process.nextTick(this.resize);
      }
    }
  }

  getCurrentTree = (): KTreeNode => {
    return this.kTree;
  }

  dragEnd = () => {
    const { node, edit } = this.props;
    var newNode = TreeNodeUtil._dragEnd(node);
    edit(newNode);
    this.setState({ dragParent: null });
  }

  changeFocusNode = (target: KTreeNode) => {
    const { node, edit } = this.props;
    const { infoNode } = this.state;
    edit(TreeUtil._replace(node, target));
    if (infoNode !== null) { this.setState({ infoNode: target }); }
  }

  changeType = (type: Type) => {
    const { node: tree } = this.props;
    this.setState({ typeAnchorEl: null });

    const node = TreeNodeUtil._getFocusNode(tree)!;
    if (node.type === type) { return; }

    if (node.children.length === 0) {
      const newNode = { ...node, type };
      this.changeFocusNode(newNode);
    }

    if (isTask(type)) {
      const children = node.children.map(c => c.children).reduce((a, b) => a.concat(b));
      const newNode = { ...node, type, children, open: true };
      this.changeFocusNode(newNode);
    } else {
      const newCase = TreeUtil.getNewNode(Type.switch, baseKWithArrow);
      const children = [
        {
          ...newCase,
          open: true,
          children: node.children.length === 0
            ? [{ ...baseKWithArrow, id: 'rand:' + String(Math.random()).slice(2) }]
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
    process.nextTick(this.resize);
  }

  addNextBrother = () => {
    const { node, edit } = this.props;
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    const addNextBrotherResult = TreeNodeUtil.addNextBrother(node, focusNode);
    edit(addNextBrotherResult.node);
    process.nextTick(() => { this.resize(); this.scrollToNew(addNextBrotherResult) });
  }

  deleteSelf = () => {
    const { node, edit } = this.props;
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    edit(TreeUtil._deleteById(node, focusNode.id));
    this.setState({ deleteFlag: false });
    process.nextTick(this.resize);
  }

  render() {
    const { node: tree, isEditing, ks, classes } = this.props;
    const {
      labelFocus, typeAnchorEl, infoNode, deleteFlag, dragParent,
    } = this.state;
    const node = KArrowUtil.setArrow(TreeUtil._get(tree, baseKWithArrow), ks);
    this.kTree = node;
    const flatNodes = TreeNodeUtil.toArrayWithoutClose(node);
    const rows = KTreeUtil.makeDragMap(flatNodes, ks);
    this.rows = rows;

    const stage = this.stageRef.current;
    const nodeActionProps = {
      isEditing,
      ks,
      focus: this.focus,
      expand: this.expand,
      dragStart: this.dragStart,
      dragMove: this.dragMove,
      getCurrentTree: this.getCurrentTree,
      dragEnd: this.dragEnd,
      openInfo: this.openInfo,
      deleteFocus: this.deleteFocus,
      stageRef: this.stageRef,
    };

    var ActionButtonBox: JSX.Element | undefined = undefined;
    var ImageBox: JSX.Element | undefined = undefined;
    var TypeButton: JSX.Element | undefined = undefined;
    var Label: JSX.Element | undefined = undefined;

    const focusNode = TreeNodeUtil._getFocusNode(node);
    if (focusNode) {

      if (!labelFocus && typeAnchorEl === null) {
        const isRoot = focusNode.depth.top === 0;
        const menu = this.actionMenuRef.current;
        const boxStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks!.rect.w) * ks.unit - 6 - (menu !== null ? menu.offsetWidth : 0),
          top: (focusNode!.point.y + ks.rect.h) * ks.unit - 4,
          backgroundColor: theme.palette.grey[800],
        };
        ActionButtonBox = (
          <MuiThemeProvider theme={createMuiTheme({ palette: { type: 'dark' } })}>
            <Paper ref={this.actionMenuRef} style={boxStyle}>
              <MenuList>
                <MenuItem onClick={() => this.openInfo(focusNode)}>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <Typography color="textPrimary">詳細表示</Typography>
                </MenuItem>

                {(isEditing || focusNode.children.length !== 0) && focusNode.depth.top !== 0 &&
                  <MenuItem onClick={() => this.expand(focusNode)}>
                    <ListItemIcon>
                      {!focusNode.open ? <More /> : <Less />}
                    </ListItemIcon>
                    <Typography color="textPrimary">{!focusNode.open ? '詳細項目を開く' : '詳細項目を閉じる'}</Typography>
                  </MenuItem>}

                {isEditing && <>
                  {!isRoot &&
                    <MenuItem ref={this.nextBrotherButtonRef} onClick={this.addNextBrother}>
                      <ListItemIcon>
                        <>
                          <AddNext style={{ transform: 'rotate(90deg)' }} />
                          <Add />
                        </>
                      </ListItemIcon>
                      <Typography color="textPrimary">次の項目を追加</Typography>
                    </MenuItem>}

                  <MenuItem onClick={this.addDetails}>
                    <ListItemIcon>
                      <>
                        <AddNext />
                        <Add />
                      </>
                    </ListItemIcon>
                    <Typography color="textPrimary">詳細項目を追加</Typography>
                  </MenuItem>

                  {false &&
                    <MenuItem onClick={this.changeDraft}>
                      <ListItemIcon>
                        {focusNode!.isDraft ? <CheckBox /> : <CheckBoxOutlineBlank />}
                      </ListItemIcon>
                      <Typography color="textPrimary">下書き</Typography>
                    </MenuItem>}

                  {!isRoot &&
                    <MenuItem onClick={() => this.setState({ deleteFlag: true })}>
                      <ListItemIcon>
                        <Delete />
                      </ListItemIcon>
                      <Typography color="textPrimary">削除</Typography>
                    </MenuItem>}
                </>}
              </MenuList>
            </Paper>
          </MuiThemeProvider>
        );
      }

      if (!labelFocus && typeAnchorEl === null && focusNode.imageBlob.length !== 0) {
        const boxStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks.rect.w) * ks.unit,
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

      if (focusNode.depth.top !== 0 && isEditing) {
        const buttonStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks.rect.h / 2) * ks.unit,
          top: (focusNode!.point.y + ks.rect.h / 2) * ks.unit,
          transform: `translate(-50%, -50%) scale(${ks.unit / 24})`,
          color: '#000',
        };
        TypeButton = (
          <div>
            <IconButton
              style={buttonStyle}
              onClick={e => this.setState({ typeAnchorEl: e.currentTarget })}
              disableRipple
              disabled={focusNode.depth.top === 0}
            >
              {isTask(focusNode.type) ? <Task /> : isSwitch(focusNode.type) ? <Switch style={{ transform: 'scale(1, -1)' }} /> : <Case />}
            </IconButton>
            <Menu
              anchorEl={typeAnchorEl}
              open={Boolean(typeAnchorEl)}
              onClose={() => {
                this.deleteFocus();
                this.setState({ typeAnchorEl: null });
              }}
            >
              {!isCase(focusNode.type) &&
                <MenuItem onClick={() => this.changeType(Type.task)}>
                  <ListItemIcon><Task /></ListItemIcon>
                  <ListItemText inset primary="作業" />
                </MenuItem>}
              {!isCase(focusNode.type) &&
                <MenuItem onClick={() => this.changeType(Type.switch)}>
                  <ListItemIcon><Switch style={{ transform: 'scale(1, -1)' }} /></ListItemIcon>
                  <ListItemText inset primary="分岐" />
                </MenuItem>}
              {isCase(focusNode.type) &&
                <MenuItem onClick={() => this.changeType(Type.case)}>
                  <ListItemIcon><Case /></ListItemIcon>
                  <ListItemText inset primary="条件" />
                </MenuItem>}
            </Menu>
          </div>
        );
      }

      (() => {
        const labelStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks.rect.h + ks.spr.w / 2) * ks.unit,
          top: (focusNode!.point.y + ks.rect.h / 2) * ks.unit,
          width: (ks.rect.w - (ks.rect.h * 3 + ks.spr.w)) * ks.unit,
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
            InputProps={{ style: fontSize }}
            placeholder={
              isTask(focusNode.type) ? phrase.placeholder.task :
                isSwitch(focusNode.type) ? phrase.placeholder.switch : phrase.placeholder.case
            }
            InputLabelProps={{ shrink: true }}
            value={focusNode.label}
            onChange={(e: any) => this.changeFocusNode({ ...focusNode!, label: e.target.value })}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                this.labelRef.current!.blur();
                this.setState({ labelFocus: false });
                process.nextTick(() => this.nextBrotherButtonRef.current!.focus());
              }
            }}
          />
        );
      })();
    }

    const main = this.mainRef.current;
    const largeContainerStyle: React.CSSProperties | undefined = main !== null ?
      {
        position: 'relative',
        overflow: 'hidden',
        width: Math.max((node.self.w + ks.spr.w * 2) * ks.unit, main.offsetWidth),
        height: Math.max((node.self.h + ks.spr.h * 2) * ks.unit + marginBottom, main.offsetHeight),
      } : undefined;

    const infoContentProps: InfoContentProps = {
      node: infoNode!,
      isEditing,
      changeNode: this.changeFocusNode,
    };

    return (
      <div className={classes.main} ref={this.mainRef}>
        <div style={largeContainerStyle}>
          <Stage ref={this.stageRef} onClick={this.deleteFocus}>
            <Layer>
              {stage !== null &&
                flatNodes
                  .filter(n => isEditing || !n.isDraft)
                  .map(n => {
                    return n.depth.top === 0
                      ? <KStart key={n.id} node={n} nowDragging={dragParent !== null} {...nodeActionProps} />
                      : <KShadow key={n.id + 'shadow'} node={n} labelFocus={labelFocus} {...nodeActionProps} />
                  })}

              {stage !== null &&
                flatNodes
                  .filter(n => isEditing ? (dragParent === null ? true : n.isDragging) : !n.isDraft)
                  .map(n => {
                    return n.depth.top === 0
                      ? <KStart key={n.id} node={n} nowDragging={dragParent !== null} {...nodeActionProps} />
                      : <KNode key={n.id} node={n} labelFocus={labelFocus} {...nodeActionProps} />
                  })}
              {/* <DragMap node={node} rows={rows} ks={ks} /> */}
              {/* <DropMap node={node} flatNodes={flatNodes} ks={ks}/> */}

            </Layer>
          </Stage>
          {ActionButtonBox}
          {ImageBox}
          {Label}
          {TypeButton}
        </div>

        <Dialog open={deleteFlag} onClose={() => this.setState({ deleteFlag: false })}>
          <DialogTitle>この項目を削除してもよろしいですか？</DialogTitle>
          {focusNode !== undefined && focusNode.children.length !== 0 &&
            <DialogContent>
              <DialogContentText>この項目には詳細項目が含まれています。削除してもよろしいですか？</DialogContentText>
            </DialogContent>}

          <DialogActions>
            <Button onClick={() => this.setState({ deleteFlag: false })}>キャンセル</Button>
            <Button onClick={this.deleteSelf} color="primary" autoFocus>削除</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={infoNode !== null} onClose={() => this.setState({ infoNode: null })} maxWidth="sm" fullWidth>
          {infoNode !== null && (
            <>
              <DialogTitle>{infoNode!.label}</DialogTitle>

              <DialogContent>
                <InfoContentComponent {...infoContentProps} />
              </DialogContent>

              <DialogActions>
                <Button color="primary" onClick={() => this.setState({ infoNode: null })}>OK</Button>
              </DialogActions>
            </>)}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(NodeEditorComponent);