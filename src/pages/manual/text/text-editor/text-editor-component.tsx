import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Portal, Button,
} from '@material-ui/core';

import { TreeNode, Manual } from '../../../../data-types/tree';
import TreeUtil from '../../../../func/tree';
import TextLineWithIcon, { TextLineWithIconProps } from './text-line-with-icon';
import { Action } from 'typescript-fsa';

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
  replaceManual: (manual: Manual) => Action<Manual>;
  setSelect: (manual: Manual) => Action<Manual>;
  editEnd: () => Action<void>;
  buttonRef: React.RefObject<HTMLDivElement>;
}

interface Props extends TextEditorProps, WithStyles<typeof styles> {}

interface State {
  node: TreeNode;
}

class TextEditor extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {node: props.node};
  }

  save = () => {
    const { manual, replaceManual, setSelect, editEnd } = this.props;
    const newManual: Manual = {...manual, rootTree: this.state.node};
    replaceManual(newManual);
    setSelect(newManual);
    editEnd();
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
    const { buttonRef, classes } = this.props;
    const { node } = this.state;

    const textLineWithIconProps: TextLineWithIconProps = {
      itemNumber: node.label,
      node,
      changeNode: this.changeNode,
      deleteSelf: this.deleteSelf,
    };

    return (
      <div className={classes.root}>
        <Portal container={buttonRef.current}>
          <Button color="primary" onClick={this.save} style={{height: '100%'}}>編集完了</Button>
        </Portal>
        <TextLineWithIcon {...textLineWithIconProps}/>
      </div>
    );
  }
}

export default withStyles(styles)(TextEditor);