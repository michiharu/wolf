import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useState } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, TextField,
  FormControl, InputLabel, Select, MenuItem, Button, AppBar, Toolbar, InputBase, FormControlLabel, Switch,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

import { TreeNode, Tree } from '../../data-types/tree-node';

import TreeUtil from '../../func/tree';
import DashboardList, { DashboardListProps } from './dashboard-list';
import link from '../../settings/path-list';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  appBar: {
    margin: 'auto',
    width: theme.breakpoints.width('lg'),

    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  toolbar: theme.mixins.toolbar,
  main: {
    margin: 'auto',
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit,
    width: theme.breakpoints.width('lg'),
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
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
  treeNodes: Tree[];
  commonNodes: Tree[];
  selectNode: (node: Tree | null) => void;
  addNode: (node: Tree) => void;
  deleteNode: (node: Tree) => void;
  addCommonList: (node: Tree) => void;
  deleteCommonList: (node: Tree) => void;
}

interface Props extends DashboardProps, WithStyles<typeof styles>, RouteComponentProps {}

const Dashboard: React.FC<Props> = (props: Props) => {
  const {
    treeNodes, commonNodes, selectNode: select,
    addNode, deleteNode, addCommonList, deleteCommonList, history, classes
  } = props;
  const [searchText, setSearchText] = useState('');
  const [openAll, setOpenAll] = useState(false);

  const words = TreeUtil.getSearchWords(searchText);
  const filteredNode = TreeUtil._searchAndFilter(words, treeNodes);

  const selectNode = (node: Tree | null) => {
    history.push(link.edit);
    select(node);
  }

  const originProps: DashboardListProps = {
    label: 'オリジナルマニュアル',
    nodes: filteredNode.filter(n => commonNodes.find(c => c.id === n.id) === undefined),
    openAll,
    selectNode,
    addNode: (node: Tree) => {
      addNode(node);
    },
    deleteNode
  };

  const commonProps: DashboardListProps = {
    label: '共通マニュアル',
    nodes: filteredNode.filter(n => commonNodes.find(c => c.id === n.id) !== undefined),
    openAll,
    selectNode,
    addNode: (node: Tree) => {
      addNode(node);
      addCommonList(node);
    },
    deleteNode
  };
  
  return (
    <div className={classes.root}>
      <AppBar color="default">
        <Toolbar className={classes.appBar}>
          <Grid container justify="space-between" alignItems="center" spacing={16}>
            <Grid item>
              <Button size="large">Flow Like</Button>
            </Grid>
            <Grid item xs={12} sm={8}>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  onChange={e => setSearchText(e.target.value)}
                />
              </div>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={openAll}
                    onChange={e => setOpenAll(e.target.checked)}
                    color="primary"
                  />
                }
                label="すべてを展開"
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar}/>
      <main className={classes.main}>
        <div className={classes.listContainer}>
          <DashboardList key={0} {...originProps}/>
        </div>
        <div className={classes.listContainer}>
          <DashboardList key={1} {...commonProps}/>
        </div>
      </main>
    </div>  
  );
};

export default withStyles(styles)(Dashboard);