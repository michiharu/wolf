import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
  Typography, Button, FormControl, FormControlLabel, InputLabel, Select, MenuItem, Switch, Grid

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

const Operation: React.FC<Props> = props => {
  const { manual, classes } =  props;
  const status = manual.inOperation ? '運用中' : manual.reviewer !== null ? '運用申請中' : '準備中';
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="caption">運用</Typography>
        <Typography variant="h5">{status}</Typography>        
      </div>
      {!manual.inOperation && manual.reviewer === null &&
      <div className={classes.container}>
        <Grid container alignItems="flex-end" spacing={24}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>運用レビュー申請</InputLabel>
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
          <Grid item><Button variant="contained" color="primary">申請</Button></Grid>
        </Grid>
      </div>}
      {!manual.inOperation && manual.reviewer !== null &&
      <div className={classes.container}>
        <Button variant="contained" color="primary" fullWidth>このマニュアルを承認する</Button>
      </div>}
      {manual.inOperation &&
      <>
        <div className={classes.container}>
          <Grid container alignItems="flex-end" spacing={24}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>マニュアル使用者追加</InputLabel>
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
        <div className={classes.container}>
          <FormControlLabel
            control={<Switch checked/>}
            label="Secondary"
            labelPlacement="start"
          />
        </div>
      </>}
      {manual.inOperation && <div className={classes.container}>
        <Grid container alignItems="flex-end" spacing={24}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>運用レビュー申請</InputLabel>
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
          <Grid item><Button variant="contained" color="primary">申請</Button></Grid>
        </Grid>
      </div>}
    </div>
  );
}
export default withStyles(styles)(Operation);