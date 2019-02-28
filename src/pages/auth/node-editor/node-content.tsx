import * as React from 'react';
import { Theme, createStyles, withStyles, WithStyles, IconButton, TextField, Badge, InputAdornment } from '@material-ui/core';
import { itemWidth, itemGrid, itemHeight } from './node-editor';
import TreeNode from '../../../data-types/tree-node';
import ClearIcon from '@material-ui/icons/Clear';
import ListIcon from '@material-ui/icons/List';
import AddIcon from '@material-ui/icons/Add';
import ReplyIcon from '@material-ui/icons/Reply';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
    width: itemWidth,
    height: itemHeight,
  },
  formArea: {
    position: 'absolute',
    width: '75%',
    height: '90%',
    top: '50%',
    left: '50%',
    transform: `translate(-50%,-50%)`
  },
  formContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  label: {position: 'absolute',top: 0},
  inputLabel: {position: 'absolute',top: 36},
  outputLabel: {position: 'absolute',top: 72},
  inputIcon: {
    transform: 'rotate(-110deg) scale(1, -1)',
  },
  outputIcon: {
    transform: 'rotate(170deg) scale(1, -1)',
  },
  textfield: {
    fontSize: theme.typography.pxToRem(18),
  },
  addButton: {
    position: 'absolute',
    top: (itemGrid + itemHeight) / 2,
    left: '50%',
    transform: `translate(-50%,-50%)`,
  },
  deleteButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    transform: `translate(-50%,-50%)`,
  },
  childrenListIcon: {
    position: 'absolute',
    bottom: 6,
    right: 16,
  }
});

interface Props extends WithStyles<typeof styles> {
  nodeChildren: TreeNode[];
  i: number;
  isDown: boolean;
  changeLabel: (id: string) => (e: any) => void;
  handleDelete: (id: string, childrenCount: number) => void;
  add: (index: number) => void;
}

const NodeContent: React.SFC<Props> = (props: Props) => {
  const { nodeChildren, i, isDown, changeLabel, handleDelete, add, classes } = props;
  const child = nodeChildren[i];
  return (
    <div className={classes.root}>
      <div className={classes.formArea}>
        <div className={classes.formContainer}>
          <TextField
            className={classes.label}
            value={nodeChildren[i].label}
            onChange={changeLabel(nodeChildren[i].id)}
            fullWidth
          />
          <TextField
            className={classes.inputLabel}
            placeholder="インプット"
            value={nodeChildren[i].input}
            onChange={changeLabel(nodeChildren[i].id)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ReplyIcon className={classes.inputIcon} color="primary" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            className={classes.outputLabel}
            placeholder="アウトプット"
            value={nodeChildren[i].output}
            onChange={changeLabel(nodeChildren[i].id)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ReplyIcon className={classes.outputIcon} color="primary" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </div>
      </div>
      
      {!isDown &&
      <IconButton
        className={classes.deleteButton}
        onClick={() => handleDelete(nodeChildren[i].id, child.children.length)}
        onMouseDown={e => {e.stopPropagation();}}
      >
        <ClearIcon />
      </IconButton>}
      {child.children.length !== 0 &&
      <Badge className={classes.childrenListIcon} badgeContent={child.children.length} color="primary">
        <ListIcon />
      </Badge>}
      
      {!isDown &&
      <IconButton
        color="primary"
        className={classes.addButton}
        onClick={() => add(i + 1)}
        onMouseDown={e => {e.stopPropagation();}}
      >
        <AddIcon />
      </IconButton>}
    </div>
  );
}
export default withStyles(styles)(NodeContent);