import _ from 'lodash';
import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
  Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Modal, Badge, TextField, Fab, Paper, MuiThemeProvider, createMuiTheme, 
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import ViewSettingsIcon from '@material-ui/icons/Settings';
import AddNext from '@material-ui/icons/Forward';

import Konva from 'konva';
import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, KTreeNode, Cell, Point, Tree, baseKTreeNode, baseKWithArrow, baseTreeNode, KWithArrow } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, ks as defaultKS, rightPainWidth, Task, Switch, Case, Delete, More, Less } from '../../../settings/layout';
import { rs as defaultRS } from '../../../settings/reading';

import TreeUtil from '../../../func/tree';
import TreeNodeUtil from '../../../func/tree-node';
import KTreeUtil from '../../../func/k-tree';
import KSize from '../../../data-types/k-size';
import keys from '../../../settings/storage-keys';
import ViewSettings, { ViewSettingProps } from './view-settings';
import { phrase } from '../../../settings/phrase';
import ReadingSetting from '../../../data-types/reading-settings';
import KNode from '../../../components/konva/k-node';
import Util from '../../../func/util';
import KArrowUtil from '../../../func/k-arrow';
import { theme } from '../../..';


const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  toolbar: theme.mixins.toolbar,
  main: {
    overflow: 'scroll',
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
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
  commonNodes: Tree[];
  node: TreeNode;
  edit: (node: TreeNode) => void;
  addNode: (node: Tree) => void;
}

interface Props extends NodeEditorProps, WithStyles<typeof styles> {}

interface State {
  ks: KSize;
  ft: FlowType;
  rs: ReadingSetting;
  beforeCell: Cell | null;
  dragParent: TreeNode | null;
  labelFocus: boolean;
  typeAnchorEl: any;
  deleteFlag: boolean;
  hasDifference: boolean;
  showViewSettings: boolean;
}

export type FlowType = 'rect' | 'arrow';
export const flowType = {rect: 'rect', arrow: 'arrow'};
export const sp = {x: 16, y: 16};

class NodeEditor extends React.Component<Props, State> {

  mainRef = React.createRef<HTMLMainElement>();
  stageRef = React.createRef<any>();
  labelRef = React.createRef<any>();

