import * as React from 'react';
import {useState} from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualState } from '../../../redux/states/manualState';
import {
  Theme, createStyles, WithStyles, IconButton, Button, Tab, Tabs, Grid, Paper,
} from '@material-ui/core';

import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Tree, TreeNode, baseTreeNode, KTreeNode, Manual } from '../../../data-types/tree';
import { RouteComponentProps, withRouter } from 'react-router';
import TreeUtil from '../../../func/tree';
import { RequestActions } from './request-container';
import NodeViewer from '../view/node-viewer';
import TreeNodeUtil from '../../../func/tree-node';

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
  ManualState,
  RequestActions,
  WithStyles<typeof styles>,
  RouteComponentProps<{id: string, requestId: string}> {}

export type CannotSaveReason = 'switch' | 'case' | null;

const RequestComponent: React.FC<Props> = props => {

  const { manuals, match, classes } = props;
  const [node, setNode] = useState<TreeNode | null>(null);
  const [reqNode, setReqNode] = useState<TreeNode | null>(null);

  const manual = TreeUtil._findArray(manuals, match.params.id)!;
  if (node === null) {
    const tree = TreeUtil._get<Tree, TreeNode>(manual, baseTreeNode);
    setNode(TreeNodeUtil._init(tree));
  }

  const request = manual.pullRequests.find(p => p.id === match.params.requestId)!
  if (reqNode === null) {
    const tree = TreeUtil._get<Tree, TreeNode>(request, baseTreeNode);
    setReqNode(TreeNodeUtil._init(tree));
  }
  
  const [tabIndex, setTabIndex] = useState(0);
  const [showVS, setShowVS] = useState(false);
  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <Tabs indicatorColor="primary" value={tabIndex} onChange={(_, i) => setTabIndex(i)}>
          <Tab label="ツリー表示" />
          <Tab label="テキスト表示" />
        </Tabs>

        <div style={{flexGrow: 1}} />
        <IconButton onClick={() => setShowVS(!showVS)}><ViewSettingsIcon/></IconButton>

        <Button variant="contained" color="primary" size="small" className={classes.editFinishButton}>リクエストの却下</Button>
        <Button variant="contained" color="primary" size="small" className={classes.editFinishButton}>手動でマージする</Button>
        <Button variant="contained" color="primary" size="small" className={classes.editFinishButton}>リクエストの採用</Button>
      </div>
      <Grid container>
        {node !== null &&
        <Grid item xs={6}>
          <div style={{position: 'relative'}}>
            <NodeViewer node={node} showViewSettings={showVS} edit={() => {}} closeViewSettings={() => {}}/>
            <Paper style={{position: 'absolute', top: 0, right: 0, padding: 8}}>
              オリジナル
            </Paper>
          </div>
        </Grid>}
        {reqNode !== null &&
        <Grid item xs={6}>
          <div style={{position: 'relative'}}>
            <NodeViewer node={reqNode} showViewSettings={showVS} edit={() => {}} closeViewSettings={() => {}}/>
            <Paper style={{position: 'absolute', top: 0, right: 0, padding: 8}}>
              {request.requestMessage}
            </Paper>
          </div>
        </Grid>}
      </Grid>
    </div>
  );
}

export default RequestComponent;