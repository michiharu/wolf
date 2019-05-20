import * as React from 'react';
import {useState} from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualState } from '../../../redux/states/manualState';
import {
  Theme, createStyles, WithStyles, IconButton, Button, Tab, Tabs, Grid, Paper, withStyles,
} from '@material-ui/core';

import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Tree, TreeNode, baseTreeNode, KTreeNode, Manual, PullRequest } from '../../../data-types/tree';
import { RouteComponentProps, withRouter } from 'react-router';
import TreeUtil from '../../../func/tree';
import { RequestActions } from './request-container';
import NodeViewerContainer from '../view/node-viewer/node-viewer-container';
import RequestViewerComponent from '../view/request-node-viewer/request-node-viewer';
import { Action } from 'typescript-fsa';
import { KSState } from '../../../redux/states/ksState';
import { RSState } from '../../../redux/states/rsState';

export const styles = (theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  toolbar: {
    display: 'flex',
    width: theme.breakpoints.width('md'),
    margin: 'auto',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  convergent: {
    transform: 'scale(1, -1)',
  },
  close: {
    padding: theme.spacing.unit * 0.5,
  },
  editFinishButton: {
    marginLeft: theme.spacing.unit,
  }
});

interface Props extends
  KSState,
  RSState,
  WithStyles<typeof styles> {
  manuals: Manual[];
  manual: Manual;
  node: TreeNode;
  request: PullRequest;
  reqNode: TreeNode;
  changeManuals: (manuals: Manual[]) => Action<Manual[]>;
  setNode:   (node: TreeNode) => Action<TreeNode>;
  setReqNode: (reqNode: TreeNode) => Action<TreeNode>;
}

export type CannotSaveReason = 'switch' | 'case' | null;

const RequestComponent: React.FC<Props> = props => {

  const { manuals, node, request, reqNode, setReqNode, ks, rs, classes } = props;
  
  const [tabIndex, setTabIndex] = useState(0);
  const [showVS, setShowVS] = useState(false);
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6}>
          <div style={{position: 'relative'}}>
            <NodeViewerContainer/>
            <Paper style={{position: 'absolute', top: 8, right: 0, padding: 8}}>
              オリジナル
            </Paper>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{position: 'relative'}}>
            <RequestViewerComponent reqNode={reqNode} setReqNode={setReqNode} ks={ks} rs={rs} />
            <Paper style={{position: 'absolute', top: 8, right: 0, padding: 8}}>
              {request.requestMessage}
            </Paper>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default RequestComponent;