import _ from 'lodash';
import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Fab, Snackbar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Modal,
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import Download from '@material-ui/icons/SaveAlt';
import CloseIcon from '@material-ui/icons/Close';
import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Stage, Layer, Group, Rect } from 'react-konva';

import { TreeNode, Type, EditableNode, Cell, Point } from '../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, tes as defaultTES } from '../../settings/layout';

import ToolContainer from '../../components/tool-container/tool-container';
import EditableNodeUtil from '../../func/editable-node-util';
import EditableKNode from '../../components/konva-node/editable-k-node';
import { fileDownload } from '../../func/file-download';
import TreeUtil from '../../func/tree';
import EditableNodeViewUtil from '../../func/editable-node-view-util';
import KSize from '../../data-types/k-size';
import keys from '../../settings/storage-keys';
import ViewSettings from './view-settings';
import TextEditSettings from '../../data-types/text-edit-settings';
import TextLineWithIcon, { TextLineWithIconProps } from './text-line-with-icon';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: toolbarHeight,
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      paddingTop: toolbarMinHeight,
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
  saveButton: {
    minWidth: 100,
  },
  extendedIcon: {
    marginLeft: theme.spacing.unit,
  },
  close: {
    padding: theme.spacing.unit * 0.5,
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

export interface EditorProps {
  toolRef: HTMLDivElement;
  parent: TreeNode | null;
  commonNodes: TreeNode[];
  node: TreeNode;
  back: () => void;
  changeNode: (node: TreeNode) => void;
  addCommonList: (node: TreeNode) => void;
  deleteCommonList: (node: TreeNode) => void;
  addNode: (node: TreeNode) => void;
}

interface Props extends EditorProps, WithStyles<typeof styles> {}

interface State {
  isCommon: string;
  node: TreeNode;
  tes: TextEditSettings;
  hasDifference: boolean;
  cannotSaveReason: CannotSaveReason;
  saved: boolean;
  showViewSettings: boolean;
}

type CannotSaveReason = 'switch' | 'case' | null;

class TextEditor extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { parent, commonNodes, node } = props;

    this.state = TextEditor.getInitialState(commonNodes, parent, node);
  }

  static getInitialState = (commonList: TreeNode[], parent: TreeNode | null, node: TreeNode): State => {
    const tesFromStorage = localStorage.getItem(keys.tes);
    const tes = tesFromStorage !== null ? JSON.parse(tesFromStorage) as TextEditSettings : defaultTES;
    return {
      tes,
      isCommon: commonList.find(c => c.id === node.id) !== undefined ? 'true' : 'false',
      node,
      hasDifference: false,
      cannotSaveReason: null,
      saved: false,
      showViewSettings: false,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (prevState.node.id !== nextProps.node.id) {
      const { parent, commonNodes, node } = nextProps;
      return TextEditor.getInitialState(commonNodes, parent, node);
    }
    return null;
  }

  differenceCheck = () => {
    if (TreeUtil._hasDifference(this.props.node, this.state.node)) {
      this.setState({hasDifference: true});
    } else {
      this.props.back();
    }
  }

  save = () => {
    const { parent, commonNodes, changeNode, addCommonList, deleteCommonList } = this.props;
    const {isCommon, node} = this.state;
    const isAllSwitchHasCase = TreeUtil._isAllSwitchHasCase(node);
    const isAllCaseHasItem = TreeUtil._isAllCaseHasItem(node);
    const cannotSaveReason: CannotSaveReason = !isAllSwitchHasCase ? 'switch' :
                                               !isAllCaseHasItem   ? 'case'   : null;
    if (cannotSaveReason === null) {
      changeNode(node);
      if (parent === null) {
        if (isCommon === 'true' && commonNodes.find(c => c.id === node.id) === undefined) {
          addCommonList(node);
        }
        if (isCommon === 'false' && commonNodes.find(c => c.id === node.id) !== undefined) {
          deleteCommonList(node);
        }
      }
      this.setState({saved: true});
    } else {
      this.setState({cannotSaveReason});
    }
  }

  download = () => {
    const {node} = this.props;
    const filename = `${node.label}.json`;
    const nodeWithoutId = TreeUtil._removeId(node);
    fileDownload(JSON.stringify(nodeWithoutId), filename, 'application/json');
  }

  changeNode = (target: TreeNode) => {
    const {node: prevNode} = this.state;
    const node = TreeUtil._replace(prevNode, target);
    this.setState({node});
  }

  // addDetails = () => {
  //   const {node: prevNode, ks, focusNode} = this.state;
  //   const node = EditableNodeUtil.addDetails(prevNode, ks, focusNode!);
  //   const map = EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(node), ks);
  //   this.setState({node, map});
  // }

  // addFromCommon = (e: any) => {
  //   const { commonNodes } = this.props;
  //   const common = commonNodes.find(c => c.id === e.target.value);
  //   if (common === undefined) { return; }
    
  //   const setIdCommon = TreeUtil._setId(common);
  //   const {node: prevNode, ks, focusNode} = this.state;
  //   const node = EditableNodeUtil.addFromCommon(prevNode, ks, focusNode!, setIdCommon);
  //   const map = EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(node), ks);
  //   this.setState({node, map});
  // }

  // registAsCommon = (target: EditableNode) => {
  //   const { addNode, addCommonList } = this.props;
  //   const newNode = TreeUtil._setId(target);
  //   addNode(newNode);
  //   addCommonList(newNode);
  // }

  deleteSelf = (target: TreeNode) => {
    const {node: prevNode} = this.state;
    const node = TreeUtil._deleteById(prevNode, target.id);
    this.setState({node});
  }

  // changeKS = (ks: KSize) => {
  //   const {node: prevNode} = this.state;
  //   const node = EditableNodeViewUtil.setCalcProps(prevNode, ks);
  //   const map = EditableNodeViewUtil.makeMap(EditableNodeUtil.toFlat(node), ks);
  //   this.setState({ks, node, map});
  //   localStorage.setItem(keys.ks, JSON.stringify(ks));
  // }

  render() {
    const { toolRef, parent, commonNodes, back, classes } = this.props;
    const {
      tes, isCommon, node, hasDifference, saved, cannotSaveReason, showViewSettings
    } = this.state;

    const textLineWithIconProps: TextLineWithIconProps = {
      depth: 0,
      node,
      commonNodes,
      changeNode: this.changeNode,
      deleteSelf: this.deleteSelf,
    };

    return (
      <div className={classes.root}>
        <ToolContainer containerRef={toolRef}>
          <Grid container spacing={8}>
            <Grid item>
              <Fab color="primary" onClick={this.differenceCheck} size="medium"><ArrowBack/></Fab>
            </Grid>
            <Grid item>
              <Fab className={classes.saveButton} variant="extended" color="primary" onClick={this.save}>
                保存<CheckIcon className={classes.extendedIcon}/>
              </Fab>
            </Grid>
            {parent === null && (
            <Grid item>
              <Fab color="primary" onClick={this.download} size="medium">
                <Download/>
              </Fab>
            </Grid>)}
            <Grid item>
              <Fab onClick={() => this.setState({showViewSettings: true})} size="medium"><ViewSettingsIcon/></Fab>
            </Grid>
          </Grid>
        </ToolContainer>

        <TextLineWithIcon {...textLineWithIconProps}/>

        <Dialog open={hasDifference} onClose={() => this.setState({hasDifference: false})}>
          <DialogTitle>マニュアルは編集されています。</DialogTitle>
          <DialogContent>
            <DialogContentText>
              保存せずに画面を移動してもよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({hasDifference: false})}>Cancel</Button>
            <Button onClick={back} color="primary" autoFocus>OK</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={cannotSaveReason !== null} onClose={() => this.setState({cannotSaveReason: null})}>
          <DialogTitle>このデータは保存できません</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {cannotSaveReason === 'switch' && 'すべての分岐には、１つ以上の条件を設定して下さい。'}
              {cannotSaveReason === 'case'   && 'すべての条件には、１つ以上の詳細項目を設定して下さい。'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({cannotSaveReason: null})} color="primary" autoFocus>OK</Button>
          </DialogActions>
        </Dialog>

        {/* <Modal
          open={showViewSettings}
          onClose={() => this.setState({showViewSettings: false})}
          BackdropProps={{className: classes.viewSettingModal}}
          disableAutoFocus
        >
          <ViewSettings ks={ks} changeKS={this.changeKS}/>
        </Modal> */}

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={saved}
          autoHideDuration={3000}
          onClose={() => this.setState({saved: false})}
          message={<span>保存しました</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={() => this.setState({saved: false})}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TextEditor);