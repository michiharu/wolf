import * as React from 'react';
import { Theme, createStyles, withStyles, WithStyles, IconButton, TextField, Badge, Typography } from '@material-ui/core';
import { itemWidth, itemHeight, heightHasIf, separate } from './drag-drop';
import TreeNode, { Type } from '../../../../data-types/tree-node';
import ClearIcon from '@material-ui/icons/Clear';
import { Task, Switch} from '../../../../settings/layout';
import AddIcon from '@material-ui/icons/Add';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
    width: itemWidth,
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
  label: {position: 'absolute'},

  ifState: {
    paddingLeft: 50,
    fontSize: theme.typography.pxToRem(14),
  },
  textfield: {
    fontSize: theme.typography.pxToRem(20),
  },
  switchIcon: {
    transform: 'scale(1, -1)',
  },
  addButton: {
    position: 'absolute',
    bottom: -separate * 1.5,
    left: '50%',
    transform: `translate(-50%,-50%)`,
  },
  deleteButton: {
    position: 'absolute',
    top: -16,
    left: -16,
  },
  childrenListIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  }
});

interface Props extends WithStyles<typeof styles> {
  parentType: Type;
  nodeChildren: TreeNode[];
  i: number;
  isDown: boolean;
  changeIfState: (id: string) => (e: any) => void;
  changeLabel: (id: string) => (e: any) => void;
  handleDelete: (id: string, childrenCount: number) => void;
  add: (index: number) => void;
  selectNode: (node: TreeNode | null) => void;
}

const NodeContent: React.SFC<Props> = (props: Props) => {
  const {
    parentType, nodeChildren, i, isDown,
    changeIfState, changeLabel, handleDelete, add, selectNode, classes
  } = props;
  const child = nodeChildren[i];

  return (
    <div className={classes.root} style={{height: parentType === 'task' ? itemHeight : heightHasIf}}>
      <div className={classes.formArea}>
        <div className={classes.formContainer}>
          {parentType !== 'task' &&
          <>
            <Typography variant="caption" className={classes.label} style={{top: 8}}>ケース：</Typography>
            <TextField
              className={classes.label}
              style={{top: 1}}
              value={nodeChildren[i].ifState}
              onChange={changeIfState(nodeChildren[i].id)}
              InputProps={{classes:{input: classes.ifState}}}
              fullWidth
            />
          </>}
          
          <TextField
            className={classes.label}
            style={{top: parentType === 'task' ? 3 : 40}}
            value={nodeChildren[i].label}
            onChange={changeLabel(nodeChildren[i].id)}
            InputProps={{classes:{input: classes.textfield}, disableUnderline: true}}
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

      <IconButton
        className={classes.childrenListIcon}
        onMouseDown={e => {e.stopPropagation();}}
        onClick={() => selectNode(child)}
      >
        <Badge badgeContent={child.children.length} color="primary">
          {child.type === 'task' ? <Task/> : <Switch className={classes.switchIcon}/>}
        </Badge>
      </IconButton>

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