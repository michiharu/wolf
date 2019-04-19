import _ from 'lodash';
import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
  Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Modal, Badge, TextField, 
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, KTreeNode, Cell, Point, Tree, baseKTreeNode, baseKWithArrow, baseTreeNode, KWithArrow } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, ks as defaultKS, rightPainWidth, Task, Switch, Case, Delete, More, Less } from '../../../settings/layout';
import { rs as defaultRS } from '../../../settings/reading';

import KTreeUtil, { buttonArea, buttonSize, buttonMargin } from '../../../func/k-tree-util';
import RightPane, { RightPaneProps } from './right-pane';
import TreeUtil from '../../../func/tree';
import KSize from '../../../data-types/k-size';
import keys from '../../../settings/storage-keys';
import ViewSettings, { ViewSettingProps } from './view-settings';
import { phrase } from '../../../settings/phrase';
import ReadingSetting from '../../../data-types/reading-settings';
import KNode from '../../../components/konva/k-node';
import Util from '../../../func/util';
import KArrowUtil from '../../../func/k-arrow-util';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  toolbar: theme.mixins.toolbar,
  main: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
  stageContainer: {
    position: 'relative',
    paddingBottom: '100vh',
  },
  rightPaneContainer: {
    position: 'fixed',
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
  focusNode: KWithArrow | null;
  typeAnchorEl: any;
  deleteFlag: boolean;
  hasDifference: boolean;
  showViewSettings: boolean;
}

export type FlowType = 'rect' | 'arrow';
export const flowType = {rect: 'rect', arrow: 'arrow'};
export const sp = {x: 16, y: 16};

class NodeEditor extends React.Component<Props, State> {

  stageContainerRef = React.createRef<HTMLDivElement>();
  stageRef = React.createRef<any>();
  rightPaneRef = React.createRef<HTMLDivElement>();

  calcedNode: KTreeNode;
  map: Cell[][] | null = null; 

