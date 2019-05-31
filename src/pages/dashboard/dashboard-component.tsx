import * as React from 'react';
import { Grid, Theme, createStyles, WithStyles, withStyles} from '@material-ui/core';

import ManualList from './manual-list-component';

const styles = (theme: Theme) => createStyles({

  container: {
    padding: theme.spacing(1),
  }

});

interface Props extends WithStyles<typeof styles> {}

const Dashboard: React.FC<Props> = (props: Props) => {
  const { classes } = props;
  
  return (
    <Grid container>
      <Grid item xs={12} lg={5}>
        <div className={classes.container}><ManualList/></div>
      </Grid>
      <Grid item xs={12} lg={7}>
      
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Dashboard);