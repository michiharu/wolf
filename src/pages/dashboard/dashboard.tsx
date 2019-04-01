import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useState } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, TextField,
  FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';


import { TreeNode } from '../../data-types/tree-node';

import TreeUtil from '../../func/tree';
import DashboardList, { DashboardListProps } from './dashboard-list';
import link from '../../settings/path-list';

const styles = (theme: Theme) => createStyles({
  root: {
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    width: theme.breakpoints.width('lg'),

    [theme.breakpoints.down('md')]: {
      width: '100%',
    },

  },
  searchContainer: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  formControl: {
    minWidth: 100,
  },
  select: {
    textAlign: 'right',
  },
  listContainer: {
    marginBottom: theme.spacing.unit * 2,
  }
});

export interface DashboardProps {
  treeNodes: TreeNode[];
  commonNodes: TreeNode[];
  selectNode: (node: TreeNode | null) => void;
  addNode: (node: TreeNode) => void;
  addCommonList: (node: TreeNode) => void;
  deleteCommonList: (node: TreeNode) => void;
}

interface Props extends DashboardProps, WithStyles<typeof styles>, RouteComponentProps {}

const Dashboard: React.FC<Props> = (props: Props) => {
  const {
    treeNodes, commonNodes, selectNode: select,
    addNode, addCommonList, deleteCommonList, history, classes
  } = props;
  const [searchText, setSearchText] = useState('');
  const [openDepth, setOpenDepth] = useState<string>('all');

  const words = TreeUtil.getSearchWords(searchText);
  const filteredNode = TreeUtil._searchAndFilter(words, treeNodes);

  const selectNode = (node: TreeNode | null) => {
    history.push(link.edit);
    select(node);
  }

  const originProps: DashboardListProps = {
    label: 'オリジナルマニュアル',
    nodes: filteredNode.filter(n => commonNodes.find(c => c.id === n.id) === undefined),
    openDepth,
    selectNode,
    addNode: (node: TreeNode) => {
      addNode(node);
    },
  };

  const commonProps: DashboardListProps = {
    label: '共通マニュアル',
    nodes: filteredNode.filter(n => commonNodes.find(c => c.id === n.id) !== undefined),
    openDepth,
    selectNode,
    addNode: (node: TreeNode) => {
      addNode(node);
      addCommonList(node);
    },
  };
  
  return (
    <div className={classes.root}>

      <Grid container className={classes.searchContainer} justify="space-between">
        <Grid item xs={12} sm={8}>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Search field"
                type="search"
                onChange={e => setSearchText(e.target.value)}
                margin="none"
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justify="flex-end" alignItems="flex-end" spacing={16}>
            <Grid item>
              <FormControl>
                <InputLabel>展開する深さ</InputLabel>
                <Select
                  className={classes.formControl}
                  classes={{ select: classes.select}}
                  value={openDepth}
                  onChange={e => setOpenDepth(e.target.value)}>
                  <MenuItem value="0">すべてを閉じる</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="all">すべてを展開</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div className={classes.listContainer}>
        <DashboardList key={0} {...originProps}/>
      </div>
      <div className={classes.listContainer}>
        <DashboardList key={1} {...commonProps}/>
      </div>
    </div>  
  );
};

export default withStyles(styles)(Dashboard);