  constructor(props: Props) {
    super(props);
    const state = NodeEditor.getInitialState();
    this.state = state;
    this.calcedNode = KTreeUtil.get(props.node, baseKTreeNode, state.ks);
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
      focusNode: null,
      typeAnchorEl: null,
      deleteFlag: false,
      hasDifference: false,
      showViewSettings: false,
    };
  }
  
  componentDidMount() {
    process.nextTick(this.resize);
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const {ks} = this.state;
    const cref = this.stageContainerRef.current;
    const sref = this.stageRef.current;
    const rref = this.rightPaneRef.current;
    if (cref === null || sref === null || rref === null) { throw 'Cannot find elements.'; }
    sref.width((this.calcedNode.self.w + ks.spr.w) * ks.unit + sp.x + rightPainWidth);
    sref.height(Math.max((this.calcedNode.self.h + ks.spr.h) * ks.unit + sp.y, window.innerHeight));
    sref.draw();
  }

  setFocusState = (target: KWithArrow, focus: boolean) => {
    const { node, edit } = this.props;
    const newNode = TreeUtil._focus(node, target.id);
    edit(newNode);
    const focusNode: KWithArrow = {...target, focus};
    this.setState({focusNode});
    process.nextTick(() => this.resize());
  }

  setOpenState = (target: KWithArrow, open: boolean) => {
    const { node, edit } = this.props;
    edit(TreeUtil._open(node, target.id, open));
    const focusNode: KWithArrow = {...target, open};
    this.setState({focusNode});
    process.nextTick(() => this.resize());
  }

  click = (target: KWithArrow) => {
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
    const { node, edit } = this.props;
    edit(TreeUtil._deleteFocus(node));
    this.setState({focusNode: null});
    process.nextTick(() => this.resize());
  }

  dragStart = (target: KTreeNode) => {
    const { node, edit } = this.props;
    const dragParent = TreeUtil._getPrent(node, target);
    const openNode = TreeUtil._open(node, target.id, false);
    edit(TreeUtil._deleteFocus(openNode));
    this.setState({dragParent, focusNode: null});
    
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

  changeFocusNode = (target: KWithArrow) => {
    const { node, edit } = this.props;
    edit(TreeUtil._replace(node, target));
    this.setState({focusNode: target});
  }

  cahngeType = (type: Type) => {
    const { focusNode: node } = this.state;
    this.setState({typeAnchorEl: null});

    if (node === null) { throw 'No focus node.'; }
    if (node.type === type) { return; }

    if (node.children.length === 0) {
      const newNode: KWithArrow = { ...node, type };
      this.changeFocusNode(newNode);
    }

    if (type === 'task') {
      const children: KWithArrow[] = node.children.map(c => c.children).reduce((a, b) => a.concat(b));
      const newNode: KWithArrow = { ...node, type, children };
      this.changeFocusNode(newNode);
    } else {
      const newCase = TreeUtil.getNewNode('switch', baseKWithArrow);
      const children: KWithArrow[] = [{ ...newCase, children: node.children }];
      const newNode: KWithArrow = { ...node, type, children };
      this.changeFocusNode(newNode);
    }
  };

  addDetails = () => {
    const { node, edit } = this.props;
    const {focusNode} = this.state;
    const addDetailsNode = TreeUtil.addDetails(node, focusNode!);
    edit(addDetailsNode);
    process.nextTick(() => this.resize());
  }

  addNextBrother = () => {
    const { node, edit } = this.props;
    const {focusNode} = this.state;
    edit(TreeUtil.addNextBrother(node, focusNode!));
    process.nextTick(() => this.resize());
  }

  addFromCommon = (e: any) => {
    const { node, edit, commonNodes } = this.props;
    const common = commonNodes.find(c => c.id === e.target.value);
    if (common === undefined) { return; }
    
    const setIdCommon = TreeUtil._setId(common);
    const {focusNode} = this.state;
    edit(TreeUtil.addFromCommon(node, focusNode!, setIdCommon, baseTreeNode));
    process.nextTick(() => this.resize());
  }

  registAsCommon = (target: TreeNode) => {
    const { addNode} = this.props;
    const newNode = TreeUtil._setId(target);
    addNode(newNode);
  }

  deleteSelf = () => {
    const { node, edit } = this.props;
    const {focusNode} = this.state;
    edit(TreeUtil._deleteById(node, focusNode!.id));
    this.setState({focusNode: null, deleteFlag: false});
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
    console.log(rs);
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
    const { node: tree, commonNodes, classes } = this.props;
    const {
      ks, ft, rs, focusNode, typeAnchorEl, deleteFlag, showViewSettings
    } = this.state;
    const kTreeNode = KTreeUtil.get(tree, baseKWithArrow, ks);
    const node = KArrowUtil.get(kTreeNode, baseKWithArrow, ks);
    this.calcedNode = node;
    const flatNodes = KTreeUtil.toFlat(node);
    const map = KTreeUtil.makeMap(flatNodes, ks);
    this.map = map;

    const nodeActionProps = {
      ks,
      ft,
      click: this.click,
      dragStart: this.dragStart,
      dragMove: this.dragMove,
      dragEnd: this.dragEnd,
      addNextBrother: this.addNextBrother,
      deleteFocus: this.deleteFocus
    };

    const rightPaneProps: RightPaneProps = {
      isRoot: focusNode !== null && node.id === focusNode.id,
      node: focusNode,
      commonNodes,
      changeNode: this.changeFocusNode,
      addDetails: this.addDetails,
      addFromCommon: this.addFromCommon,
      registAsCommon: this.registAsCommon,
      deleteSelf: this.deleteSelf,
      setShowViewSettings: () => this.setState({showViewSettings: true})
    };

    const viewSettingProps: ViewSettingProps = {
      ks, ft, rs,
      changeKS: this.changeKS, changeFT: this.changeFT, changeRS: this.changeRS, reset: this.reset
    };

    var AddChildButton:   JSX.Element | undefined = undefined;
    var AddBrotherButton: JSX.Element | undefined = undefined;
    var TypeButton:       JSX.Element | undefined = undefined;
    var DeleteButton:     JSX.Element | undefined = undefined;
    var ExpandButton:     JSX.Element | undefined = undefined;
    var Label:            JSX.Element | undefined = undefined;

    if (focusNode !== null) {
      const calcedFN = TreeUtil._findById(node, focusNode.id)!;
      const buttonPoint = buttonSize / 2 + buttonMargin * 1.5;
      if (!(focusNode.children.length !== 0 && !focusNode.open)) {
        const bySide = calcedFN.children.length === 0 && !calcedFN.open;
        const buttonStyle: React.CSSProperties = {
          position: 'absolute',
          left: bySide
            ? (calcedFN!.point.x + ks.rect.w)                   * ks.unit + sp.x + buttonPoint
            : (calcedFN!.point.x + (ks.rect.w + ks.indent) / 2) * ks.unit + sp.x + buttonPoint,
          top: bySide
            ? (calcedFN!.point.y + ks.rect.h / 2) * ks.unit + sp.y + buttonPoint
            : (calcedFN!.point.y + ks.rect.h)     * ks.unit + sp.y + buttonPoint,
          transform: `translate(-50%, -50%)`
        };
  
        AddChildButton = (
          <IconButton color="secondary" style={buttonStyle} onClick={this.addDetails}>
            <Add/>
          </IconButton>
        );
      }
      if (!calcedFN.open) {
        const buttonStyle: React.CSSProperties = {
          position: 'absolute',
          left: (calcedFN!.point.x + ks.rect.w / 2) * ks.unit + sp.x,
          top:  (calcedFN!.point.y + ks.rect.h)     * ks.unit + sp.y + buttonPoint,
          transform: `translate(-50%, -50%)`
        };
  
        AddBrotherButton = (
          <IconButton color="secondary" style={buttonStyle} onClick={this.addNextBrother}>
            <Add/>
          </IconButton>
        );
      }
      (() => {
        const buttonStyle: React.CSSProperties = {
          position: 'absolute',
          left: (calcedFN!.point.x + ks.rect.h / 2) * ks.unit + sp.x,
          top:  (calcedFN!.point.y + ks.rect.h / 2) * ks.unit + sp.x,
          transform: `translate(-50%, -50%) scale(${ks.unit / 24})`,
          color: '#000',
        };
        TypeButton = (
          <div>
            <IconButton style={buttonStyle} onClick={e => this.setState({typeAnchorEl: e.currentTarget})} disableRipple>
              {calcedFN.type === 'task' ? <Task/> : calcedFN.type === 'switch' ? <Switch style={{transform: 'scale(1, -1)'}}/> : <Case/>}
            </IconButton>
            <Menu
              anchorEl={typeAnchorEl}
              open={Boolean(typeAnchorEl)}
              onClose={() => this.setState({typeAnchorEl: null})}
            >
              {calcedFN.type !== 'case' &&
              <MenuItem onClick={() => this.cahngeType('task')}>
                <ListItemIcon><Task/></ListItemIcon>
                <ListItemText inset primary="作業"/>
              </MenuItem>}
              {calcedFN.type !== 'case' &&
              <MenuItem onClick={() => this.cahngeType('switch')}>
                <ListItemIcon><Switch style={{transform: 'scale(1, -1)'}}/></ListItemIcon>
                <ListItemText inset primary="分岐"/>
              </MenuItem>}
              {calcedFN.type === 'case' &&
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
          left: (calcedFN!.point.x + ks.rect.w - ks.rect.h / 2) * ks.unit + sp.x,
          top:  (calcedFN!.point.y + ks.rect.h / 2) * ks.unit + sp.x,
          transform: `translate(-50%, -50%) scale(${ks.unit / 24})`,
          color: '#000',
        };
        DeleteButton = (
          <IconButton style={buttonStyle} onClick={() => this.setState({deleteFlag: true})} disableRipple>
            <Delete/>
          </IconButton>
        );
      })();
      (() => {
        const buttonStyle: React.CSSProperties = {
          position: 'absolute',
          left: (calcedFN!.point.x + ks.rect.w - ks.rect.h / 2 - ks.icon * 2) * ks.unit + sp.x,
          top:  (calcedFN!.point.y + ks.rect.h / 2) * ks.unit + sp.x,
          transform: `translate(-50%, -50%) scale(${ks.unit / 24})`,
          color: '#000',
        };
        ExpandButton = (
          <IconButton style={buttonStyle} onClick={() => this.setOpenState(focusNode, !focusNode.open)} disableRipple>
            <Badge badgeContent={focusNode.children.length} color="primary">
              {!focusNode.open ? <More/> : <Less/>}
            </Badge>
          </IconButton>
        );
      })();
      (() => {
        const labelStyle: React.CSSProperties = {
          position: 'absolute',
          left: (calcedFN!.point.x + ks.rect.h + ks.fontSize / 2) * ks.unit + sp.x,
          top:  (calcedFN!.point.y + ks.rect.h / 2) * ks.unit + sp.x,
          width: (ks.rect.w - ks.fontSize - ks.rect.h * 1.5 - ks.icon * 3) * ks.unit,
          transform: `translateY(-50%)`,
        };
        const fontSize: React.CSSProperties = {
          fontSize: 18 / 20 * ks.unit
        };
        Label = (
          <TextField
            style={labelStyle}
            InputProps={{style: fontSize}}
            placeholder={
              calcedFN.type === 'task' ? phrase.placeholder.task :
              calcedFN.type === 'switch' ? phrase.placeholder.switch : phrase.placeholder.case
            }
            InputLabelProps={{shrink: true}}
            value={calcedFN.label}
            onChange={(e: any) => this.changeFocusNode({ ...calcedFN!, label: e.target.value })}
          />
        );
      })();
    }

    
    return (
      <div className={classes.root}>
        <main className={classes.main}>
          <div className={classes.stageContainer} ref={this.stageContainerRef}>
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
                {flatNodes.map((n, i) => <KNode key={n.id} node={n} isRoot={i === 0} {...nodeActionProps}/>)}
              </Layer>
            </Stage>

            {AddChildButton}
            {AddBrotherButton}
            {TypeButton}
            {DeleteButton}
            {ExpandButton}
            {Label}
          </div>        

          <div ref={this.rightPaneRef} className={classes.rightPaneContainer}>
            <RightPane {...rightPaneProps}/>
          </div>

          <Dialog open={deleteFlag} onClose={() => this.setState({deleteFlag: false})}>
            <DialogTitle>この項目を削除してもよろしいですか？</DialogTitle>
            {focusNode !== null && focusNode.children.length !== 0 &&
            <DialogContent>
              <DialogContentText>この項目には詳細項目が含まれています。削除してもよろしいですか？</DialogContentText>
            </DialogContent>}
            
            <DialogActions>
              <Button onClick={() => this.setState({deleteFlag: false})}>Cancel</Button>
              <Button onClick={this.deleteSelf} color="primary" autoFocus>Delete</Button>
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