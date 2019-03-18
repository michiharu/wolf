import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Typography, InputAdornment, TextField } from '@material-ui/core';

interface Props {
  icon: React.ReactElement<any>;
  label?: string;
  right?: boolean;
  gutter?: boolean;
  children: string;
}

const WithIcon: React.SFC<Props> = (props: Props) => {
  const { icon, label, right, gutter, children } = props;

  const isRight = right !== undefined ? right : false;
  return (
    <Grid container>
      {!isRight && <Grid item xs>
        <TextField
          label={label}
          value={children}
          InputProps={{startAdornment: <InputAdornment position="start">{icon}</InputAdornment>}}
          fullWidth
          disabled
        />
      </Grid>}
      {!isRight && gutter && <Grid item style={{width: 32}}/>}

      {isRight && gutter && <Grid item style={{width: 32}}/>}
      {isRight && <Grid item xs>
        <TextField
          label={label}
          value={children}
          InputProps={{endAdornment: <InputAdornment position="end">{icon}</InputAdornment>}}
          fullWidth
          disabled
        />
      </Grid>}

    </Grid>
  );
}

export default WithIcon;