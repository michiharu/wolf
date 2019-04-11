import _ from 'lodash';
import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
} from '@material-ui/core';

import { TreeNode, Tree } from '../../../data-types/tree-node';
import { tes as defaultTES } from '../../../settings/layout';

import TreeUtil from '../../../func/tree';
import keys from '../../../settings/storage-keys';
import TextEditSettings from '../../../data-types/text-edit-settings';
import TextLineWithIcon, { TextLineWithIconProps } from './text-line-with-icon';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    padding: theme.spacing.unit * 2,
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

export interface TextEditorProps {
  selected: boolean;
  commonNodes: Tree[];
  node: TreeNode;
  isCommon: string;
  edit: (node: TreeNode) => void;
  addCommonList: (node: TreeNode) => void;
  deleteCommonList: (node: TreeNode) => void;
  addNode: (node: TreeNode) => void;
}

interface Props extends TextEditorProps, WithStyles<typeof styles> {}

interface State {
  tes: TextEditSettings;
}

class TextEditor extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = TextEditor.getInitialState();
  }

  static getInitialState = (): State => {
    const tesFromStorage = localStorage.getItem(keys.tes);
    const tes = tesFromStorage !== null ? JSON.parse(tesFromStorage) as TextEditSettings : defaultTES;
    return {
      tes,
    };
  }

  changeNode = (target: TreeNode) => {
    const {node, edit} = this.props;
    edit(TreeUtil._replace(node, target));
  }


  deleteSelf = (target: TreeNode) => {
    const {node, edit} = this.props;
    edit(TreeUtil._deleteById(node, target.id));
  }

  render() {
    const { node, commonNodes, classes } = this.props;

    const textLineWithIconProps: TextLineWithIconProps = {
      itemNumber: node.label,
      node,
      commonNodes,
      changeNode: this.changeNode,
      deleteSelf: this.deleteSelf,
    };

    return (
      <div className={classes.root}>
        <TextLineWithIcon {...textLineWithIconProps}/>
      </div>
    );
  }
}

export default withStyles(styles)(TextEditor);