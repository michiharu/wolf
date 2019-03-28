import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Divider, Avatar, Grid, Typography, Hidden, Paper
} from '@material-ui/core';

import { TreeNode } from '../../data-types/tree-node';
import { Task, Switch, Input, Output } from '../../settings/layout';

import Util from '../../func/util';
import WithIcon from '../with-icon/with-icon';
import { TreeNodeWithParents } from '../../data-types/tree-node';

const styles = (theme: Theme) => createStyles({
  card: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    maxWidth: 800, 
  },
  header: {marginBottom: theme.spacing.unit},
  label: {
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  xput: {
    padding: theme.spacing.unit * 2,
  },
  vDivider: {
    height: '100%',
    borderRight: 'solid 1px #cccc',
  },
  children: {
    padding: theme.spacing.unit * 2,
  }
});

export interface NodeCardProps {
  node: TreeNodeWithParents;
  selectNode: (node: TreeNode | null) => void;
}

interface Props extends NodeCardProps, WithStyles<typeof styles> {}

const NodeCard: React.FC<Props> = (props: Props) => {

  const { node: n, selectNode, classes } = props;
  const hasInfo = !Util.isEmpty(n.input) || !Util.isEmpty(n.output);
  const hasChildren = n.children.length !== 0;
  
  return ( 
    <Paper className={classes.card} elevation={1}>
      <Grid container className={(hasInfo || hasChildren) ? classes.header : undefined} spacing={16}>
        <Grid item><Avatar>{n.type === 'task' ? <Task/> : <Switch/>}</Avatar></Grid>
        <Grid item xs>
          <Typography color="textSecondary">
            {n.parents.length !== 0 && n.parents.map(p => p.label).reduce((a, b) => `${a} ＞ ${b}`)}
          </Typography>
          <Typography variant="h5" className={classes.label} onClick={() => selectNode(n)}>
            {n.label}
            </Typography>
        </Grid>
      </Grid>

      {(hasInfo || hasChildren) && <>
        <Divider/>
        <Grid container>

          {hasInfo && (
          <Grid item xs={12} sm={5}>
            <div className={classes.xput}>
              {!Util.isEmpty(n.input) && <WithIcon icon={<Input/>} gutter>{n.input}</WithIcon>}
              {!Util.isEmpty(n.output) && <WithIcon icon={<Output/>} right gutter>{n.output}</WithIcon>}
            </div>
          </Grid>)}
          
          <Hidden xsDown>
            {hasInfo && hasChildren && <Grid item><div className={classes.vDivider}/></Grid>}
          </Hidden>
          
          {hasChildren && (
          <Grid item xs>
            <div className={classes.children}>
              {n.children.length > 0 && <Typography variant="body2">・{n.children[0].label}</Typography>}
              {n.children.length > 1 && <Typography variant="body2">・{n.children[1].label}</Typography>}
              {n.children.length > 2 && <Typography variant="body2">・{n.children[2].label}</Typography>}
            </div>
          </Grid>)}
          
        </Grid>
      </>}
    </Paper>
  );
};

export default withStyles(styles)(NodeCard);