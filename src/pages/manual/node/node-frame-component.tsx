import * as React from 'react';
import {
  Theme, createStyles, WithStyles,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Modal, withStyles, Portal, Box,
} from '@material-ui/core';

import { TreeNode, Manual, KTreeNode, baseKWithArrow } from '../../../data-types/tree';
import TreeUtil from '../../../func/tree';
import NodeContainer from './node-container';
import { EditorFrameActions } from './node-frame-container';
import ViewSettingsContainer from '../../../components/view-settings/view-settings-container';
import { NodeEditorProps } from './node-component';
import { TreePutRequest } from '../../../api/definitions';
import { RouteComponentProps, withRouter, Prompt } from 'react-router';
import KTreeUtil from '../../../func/k-tree';
import { KSState } from '../../../redux/states/ksState';

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

interface Props extends KSState, EditorFrameActions, RouteComponentProps, WithStyles<typeof styles> {
  manual: Manual;
  node: TreeNode;
  buttonRef: React.RefObject<HTMLDivElement>;
}

interface State {
  node: KTreeNode;
  cannotSaveReason: CannotSaveReason;
  showVS: boolean;
  saved: boolean;
}

export type CannotSaveReason = 'switch' | 'case' | null;

class EditorFrameComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { node, ks, location } = props;
    const isEditing = location.pathname.slice(-4) === 'edit';

    this.state = {
      node: KTreeUtil.setCalcProps(TreeUtil._get(node, baseKWithArrow), ks, isEditing),
      cannotSaveReason: null,
      showVS: false,
      saved: false,
    };
  }

  edit = (editNode: KTreeNode) => {
    const { ks, location } = this.props;
    const isEditing = location.pathname.slice(-4) === 'edit';
    this.setState({ node: KTreeUtil.setCalcProps(editNode, ks, isEditing) });
  }

  save = () => {
    const { manual, putTree, history } = this.props;
    const { node } = this.state;
    const isAllSwitchHasCase = TreeUtil._isAllSwitchHasCase(node);
    const isAllCaseHasItem = TreeUtil._isAllCaseHasItem(node);
    const cannotSaveReason: CannotSaveReason = !isAllSwitchHasCase ? 'switch' :　!isAllCaseHasItem ? 'case' : null;
    this.setState({ cannotSaveReason });
    if (cannotSaveReason === null) {
      const hasDifference = TreeUtil._hasDifference(this.props.node, this.state.node);
      if (hasDifference) {
        const params: TreePutRequest = { manualId: manual.id, rootTree: node };
        putTree(params);
      }
      this.setState({ saved: true })
      process.nextTick(() => history.push(`/manual/${manual.id}/tree`));
    }
  }

  handleCancel = () => this.props.history.goBack();

  handleShowVS = (showVS: boolean) => () => this.setState({ showVS });

  render() {
    const { buttonRef, classes, location } = this.props;
    const { node, cannotSaveReason, showVS, saved } = this.state;
    const isEditing = location.pathname.slice(-4) === 'edit';
    const nodeProps: NodeEditorProps = {
      node,
      isEditing,
      edit: this.edit,
    };

    const hasDifference = TreeUtil._hasDifference(this.props.node, this.state.node);
    return (
      <div>
        {isEditing && (
          <Portal container={buttonRef.current}>
            <Box display="flex" flexDirection="row" mt={0.7}>
              <Button onClick={this.handleCancel}>キャンセル</Button>
              <Button color="primary" onClick={this.save}>編集完了</Button>
            </Box>
          </Portal>)}
        <Prompt
          when={hasDifference && !saved}
          message="編集内容を保存していません。編集を終了して良いですか？"
        />

        <NodeContainer {...nodeProps} />

        <Modal
          open={showVS}
          onClose={this.handleShowVS(false)}
          BackdropProps={{ className: classes.viewSettingModal }}
          disableAutoFocus
        >
          <ViewSettingsContainer />
        </Modal>

        <Dialog open={cannotSaveReason !== null} onClose={() => this.setState({ cannotSaveReason: null })}>
          <DialogTitle>このデータは保存できません</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {cannotSaveReason === 'switch' && 'すべての分岐には、１つ以上の条件を設定して下さい。'}
              {cannotSaveReason === 'case' && 'すべての条件には、１つ以上の詳細項目を設定して下さい。'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ cannotSaveReason: null })} color="primary" autoFocus>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(EditorFrameComponent));