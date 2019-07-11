import * as React from 'react';
import {
  Theme, createStyles, WithStyles,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Modal, withStyles, Portal, Box, Paper, ButtonGroup,
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
import { Undo, Redo } from '@material-ui/icons';
import TreeNodeUtil from '../../../func/tree-node';
import { throttle } from 'lodash-es';

export const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
  },
  toolArea: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
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
  stream: KTreeNode[];
  streamPointer: number;
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
    const kWith = KTreeUtil.setCalcProps(TreeUtil._get(node, baseKWithArrow), ks, isEditing);

    this.state = {
      node: kWith,
      stream: [kWith],
      streamPointer: 0,
      cannotSaveReason: null,
      showVS: false,
      saved: false,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  updateStream = () => {
    const {node, stream, streamPointer} = this.state;
    const isEditing = this.props.location.pathname.slice(-4) === 'edit';
    if (!isEditing) { return; }

    const dragNode = TreeNodeUtil._getDragNode(node);
    if (dragNode !== undefined) { return; }

    const current = stream[streamPointer];
    const hasDifference = TreeUtil._hasDifferenceWithAppearance(current, node);
    if (!hasDifference) { return; }

    const slicedStream = stream.slice(0, streamPointer + 1);

    const newStream = slicedStream.concat([TreeNodeUtil._deleteFocus(node)])
    console.log('stream.length: ' + newStream.length);
    this.setState({stream: newStream, streamPointer: streamPointer + 1});
  }

  updateStreamThrottle = throttle(this.updateStream, 3000);

  handleKeydown = (event: KeyboardEvent) => {
    const {stream, streamPointer} = this.state;
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'z' && !event.shiftKey && streamPointer !== 0) {
        this.undo();
      }
      if ((event.key === 'y' || (event.key === 'z' && event.shiftKey)) && streamPointer !== (stream.length - 1)) {
        this.redo();
      }
    }
  }

  edit = (editNode: KTreeNode) => {
    const { ks, location } = this.props;
    const isEditing = location.pathname.slice(-4) === 'edit';
    this.setState({ node: KTreeUtil.setCalcProps(editNode, ks, isEditing) });
    if (this.state.streamPointer === 0) { this.updateStream(); }
    this.updateStreamThrottle();
  }

  undo = () => {
    const { stream, streamPointer } = this.state;
    const nextPointer = streamPointer - 1;
    this.setState({node: stream[nextPointer], streamPointer: nextPointer});
  }

  redo = () => {
    const { stream, streamPointer } = this.state;
    const nextPointer = streamPointer + 1;
    this.setState({node: stream[nextPointer], streamPointer: nextPointer});
  }

  save = () => {
    const { manual, putTree, history } = this.props;
    const { node } = this.state;
    const isAllSwitchHasCase = TreeUtil._isAllSwitchHasCase(node);
    // const isAllCaseHasItem = TreeUtil._isAllCaseHasItem(node);
    const cannotSaveReason: CannotSaveReason = !isAllSwitchHasCase ? 'switch' : null;
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

  handleCancel = () => {
    const { node: propNode, ks, location, history } = this.props;
    const isEditing = location.pathname.slice(-4) === 'edit';
    const node = KTreeUtil.setCalcProps(TreeUtil._get(propNode, baseKWithArrow), ks, isEditing);
    this.setState({node, stream: [node], streamPointer: 0});
    history.goBack();
  }

  handleShowVS = (showVS: boolean) => () => this.setState({ showVS });

  render() {
    const { buttonRef, classes, location } = this.props;
    const { node, cannotSaveReason, showVS, saved, stream, streamPointer } = this.state;
    const isEditing = location.pathname.slice(-4) === 'edit';
    const nodeProps: NodeEditorProps = {
      node,
      isEditing,
      edit: this.edit,
    };

    const hasDifference = TreeUtil._hasDifference(this.props.node, this.state.node);
    return (
      <div className={classes.root}>
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

        {isEditing &&
        <Paper className={classes.toolArea}>
          <ButtonGroup color="primary">
            <Button onClick={this.undo} disabled={streamPointer === 0}><Undo/></Button>
            <Button onClick={this.redo} disabled={streamPointer === (stream.length - 1)}><Redo/></Button>
          </ButtonGroup>
        </Paper>}

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