  kTree: KTreeNode;
  map: Cell[][] | null = null; 

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
      ks,
      ft,
      rs,
      beforeCell: null,
      dragParent: null,
      labelFocus: false,
      typeAnchorEl: null,
      deleteFlag: false,
      hasDifference: false,
      showViewSettings: false,
    };
  }
  
  componentDidMount() {
    process.nextTick(() => {
      this.resize();
      this.addScrollEventListener();
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
    stage.width(mref.offsetWidth);
    stage.height(mref.offsetHeight);
    stage.draw();
  }

  scroll = () => {
    const scrollContainer = this.mainRef.current;
    const stage = this.stageRef.current;
    if (scrollContainer === null || stage === null) { throw 'Cannot find elements.'; }
    const dx = scrollContainer.scrollLeft;
    const dy = scrollContainer.scrollTop;
    stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    stage.x(-dx);
    stage.y(-dy);
    stage.batchDraw();
  }

  scrollToNew = (node: TreeNode) => {
    const main = this.mainRef.current;
    const stage = this.stageRef.current;
    if (main === null || stage === null) { throw 'Cannot find elements.'; }

    const { ks } = this.state;
    var  kTree = TreeUtil._get(node, baseKTreeNode);
    kTree = KTreeUtil.setCalcProps(kTree, ks);
    const focusNode = TreeNodeUtil._getFocusNode(kTree)!;
    if (sp.y + (focusNode.point.y + ks.rect.h) * ks.unit < main.scrollTop + main.offsetHeight) { return; }
    const maxScroll = sp.y + (kTree.self.h + ks.spr.h * 2) * ks.unit - main.offsetHeight;

    const dx = main.scrollLeft;
    const dy = Math.min(sp.y + (focusNode.point.y + ks.rect.h * 2 + ks.margin.h) * ks.unit - main.offsetHeight, maxScroll);
    
    const onFinish = () => {
      main.scrollTop = dy;
      stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    };
    
    stage.to({x: -dx, y: -dy, duration: 1, onFinish});
  }

  expand = (target: KWithArrow, open: boolean) => {
    const { node, edit } = this.props;
    var newNode = TreeNodeUtil._open(node, target.id, open);
    // if (open) {
    //   newNode = TreeNodeUtil._deleteFocus(newNode);
    //   newNode = TreeNodeUtil._focus(newNode, target.id);
    //   const focusNode: KWithArrow = {...target, open};
    //   this.setState({focusNode});
    // }
    edit(newNode);
    process.nextTick(() => this.resize());
  }

  focus = (target: KWithArrow) => {
    const { node, edit } = this.props;
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
    if (!target.focus) {
      const newNode = TreeNodeUtil._focus(node, target.id);
      edit(newNode);
      this.setState({labelFocus: false});
      process.nextTick(() => this.resize());
    } else {
      process.nextTick(() => this.labelRef.current!.focus());
      this.setState({labelFocus: true});
    }
  }

  deleteFocus = () => {
    const { node, edit } = this.props;
    edit(TreeNodeUtil._deleteFocus(node));
    this.setState({labelFocus: false});
    process.nextTick(() => this.resize());
  }

  dragStart = (target: KTreeNode) => {
    const { node, edit } = this.props;
    const dragParent = TreeUtil._getPrent(node, target);
    var newNode = TreeNodeUtil._open(node, target.id, false);
    newNode = TreeNodeUtil._deleteFocus(newNode);
    edit(newNode);
    this.setState({dragParent, labelFocus: false});
  }

  dragMove = (target: KTreeNode, p: Point) => {
    const { node, edit } = this.props;
    const {dragParent, beforeCell} = this.state;
    const map = this.map;

    if (map !== null && 0 <= p.x && p.x < map.length) {
      const cell = map[p.x][p.y];
      if (cell === undefined || cell.node.id === target.id) { return; }
      if (beforeCell === null || !KTreeUtil.isEqualCell(beforeCell, cell)) {
        this.setState({beforeCell: cell});
        
        if (target.type === 'case') {
          if (cell.action === 'move' && dragParent!.children.find(c => c.id === cell.node.id) !== undefined) {
            edit(TreeUtil.move(node, target, cell.node));
            process.nextTick(() => this.resize());
          }
          if (cell.action === 'push' && dragParent!.id === cell.node.id) {
            edit(TreeUtil.push(node, target, cell.node));
            process.nextTick(() => this.resize());
          }
          return;
        }

        if (cell.action === 'move' && cell.node.type !== 'case') {
          edit(TreeUtil.move(node, target, cell.node));
          process.nextTick(() => this.resize());
        }

        if (cell.action === 'push' && cell.node.type !== 'switch') {
          edit(TreeUtil.push(node, target, cell.node));
          process.nextTick(() => this.resize());
        }
      }
    }
  }

  dragEnd = () => {
    this.setState({dragParent: null});
  }

  changeFocusNode = (target: TreeNode) => {
    const { node, edit } = this.props;
    edit(TreeUtil._replace(node, target));
  }

  cahngeType = (type: Type) => {
    const { node } = this.props;
    this.setState({typeAnchorEl: null});

    if (node === null) { throw 'No focus node.'; }
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
    const addNextBrotherNode = TreeNodeUtil.addNextBrother(node, focusNode);
    edit(addNextBrotherNode);
    process.nextTick(() => {this.resize(); this.scrollToNew(addNextBrotherNode)});
  }

  addFromCommon = (e: any) => {
    const { node, edit, commonNodes } = this.props;
    const common = commonNodes.find(c => c.id === e.target.value);
    if (common === undefined) { return; }
    
    const setIdCommon = TreeUtil._setId(common);
    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    edit(TreeNodeUtil.addFromCommon(node, focusNode, setIdCommon, baseTreeNode));
    process.nextTick(() => this.resize());
  }

  registAsCommon = (target: TreeNode) => {
    const { addNode} = this.props;
    const newNode = TreeUtil._setId(target);
    addNode(newNode);
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

  render() {
    const { node: tree, classes } = this.props;
    const {
      ks, ft, rs, labelFocus, typeAnchorEl, deleteFlag, showViewSettings
    } = this.state;
    const kTreeNode = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks);
    const node = KArrowUtil.setArrow(kTreeNode, ks);
    this.kTree = node;
    const flatNodes = TreeNodeUtil.toArrayWithoutClose(node);
    const map = KTreeUtil.makeMap(flatNodes, ks);
    this.map = map;

    const nodeActionProps = {
      ks,
      ft,
      focus: this.focus,
      expand: (target: KWithArrow) => this.expand(target, !target.open),
      dragStart: this.dragStart,
      dragMove: this.dragMove,
      dragEnd: this.dragEnd,
      deleteFocus: this.deleteFocus
    };

    const viewSettingProps: ViewSettingProps = {
      ks, ft, rs,
      changeKS: this.changeKS, changeFT: this.changeFT, changeRS: this.changeRS, reset: this.reset
    };
    var ActionButtonBox:  JSX.Element | undefined = undefined;
    var TypeButton:       JSX.Element | undefined = undefined;
    var ExpandButton:     JSX.Element | undefined = undefined;
    var Label:            JSX.Element | undefined = undefined;

    const focusNode = TreeNodeUtil._getFocusNode(node)!;
    if (focusNode !== undefined) {

      if (!labelFocus && typeAnchorEl === null) {
        const isRoot = focusNode.depth.top === 0;
        const boxStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x) * ks.unit + sp.x,
          top:  isRoot
          ? (focusNode!.point.y + focusNode.rect.h) * ks.unit + sp.x + theme.spacing.unit
          : (focusNode!.point.y) * ks.unit + sp.x - theme.spacing.unit,
          transform: isRoot ? undefined : 'translateY(-100%)',
          backgroundColor: theme.palette.grey[900],
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
              <Button onClick={() => focusNode.children.length === 0 ? this.deleteSelf() : this.setState({deleteFlag: true})}>
                削除<Delete/>
              </Button>
            </MuiThemeProvider>
          </Paper>
        );
      }

      (() => {
        const buttonStyle: React.CSSProperties = {
          position: 'absolute',
          left: (focusNode!.point.x + ks.rect.h / 2) * ks.unit + sp.x,
          top:  (focusNode!.point.y + ks.rect.h / 2) * ks.unit + sp.x,
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
              <MenuItem onClick={() => this.cahngeType('task')}>
                <ListItemIcon><Task/></ListItemIcon>
                <ListItemText inset primary="作業"/>
              </MenuItem>}
              {focusNode.type !== 'case' &&
              <MenuItem onClick={() => this.cahngeType('switch')}>
                <ListItemIcon><Switch style={{transform: 'scale(1, -1)'}}/></ListItemIcon>
                <ListItemText inset primary="分岐"/>
              </MenuItem>}
              {focusNode.type === 'case' &&
              <MenuItem onClick={() => this.cahngeType('case')}>
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
          left: (focusNode!.point.x + ks.rect.w - ks.rect.h / 2) * ks.unit + sp.x,
          top:  (focusNode!.point.y + ks.rect.h / 2) * ks.unit + sp.x,
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
          left: (focusNode!.point.x + ks.rect.h + ks.spr.w / 2) * ks.unit + sp.x,
          top:  (focusNode!.point.y + ks.rect.h / 2) * ks.unit + sp.x,
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
          />
        );
      })();
    }

    const largeContainerStyle: React.CSSProperties = {
      position: 'relative',
      width: sp.x + (node.self.w + ks.spr.w * 2) * ks.unit,
      height: sp.y + (node.self.h + ks.spr.h * 2) * ks.unit,
    };

    return (
      <div className={classes.root}>
        <main className={classes.main} ref={this.mainRef}>
          <div style={largeContainerStyle}>
            <Stage ref={this.stageRef} onClick={this.deleteFocus}>
              <Layer>
                {/* {map !== null && map.map((___, x) => (
                <Group key={`group-${x}`} x={sp.x} y={sp.y}>
                  {___.map((__, y) => {
                  const cell = map[x][y];
                  if (cell === undefined) { return <Rect key={`${x}-${y}`}/>; }
                  const fill = cell.action === 'push' ? ('#ccff' + _.padStart(String(cell.node.depth.top * 16), 2, '0')) :
                              cell.action === 'move' ? 'blue'   : 'grey';
                  return (
                    <Rect key={`${x}-${y}`} x={x * ks.unit} y={y * ks.unit + 300} width={ks.unit} height={ks.unit}
                          fill={fill} stroke="#000" strokeWidth={1}/>);
                  })}
                </Group>))} */}
                {flatNodes.map((n, i) => (
                  <KNode key={n.id} node={n} labelFocus={labelFocus} {...nodeActionProps}/>
                ))}
              </Layer>
            </Stage>
            {ActionButtonBox}
            {Label}
            {TypeButton}
            {ExpandButton}
          </div>
            

          <Fab className={classes.settingsButton} onClick={() => this.setState({showViewSettings: true})}>
            <ViewSettingsIcon/>
          </Fab>

          <Dialog open={deleteFlag} onClose={() => this.setState({deleteFlag: false})}>
            <DialogTitle>この項目を削除してもよろしいですか？</DialogTitle>
            {Boolean(focusNode) && focusNode.children.length !== 0 &&
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
            onClose={() => this.setState({showViewSettings: false})}
            BackdropProps={{className: classes.viewSettingModal}}
            disableAutoFocus
          >
            <ViewSettings {...viewSettingProps}/>
          </Modal>

        </main>
      </div>
    );
  }
}

export default withStyles(styles)(NodeEditor);