import * as React from 'react';

import {
  Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Grid, Typography
} from '@material-ui/core';

interface SimilarityCellProps {
  label: string;
  value: string;
}

const SimilarityCell: React.SFC<SimilarityCellProps> = (props: SimilarityCellProps) => {
  const {label, value} = props;
  return (
    <Grid container justify="space-between">
      <Grid item>
        <Typography>{label}</Typography>
      </Grid>
        <Typography>{value}</Typography>
    </Grid>
  )
}

export default SimilarityCell;