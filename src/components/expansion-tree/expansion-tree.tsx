import * as React from 'react';
import {
  WithStyles, Theme, createStyles, Button, TableRow, TableCell, Grid, withStyles
} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { TreeNode } from '../../data-types/tree-node';
import { Task, Switch, Case} from '../../settings/layout';

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

interface Props extends WithStyles<typeof styles> {
  node: TreeNode;
  depth: number;
  selectNode: (node: TreeNode) => void;
}
interface State {
  open: boolean;
}

const paddingLeft = 32;

const Tree = withStyles(styles)(class extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { open: true };
  }

  handleToggle = () => this.setState({open: !this.state.open})

  render() {
    const { node, depth, selectNode, classes } = this.props;
    const { open } = this.state;

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
                <Button size="small" onClick={() => selectNode(node)} color="primary">{node.label}</Button>
              </Grid>
            </Grid>
          </TableCell>
          <TableCell/>
        </TableRow>

        {open && node.children.map((c, i) => (
          <Tree
            key={`tree-${depth}-${i}`}
            node={c}
            depth={depth + 1}
            selectNode={selectNode}
          />
        ))}
      </>
    );
  }
});

export default Tree;