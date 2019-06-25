import * as React from 'react';
import {
  Theme, createStyles, WithStyles,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Modal, withStyles, Portal, ButtonGroup, Box,
} from '@material-ui/core';

import { Divergent, Convergent } from '../../../../settings/layout' 

import { TreeNode, KTreeNode, baseKTreeNode } from '../../../../data-types/tree';
import TreeUtil from '../../../../func/tree';
import NodeEditorContainer from '../../node/node-editor/node-editor-container';
import { theme } from '../../../..';
import { NodeEditMode } from '../../../../data-types/node-edit-mode';
import { MemosState } from '../../../../redux/states/main/memoState';
import { EditorFrameActions } from './node-editor-frame-container';
import ViewSettingsContainer from '../../../../components/view-settings/view-settings-container';
import { NodeEditorProps } from './node-editor-component';
import { TreePutRequest } from '../../../../api/definitions';
import { RouteComponentProps, withRouter, Prompt } from 'react-router';

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

interface Props extends MemosState, EditorFrameActions, RouteComponentProps, WithStyles<typeof styles> {
  selectId: string;
  node: TreeNode;
  modeRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLDivElement>;
}

interface State {
  // divergent thinking（発散思考）、 convergent thinking（収束思考）
  mode: NodeEditMode;
  node: TreeNode;
  memos: KTreeNode[];
  cannotSaveReason: CannotSaveReason;
  showVS: boolean;
  saved: boolean;
}

export type CannotSaveReason = 'switch' | 'case' | null;

class EditorFrameComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { node, memos } = props;
    if (node === null) { throw new Error('Node cannot be null.'); }
    this.state = {
      mode: 'c',
      node,
      memos: TreeUtil.getAsArray(memos, baseKTreeNode),
      cannotSaveReason: null,
      showVS: false,
      saved: false,
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
    const { selectId, putTree, changeMemos, history } = this.props;
    const {node, memos } = this.state;
    const isAllSwitchHasCase = TreeUtil._isAllSwitchHasCase(node);
    const isAllCaseHasItem = TreeUtil._isAllCaseHasItem(node);
    const cannotSaveReason: CannotSaveReason = !isAllSwitchHasCase ? 'switch' :
                                               !isAllCaseHasItem   ? 'case'   : null;
    this.setState({cannotSaveReason});
    if (cannotSaveReason === null) {
      const hasDifference = TreeUtil._hasDifference(this.props.node, this.state.node);
      if (hasDifference) {
        const params: TreePutRequest = {manualId: selectId, rootTree: node };
        putTree(params);
      }
      changeMemos(memos);
      this.setState({saved: true})
      process.nextTick(() => history.push(`/manual/${selectId}/tree`));
    }
  }

  handleCancel = () => this.props.history.goBack();

  handleShowVS = (showVS: boolean) => () => this.setState({showVS});

  render() {
    const { modeRef, buttonRef, classes } = this.props;
    const { mode, node, memos, cannotSaveReason, showVS, saved } = this.state;
  
    const nodeProps: NodeEditorProps = {
      mode,
      node,
      memos,
      edit: this.edit,
      deleteMemo: this.deleteMemo,
      addMemo: this.addMemo,
      editMemo: this.editMemo,
    };

    const getStyle = (buttonMode: NodeEditMode): React.CSSProperties => {
      return mode === buttonMode
      ? { height: '100%', backgroundColor: theme.palette.background.paper, borderLeftColor: 'rgba(0, 0, 0, 0.24)' }
      : { height: '100%' };
    };
    const hasDifference = TreeUtil._hasDifference(this.props.node, this.state.node);
    return (
      <div>
        <Portal container={modeRef.current}>
          <Box mt={0.9} mr={2}>
            <ButtonGroup size="small">
              <Button style={getStyle('d')}  onClick={() => this.setState({mode: 'd'})} ><Divergent/></Button>
              <Button style={getStyle('dc')} onClick={() => this.setState({mode: 'dc'})}><Divergent/><Convergent className={classes.convergent}/></Button>
              <Button style={getStyle('c')}  onClick={() => this.setState({mode: 'c'})} ><Convergent className={classes.convergent}/></Button>
            </ButtonGroup>
          </Box>
        </Portal>
        <Portal container={buttonRef.current}>
          <Box display="flex" flexDirection="row" mt={0.7}>
            <Button onClick={this.handleCancel}>キャンセル</Button>
            <Button color="primary" onClick={this.save}>編集完了</Button>
          </Box>
        </Portal>

        <Prompt
          when={hasDifference && !saved}
          message="編集内容を保存していません。編集を終了して良いですか？"
        />

        <NodeEditorContainer {...nodeProps}/>

        <Modal
          open={showVS}
          onClose={this.handleShowVS(false)}
          BackdropProps={{className: classes.viewSettingModal}}
          disableAutoFocus
        >
          <ViewSettingsContainer />
        </Modal>

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
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(EditorFrameComponent));