import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Portal, Button, Box,
} from '@material-ui/core';

import { TreeNode, Manual } from '../../../../data-types/tree';
import TreeUtil from '../../../../func/tree';
import TextLineWithIcon, { TextLineWithIconProps } from './text-line-with-icon';
import { Action } from 'typescript-fsa';
import { Prompt, withRouter, RouteComponentProps } from 'react-router-dom';
import { TreePutRequest } from '../../../../api/definitions';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    padding: theme.spacing(2),
  },
  saveButton: {
    minWidth: 100,
  },
  extendedIcon: {
    marginLeft: theme.spacing(1),
  },
  close: {
    padding: theme.spacing(0.5),
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

export interface TextEditorProps {
  manual: Manual;
  node: TreeNode;
  isEditing: boolean;
  putTree: (params: TreePutRequest) => Action<TreePutRequest>;
  buttonRef: React.RefObject<HTMLDivElement>;
}

interface Props extends TextEditorProps, RouteComponentProps, WithStyles<typeof styles> {}

interface State {
  node: TreeNode;
  saved: boolean;
}

class TextEditor extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {node: props.node, saved: false};
  }

  save = () => {
    const { manual, putTree, history } = this.props;
    const { node } = this.state;
    const hasDifference = TreeUtil._hasDifference(this.props.node, this.state.node);
    if (hasDifference) {
      const params: TreePutRequest = {manualId: manual.id, rootTree: node };
      putTree(params);
    }
    this.setState({saved: true})
    process.nextTick(() => history.push(`/manual/${manual.id}/text`));
  }

  changeNode = (target: TreeNode) => {
    const {node} = this.state;
    this.setState({node: TreeUtil._replace(node, target)});
  }


  deleteSelf = (target: TreeNode) => {
    const {node} = this.state;
    this.setState({node: TreeUtil._deleteById(node, target.id)});
  }

  render() {
    const { buttonRef, isEditing, classes } = this.props;
    const { node, saved } = this.state;

    const textLineWithIconProps: TextLineWithIconProps = {
      itemNumber: node.label,
      node,
      isEditing,
      changeNode: this.changeNode,
    };
    const hasDifference = TreeUtil._hasDifference(this.props.node, this.state.node);
    return (
      <div className={classes.root}>
        {isEditing &&
        <>
          <Portal container={buttonRef.current}>
            <Box mt={0.7}>
              <Button color="primary" onClick={this.save}>編集完了</Button>
            </Box>
          </Portal>
          <Prompt
            when={hasDifference && !saved}
            message="編集内容を保存していません。編集を終了して良いですか？"
          />
        </>}
        
        <TextLineWithIcon {...textLineWithIconProps}/>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(TextEditor));