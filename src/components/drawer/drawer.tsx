import * as React from 'react';
import { useState, useEffect } from 'react';
import { Theme, createStyles, WithStyles, withStyles, ListItemIcon } from '@material-ui/core';
import { InputBase, Hidden, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { Drawer as MUIDrawer, List, Divider } from '@material-ui/core';
import { drawerWidth } from '../../pages/layout';
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
  switchIcon: {
    transform: 'scale(1, -1)',
  },
  drawerPaper: { width: drawerWidth },
  selected: {color: theme.palette.primary.main},
});

interface Props extends WithStyles<typeof styles> {
  open: boolean;
  toggle: () => void;

  nodeList: TreeNode[];
  selectedNodeList: TreeNode[];
  selectNode: (node: TreeNode) => void;
  changeNode: (node: TreeNode) => void;
}

const time = 1000;

const CustomDrawer: React.SFC<Props> = (props: Props) => {
  const { open, toggle, nodeList, selectedNodeList, selectNode, classes } = props;

  const [listOpen, setListOpen] = useState(false);

  useEffect(() => { setListOpen(true); });

  const spreadNodeList = selectedNodeList.length === 0 ? nodeList
                        : selectedNodeList[selectedNodeList.length - 1].children; 

  const content = (
    <React.Fragment>
      <div className={classes.toolbar}>
        <InputBase className={classes.input} placeholder="Search" />
      </div>
      {selectedNodeList.length !== 0 && (
        <React.Fragment>
          <Divider />
          <List dense>
            {selectedNodeList.map((n, i, arry) => {
              const isLast = i === selectedNodeList.length - 1;
              return (
                <ListItem button key={`selected-${n.id}`} onClick={() => selectNode(n)}>
                  <ListItemIcon>
                    {n.type === 'task' ? <Task/> : <Switch className={classes.switchIcon}/>}
                  </ListItemIcon>
                  <ListItemText primary={n.label} primaryTypographyProps={{color: isLast ? 'primary' : 'default'}}/>
                </ListItem>
              );
            })}
          </List>
        </React.Fragment>
      )}
      
      <Divider />
      <Collapse in={listOpen} timeout={{enter: time, exit: time}} unmountOnExit>
        <List dense>
          {spreadNodeList.map(n => (
          <ListItem button key={`spread-${n.id}`} onClick={() => selectNode(n)}>
            <ListItemIcon>
              {n.type === 'task' ? <Task/> : <Switch className={classes.switchIcon}/>}
            </ListItemIcon>
            <ListItemText primary={n.label}/>
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

export default withStyles(styles)(CustomDrawer);