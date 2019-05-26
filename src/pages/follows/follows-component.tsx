import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Paper,
} from '@material-ui/core';
import { FollowsState } from '../../redux/states/followsState';
import { ManualWithUser } from '../../data-types/tree';
import { UsersState } from '../../redux/states/usersState';
import ManualCard from '../../components/manual-card/manual-card';

export const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: theme.breakpoints.width("md"),
    margin: "auto",
    paddingTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
  },
});

interface Props extends FollowsState, UsersState, WithStyles<typeof styles> {}

const FollowsComponent: React.FC<Props> = props => {
  const { follows, users, classes } = props;
  const manualWithUsers: ManualWithUser[] = follows.map(f => ({
    ...f,
    owner: users.find(u => f.ownerId === u.id)!,
    collaborators: users.filter(u => f.collaboratorIds.find(c => c === u.id) !== undefined),
    reviewer: users.find(u => f.reviewerId === u.id)!,
    assignUsers: users.filter(u => f.assignIds.find(c => c === u.id) !== undefined),
  }))
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {manualWithUsers.map((m, i) => <ManualCard key={m.id} manual={m} isFirst={i === 0}/>)}
      </Paper>
    </div>
  );
}

export default FollowsComponent;