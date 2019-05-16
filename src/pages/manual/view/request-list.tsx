import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Paper, Table, TableHead, TableRow, TableBody, TableCell

} from '@material-ui/core';
import { Manual } from '../../../data-types/tree';

const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: theme.breakpoints.width('md'),
    margin: 'auto',
    paddingTop: theme.spacing.unit * 3,
  },
  container: { padding: theme.spacing.unit * 2 },
  chip: { margin: theme.spacing.unit },
});

interface Props extends WithStyles<typeof styles> {
  manual: Manual;
}

const RequestList: React.FC<Props> = props => {
  const { manual, classes } = props;

  return (
    <div className={classes.root}>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>リクエスト内容</TableCell>
              <TableCell>リクエストユーザー名</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* <TableRow>

            </TableRow> */}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
export default withStyles(styles)(RequestList);