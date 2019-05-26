import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Paper, Table, TableHead, TableRow, TableBody, TableCell, Button

} from '@material-ui/core';
import { Manual, PullRequest, baseTreeNode, Tree, TreeNode } from '../../../../data-types/tree';
import { Link } from 'react-router-dom';
import { RequestListActions } from './request-list-container';
import TreeUtil from '../../../../func/tree';
import TreeNodeUtil from '../../../../func/tree-node';

const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: theme.breakpoints.width('md'),
    margin: 'auto',
    paddingTop: theme.spacing(3),
  },
  container: { padding: theme.spacing(2) },
  chip: { margin: theme.spacing(1) },
});

interface Props extends RequestListActions, WithStyles<typeof styles> {
  manual: Manual;
}

const RequestListComponent: React.FC<Props> = props => {
  const { manual, setRequest, setReqNode, classes } = props;
  const selectRequest = (request: PullRequest) => () => {
    setRequest(request);
    const tree = TreeUtil._get<Tree, TreeNode>(request, baseTreeNode);
    setReqNode(TreeNodeUtil._init(tree));
  }
  return (
    <div className={classes.root}>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>リクエスト内容</TableCell>
              <TableCell>リクエストユーザー名</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {manual.pullRequests.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.requestMessage}</TableCell>
              <TableCell>{p.writerId}</TableCell>
              <TableCell>
                <Button color="primary" onClick={selectRequest(p)}>表示</Button>
              </TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
export default withStyles(styles)(RequestListComponent);