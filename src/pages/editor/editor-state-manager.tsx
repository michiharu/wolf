import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Fab, Snackbar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Modal, Toolbar, AppBar, Paper, Tab, Tabs,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Download from '@material-ui/icons/SaveAlt';
import CloseIcon from '@material-ui/icons/Close';

import { Tree, TreeNode, baseTreeNode } from '../../data-types/tree-node';
import NodeEditor, { NodeEditorProps } from './node-editor/node-editor';
import { RouteComponentProps } from 'react-router';
import link from '../../settings/path-list';
import TreeUtil from '../../func/tree';
import { fileDownload } from '../../func/file-download';
import TextEditor, { TextEditorProps } from './text-editor/text-editor';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
    width: '100%',
    overflow: 'scroll',
  },
  toolbar: theme.mixins.toolbar,
  close: {
    padding: theme.spacing.unit * 0.5,
  },
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  treeNodes: Tree[];
  selectedNodeList: Tree[];
  commonNodes: Tree[];
  changeNode: (node: Tree) => void;
  addNode: (node: Tree) => void;
}

interface State {
  tabIndex: number;
  node: TreeNode;
  hasDifference: boolean;
  cannotSaveReason: CannotSaveReason;
  saved: boolean;
}

export type CannotSaveReason = 'switch' | 'case' | null;

class EditorStateManager extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { selectedNodeList, commonNodes } = props;
    this.state = EditorStateManager.getInitialState(selectedNodeList, commonNodes);
  }

  static getInitialState = (selectedNodeList: Tree[], commonNodes: Tree[]): State => {
    const node = TreeUtil._getTreeNode(selectedNodeList[selectedNodeList.length - 1], baseTreeNode);
    return {
      tabIndex: 0,
      node,
      hasDifference: false,
      cannotSaveReason: null,
      saved: false,
    };
  }

  differenceCheck = () => {
    const { selectedNodeList } = this.props;
    const node = TreeUtil._getTreeNode(selectedNodeList[selectedNodeList.length - 1], baseTreeNode);
    if (TreeUtil._hasDifference(node, this.state.node)) {
      this.setState({hasDifference: true});
    } else {
      this.props.history.push(link.dashboard);
    }
  }

  download = () => {
    const filename = `${this.state.node.label}.json`;
    const nodeWithoutId = TreeUtil._removeId(this.state.node);
    fileDownload(JSON.stringify(nodeWithoutId), filename, 'application/json');
  }

  edit = (editNode: TreeNode) => {
    this.setState({node: editNode});
  }

  save = () => {
    const { changeNode } = this.props;
    const {node} = this.state;
    const isAllSwitchHasCase = TreeUtil._isAllSwitchHasCase(node);
    const isAllCaseHasItem = TreeUtil._isAllCaseHasItem(node);
    const cannotSaveReason: CannotSaveReason = !isAllSwitchHasCase ? 'switch' :
                                               !isAllCaseHasItem   ? 'case'   : null;
    this.setState({cannotSaveReason});
    if (cannotSaveReason === null) {
      this.setState({saved: true});
      changeNode(node);
    }
  }

  render() {
    const {
      commonNodes, addNode, classes
    } = this.props;

    const {
      tabIndex, node,
      hasDifference, cannotSaveReason, saved
    } = this.state;
  
    const nodeProps: NodeEditorProps = {
      commonNodes,
      node,
      edit: this.edit,
      addNode,
    };

    const textProps: TextEditorProps = {
      commonNodes,
      node,
      edit: this.edit,
      addNode,
    };
    
    return (
      <div className={classes.root}>
        <AppBar color="default">
          <Toolbar>
            <Button size="large" onClick={this.differenceCheck}>Flow Like</Button>
            <Tabs indicatorColor="primary" value={tabIndex} onChange={(_, tabIndex) => this.setState({tabIndex})}>
              <Tab label="カード表示" />
              <Tab label="テキスト表示" />
            </Tabs>

            <div style={{flexGrow: 1}} />

            <IconButton onClick={this.save}><SaveIcon/></IconButton>
            <IconButton onClick={this.download}><Download/></IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar}/>

        {tabIndex === 0 && <NodeEditor {...nodeProps}/>}
        {tabIndex === 1 && <TextEditor {...textProps}/>}
        
        <Dialog open={hasDifference} onClose={() => this.setState({hasDifference: false})}>
          <DialogTitle>マニュアルは編集されています。</DialogTitle>
          <DialogContent>
            <DialogContentText>
              保存せずに画面を移動してもよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({hasDifference: false})}>Cancel</Button>
            <Button onClick={() => this.props.history.push(link.dashboard)} color="primary" autoFocus>OK</Button>
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

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={saved}
          autoHideDuration={5000}
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

export default withStyles(styles)(EditorStateManager);