import * as React from 'react';
import {
  Theme, createStyles, WithStyles, Snackbar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Modal, withStyles, Portal,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import { Divergent, Convergent } from '../../../../settings/layout' 

import { TreeNode, KTreeNode, Manual } from '../../../../data-types/tree';
import TreeUtil from '../../../../func/tree';
import NodeEditorContainer from '../../node/node-editor/node-editor-container';
import { theme } from '../../../..';
import { NodeEditMode } from '../../../../data-types/node-edit-mode';
import { MemoState } from '../../../../redux/states/main/memoState';
import { EditorFrameActions } from './node-editor-frame-container';
import ViewSettingsContainer from '../../../../components/view-settings/view-settings-container';
import { NodeEditorProps } from './node-editor-component';

export const styles = (theme: Theme) => createStyles({
  convergent: {
    transform: 'scale(1, -1)',
  },
  close: {
    padding: theme.spacing(0.5),
  },
  editFinishButton: {
    marginLeft: theme.spacing(1),
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
    padding: theme.spacing(2),
    outline: 'none',
  },
});

interface Props extends
  MemoState,
  EditorFrameActions,
  WithStyles<typeof styles> {
    manual: Manual;
    node: TreeNode;
    modeRef: React.RefObject<HTMLDivElement>;
    buttonRef: React.RefObject<HTMLDivElement>;
  }

interface State {
  // divergent thinking（発散思考）、 convergent thinking（収束思考）
  mode: NodeEditMode;
  node: TreeNode;
  memos: KTreeNode[];
  hasDifference: boolean;
  cannotSaveReason: CannotSaveReason;
  saved: boolean;
  showVS: boolean;
}

export type CannotSaveReason = 'switch' | 'case' | null;

class EditorFrameComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { node, memos } = props;
    if (node === null) { throw new Error('Node cannot be null.'); }
    this.state = {
      mode: 'dc',
      node,
      memos,
      hasDifference: false,
      cannotSaveReason: null,
      saved: false,
      showVS: false,
    };
  }

  edit = (editNode: TreeNode) => {
    this.setState({node: editNode});
  }

  addMemo = (memo: KTreeNode) => {
    const { memos: memoList } = this.state;
    memoList.push(memo);
    this.setState({memos: memoList});
  }

  editMemo = (memo: KTreeNode) => {
    const { memos: memoList } = this.state;
    this.setState({
      memos: memoList.map(m => m.id === memo.id ? memo : m)
    });
  }

  deleteMemo = (memo: KTreeNode) => {
    const { memos: memoList } = this.state;
    this.setState({memos: memoList.filter(m => m.id !== memo.id)});
  }

  save = () => {
    const { manual, replaceManual, changeMemos, editEnd } = this.props;
    if (manual === null) { throw new Error('Manual cannot be null.'); }
    const {node, memos } = this.state;
    const isAllSwitchHasCase = TreeUtil._isAllSwitchHasCase(node);
    const isAllCaseHasItem = TreeUtil._isAllCaseHasItem(node);
    const cannotSaveReason: CannotSaveReason = !isAllSwitchHasCase ? 'switch' :
                                               !isAllCaseHasItem   ? 'case'   : null;
    this.setState({cannotSaveReason});
    if (cannotSaveReason === null) {
      this.setState({saved: true});
      const newManual: Manual = {...manual, rootTree: node, title: node.label };
      replaceManual(newManual);
      changeMemos(memos);
      editEnd();
    }
  }

  saveAndGo = () => {
    const { manual, replaceManual, changeMemos, editEnd } = this.props;
    if (manual === null) { throw new Error('Manual cannot be null.'); }
    const { node, memos } = this.state;
    manual.rootTree = node;
    replaceManual(manual);
    changeMemos(memos);
    editEnd();
  }

  handleShowVS = (showVS: boolean) => () => this.setState({showVS});

  render() {
    const { modeRef, buttonRef, editEnd, classes } = this.props;
    const { mode, node, memos, hasDifference, cannotSaveReason, saved, showVS } = this.state;
  
    const nodeProps: NodeEditorProps = {
      mode,
      node,
      memos,
      edit: this.edit,
      deleteMemo: this.deleteMemo,
      addMemo: this.addMemo,
      editMemo: this.editMemo,
    };

    const cannotSave: CannotSaveReason = cannotSaveReason !== null ? cannotSaveReason :
      !TreeUtil._isAllSwitchHasCase(node) ? 'switch' :
      !TreeUtil._isAllCaseHasItem(node)   ? 'case'   : null;
    const getStyle = (buttonMode: NodeEditMode) => {
      return mode === buttonMode
      ? { height: '100%', backgroundColor: theme.palette.background.paper }
      : { height: '100%' };
    };
    return (
      <div>
        <Portal container={modeRef.current}>
          <>
            <Button style={getStyle('d')}  onClick={() => this.setState({mode: 'd'})} ><Divergent/></Button>
            <Button style={getStyle('dc')} onClick={() => this.setState({mode: 'dc'})}><Divergent/><Convergent className={classes.convergent}/></Button>
            <Button style={getStyle('c')}  onClick={() => this.setState({mode: 'c'})} ><Convergent className={classes.convergent}/></Button>
          </>
        </Portal>
        <Portal container={buttonRef.current}>
          <Button color="primary" onClick={this.save} style={{height: '100%'}}>編集完了</Button>
        </Portal>

        <NodeEditorContainer {...nodeProps}/>

        <Modal
          open={showVS}
          onClose={this.handleShowVS(false)}
          BackdropProps={{className: classes.viewSettingModal}}
          disableAutoFocus
        >
          <ViewSettingsContainer />
        </Modal>
        
        <Dialog open={hasDifference} onClose={() => this.setState({hasDifference: false})}>
          <DialogTitle>マニュアルを保存せずに画面を移動してもよろしいですか？</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {cannotSave === 'switch' && '現在のデータは、分岐に条件が設定されていない項目があるため保存できません。'}
              {cannotSave === 'case'   && '現在のデータは、条件に詳細項目が設定されていない項目があるため保存できません。'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({hasDifference: false})}>いいえ</Button>
            {cannotSave === null &&
            <Button onClick={this.saveAndGo} color="primary" autoFocus>保存して移動</Button>}
            <Button onClick={editEnd} color="primary">保存せずに移動</Button>
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

export default withStyles(styles)(EditorFrameComponent);