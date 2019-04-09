import * as React from 'react';
import {
  WithStyles, Theme, createStyles, Button, TableRow, TableCell, Grid, withStyles, IconButton, Menu, MenuItem, ListItemIcon, ListItemText
} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { TreeNode } from '../../data-types/tree-node';
import { Task, Switch, Case, Delete } from '../../settings/layout';

const styles = (theme: Theme) => createStyles({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    }
  },
  expand: { paddingLeft: theme.spacing.unit * 2 },
  switchIcon: {
    transform: 'scale(1, -1)',
  },
});

export interface ExpansionTreeProps {
  node: TreeNode;
  depth: number;
  openDepth: string;
  selectNode: (node: TreeNode) => void;
  deleteNode: (node: TreeNode) => void;
}

interface Props extends ExpansionTreeProps, WithStyles<typeof styles> {}

interface State {
  openDepth: string;
  open: boolean;
  anchorEl: any;
}

const paddingLeft = 32;

const ExpansionTree = withStyles(styles)(class extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      openDepth: props.openDepth,
      open: props.openDepth === 'all' || props.depth < Number(props.openDepth),
      anchorEl: null,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (prevState.openDepth !== nextProps.openDepth) {
      return {
        openDepth: nextProps.openDepth,
        open: nextProps.openDepth === 'all' || nextProps.depth < Number(nextProps.openDepth)
      };
    }
    return null;
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleMore = (e: any) => this.setState({ anchorEl: e.currentTarget });

  render() {
    const { node, depth, openDepth, selectNode, deleteNode, classes } = this.props;
    const { open, anchorEl } = this.state;

    return (
      <>
        <TableRow className={classes.row}>
          <TableCell style={{paddingLeft: paddingLeft * depth}}>
            <Grid container alignItems="center" spacing={8} className={classes.expand}>
              <Grid item>
                {open
                ? <ExpandMore onClick={this.handleToggle}/>
                : <ExpandMore onClick={this.handleToggle} style={{ transform: 'rotate(-90deg)'}}/>}
              </Grid>
              <Grid item>
                {node.type === 'task' ? <Task/> :
                 node.type === 'switch' ? <Switch className={classes.switchIcon}/> : <Case/>}
              </Grid>
              <Grid item>
                <Button size="small" onClick={() => selectNode(node)}>{node.label}</Button>
              </Grid>
            </Grid>
          </TableCell>
          <TableCell style={{paddingRight: 8}}>
            <Grid container justify="flex-end">
              <Grid item>
                <IconButton onClick={this.handleMore}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => this.setState({anchorEl: null})}>
                  <MenuItem onClick={() => {deleteNode(node); this.setState({anchorEl: null});}}>
                    <ListItemIcon><Delete /></ListItemIcon>
                    <ListItemText inset primary="削除" />
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>

        {open && node.children.map((c, i) => (
          <ExpansionTree
            key={`tree-${depth}-${i}`}
            node={c}
            depth={depth + 1}
            openDepth={openDepth}
            selectNode={selectNode}
            deleteNode={deleteNode}
          />
        ))}
      </>
    );
  }
});

export default ExpansionTree;