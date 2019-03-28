import * as React from 'react';
import { useState, useEffect } from 'react';
import { Theme, createStyles, WithStyles, withStyles, ListItemIcon } from '@material-ui/core';
import { InputBase, Hidden, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { Drawer as MUIDrawer, List, Divider } from '@material-ui/core';
import { drawerWidth } from '../../settings/layout';
import TreeNode from '../../data-types/tree-node';
import { Task, Switch} from '../../settings/layout';

const styles = (theme: Theme) => createStyles({
  root: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    paddingTop: theme.spacing.unit * 2,
  },
  input: {
    marginLeft: theme.spacing.unit * 2,
    flex: 1,
  },
  itemText: {
    marginLeft: -theme.spacing.unit * 2
  },
  switchIcon: {
    transform: 'scale(1, -1)',
  },
  drawerPaper: { width: drawerWidth },
  selected: {color: theme.palette.primary.main},
});

export interface DrawerProps {
  open: boolean;
  toggle: () => void;

  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  selectNode: (node: TreeNode) => void;
  changeNode: (node: TreeNode) => void;
}

interface Props extends DrawerProps, WithStyles<typeof styles> {
  open: boolean;
  toggle: () => void;

  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  selectNode: (node: TreeNode) => void;
  changeNode: (node: TreeNode) => void;
}


const time = 1000;

const Drawer: React.SFC<Props> = (props: Props) => {
  const { open, toggle, treeNodes, selectedNodeList, selectNode, classes } = props;

  const [listOpen, setListOpen] = useState(false);

  useEffect(() => { setListOpen(true); });

  const spreadNodeList = selectedNodeList === null ? null : selectedNodeList.length === 0 ? treeNodes
                        : selectedNodeList[selectedNodeList.length - 1].children;
  const selectAndClose = (node: TreeNode) => {
    if (open) { toggle(); }
    selectNode(node);
  } 

  const content = (
    <React.Fragment>
      <div className={classes.toolbar}>
        <InputBase className={classes.input} placeholder="Search" />
      </div>
      {selectedNodeList !== null && selectedNodeList.length !== 0 && (
        <React.Fragment>
          <Divider />
          <List dense>
            {selectedNodeList.map((n, i, arry) => {
              const isLast = i === selectedNodeList.length - 1;
              return (
                <ListItem button key={`selected-${n.id}`} onClick={() => selectAndClose(n)}>
                  <ListItemIcon>
                    {n.type === 'task' ? <Task/> : <Switch className={classes.switchIcon}/>}
                  </ListItemIcon>
                  <ListItemText
                    className={classes.itemText}
                    primary={n.label}
                    primaryTypographyProps={{color: isLast ? 'primary' : 'default'}}
                  />
                </ListItem>
              );
            })}
          </List>
        </React.Fragment>
      )}
      
      <Divider />
      <Collapse in={listOpen} timeout={{enter: time, exit: time}} unmountOnExit>
        <List dense>
          {spreadNodeList === null ? <p>表示するデータがありません。</p> :
            
            spreadNodeList.map(n => (
          <ListItem button key={`spread-${n.id}`} onClick={() => selectAndClose(n)}>
            <ListItemIcon>
              {n.type === 'task' ? <Task/> : <Switch className={classes.switchIcon}/>}
            </ListItemIcon>
            <ListItemText className={classes.itemText} primary={n.label}/>
          </ListItem>))}
        </List>
      </Collapse>
      
    </React.Fragment>
  );

  return (
    <nav className={classes.root}>
      <Hidden mdUp implementation="css">
        <MUIDrawer
          variant="temporary"
          open={open}
          onClose={toggle}
          classes={{paper: classes.drawerPaper}}
        >
          {content}
        </MUIDrawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <MUIDrawer
          classes={{paper: classes.drawerPaper}}
          variant="permanent"
          open
        >
          {content}
        </MUIDrawer>
      </Hidden>
    </nav>
  );
}

export default withStyles(styles)(Drawer);