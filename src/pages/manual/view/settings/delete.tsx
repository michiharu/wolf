import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, Chip, Button, FormControl, InputLabel, Select, MenuItem, Grid, TextField

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

const DeleteForm: React.FC<Props> = props => {
  const { manual, classes } =  props;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h5">マニュアルの削除</Typography>
      </div>
      <div className={classes.container}>
        <Grid container alignItems="flex-end" spacing={24}>
          <Grid item xs={9}>
            <TextField
              placeholder="マニュアル名を入力してください"
              fullWidth
            />
          </Grid>
          <Grid item><Button variant="contained" color="primary">削除</Button></Grid>
        </Grid>
      </div>
    </div>
  );
}
export default withStyles(styles)(DeleteForm);