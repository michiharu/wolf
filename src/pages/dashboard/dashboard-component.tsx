import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Grid, Theme, createStyles, WithStyles, withStyles
} from '@material-ui/core';
import { Tree } from '../../data-types/tree-node';

import ManualList from './manual-list-component';

const styles = (theme: Theme) => createStyles({

  container: {
    padding: theme.spacing.unit
  }

});

interface Props extends WithStyles<typeof styles> {}

const Dashboard: React.FC<Props> = (props: Props) => {
  const { classes } = props;
  
  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <div className={classes.container}>
          <ManualList/>
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
      
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Dashboard);