import * as React from 'react';
import {
  Theme, createStyles, WithStyles, Grid, Paper, withStyles,
} from '@material-ui/core';

import { TreeNode, Manual, PullRequest } from '../../../data-types/tree';
import NodeViewerContainer from '../view/node-viewer/node-viewer-container';
import RequestViewerComponent from '../view/request-node-viewer/request-node-viewer';
import { Action } from 'typescript-fsa';
import { KSState } from '../../../redux/states/ksState';
import { RSState } from '../../../redux/states/rsState';

export const styles = (theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  toolbar: {
    display: 'flex',
    width: theme.breakpoints.width('md'),
    margin: 'auto',
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  convergent: {
    transform: 'scale(1, -1)',
  },
  close: {
    padding: theme.spacing(0.5),
  },
  editFinishButton: {
    marginLeft: theme.spacing(1),
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

  const { request, reqNode, setReqNode, ks, rs, classes } = props

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

export default withStyles(styles)(RequestComponent);