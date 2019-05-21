import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
  Typography, Button, FormControl, FormControlLabel, InputLabel, Select, MenuItem, Switch, Grid, TextField

} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';

const styles = (theme: Theme) => createStyles({
  root: {

  },
  container: { padding: theme.spacing.unit * 2 },
  chip: { margin: theme.spacing.unit },
});

interface Props extends WithStyles<typeof styles> {
  manual: Manual;
}

const Copy: React.FC<Props> = props => {
  const { manual, classes } =  props;
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h5">マニュアルを複製する</Typography>    
      </div>

      <div className={classes.container}>
        <Grid container alignItems="flex-end" spacing={24}>
          <Grid item xs={6}>
            <TextField
              placeholder="複製後のマニュアルタイトルを入力"
              fullWidth
            />
          </Grid>
          <Grid item><Button variant="contained" color="primary">複製する</Button></Grid>
        </Grid>
      </div>
    </div>
  );
}
export default withStyles(styles)(Copy);