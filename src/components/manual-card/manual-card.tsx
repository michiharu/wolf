import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Divider, Typography, Link
} from '@material-ui/core';
import { ManualWithUser } from '../../data-types/tree';
import { MemoryRouter as Router } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
});

interface ManualCardProps extends WithStyles<typeof styles> {
  manual: ManualWithUser;
  isFirst: boolean;
}

const ManualCard: React.FC<ManualCardProps> = props => {
  const { manual, isFirst, classes} = props;
  const { owner } = manual;
  return (
    <Router>
      <div className={classes.root}>
        {!isFirst && <Divider className={classes.divider}/>}
        <Typography variant="caption">{`${owner.lastName} ${owner.firstName}`}</Typography>
        <Link component={RouterLink} to={`/manual/${manual.id}`}>
          <Typography variant="h5">{manual.label}</Typography>
        </Link>
      </div>
    </Router>
  );
}

export default withStyles(styles)(ManualCard);