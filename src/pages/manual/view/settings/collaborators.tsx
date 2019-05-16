import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, Chip, Button, FormControl, InputLabel, Select, MenuItem, Grid

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

const Collaborators: React.FC<Props> = props => {
  const { manual, classes } =  props;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="caption">オーナー</Typography>
        <Chip className={classes.chip} label={manual.ownerId}/>
      </div>
      <div className={classes.container}>
        <Typography variant="caption">コラボレーター</Typography>
        {manual.collaboratorIds.map(c => <Chip className={classes.chip} label={c} onDelete={() => {}}/>)}
      </div>
      <div className={classes.container}>
        <Grid container alignItems="flex-end" spacing={24}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>コラボレーターの追加</InputLabel>
              <Select>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>ユーザー１</MenuItem>
                <MenuItem value={20}>ユーザー２</MenuItem>
                <MenuItem value={30}>ユーザー３</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item><Button variant="contained" color="primary">追加</Button></Grid>
        </Grid>
      </div>
    </div>
  );
}
export default withStyles(styles)(Collaborators);