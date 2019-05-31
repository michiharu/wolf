import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, Button, Grid, TextField, Switch, FormControlLabel
} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';

const styles = (theme: Theme) => createStyles({
  root: {

  },
  container: { padding: theme.spacing(2) },
  switch: {
    width: 200,
    margin: theme.spacing(1)
  },
});

interface Props extends WithStyles<typeof styles> {
  manual: Manual;
}

const DeleteForm: React.FC<Props> = props => {
  const { classes } =  props;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h5">マニュアルの非公開・削除</Typography>
      </div>
      <div className={classes.container}>
        <FormControlLabel
          className={classes.switch}
          control={<Switch checked={true} color="primary"/>}
          label="公開"
        />
      </div>
      <div className={classes.container}>
        <Grid container alignItems="flex-end" spacing={3}>
          <Grid item xs={9}>
            <TextField placeholder="マニュアル名を入力してください" fullWidth/>
          </Grid>
          <Grid item><Button variant="contained" color="primary">削除</Button></Grid>
        </Grid>
      </div>
    </div>
  );
}
export default withStyles(styles)(DeleteForm);