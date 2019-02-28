import * as React from 'react';
import classnames from 'classnames';
import { Theme, createStyles, WithStyles, withStyles, Typography, IconButton, TextField, Fab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Badge } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import NodeContent from './node-content';

import TreeNode from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight } from '../../../settings/layout';

import { useState, useRef } from 'react';
import clamp from 'lodash-es/clamp';
import swap from 'lodash-move';
import { useGesture } from 'react-with-gesture';
import { useSprings, animated, interpolate } from 'react-spring';

export const itemGrid = 180;
export const itemHeight = 120;
export const itemWidth  = 400;

const styles = (theme: Theme) => createStyles({
  root: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
    display: 'flex',
    position: 'relative',
    userSelect: 'none',
    justifyContent: 'center',
    paddingTop: theme.spacing.unit * 4,
  },
  saveButton: {
    position: 'absolute',
    top: theme.spacing.unit * 4,
    left: theme.spacing.unit * 4,
  },
  extendedIcon: {
    marginLeft: theme.spacing.unit,
  },
  content: {
    position: 'relative',
    width: itemWidth,
  },
  panel: {
    position: 'absolute',
    width: itemWidth,
    height: itemHeight,
    overflow: 'visible',
    pointerEvents: 'auto',
    transformOrigin: '50% 50% 0px',
    borderRadius: 5,
    color: 'white',
    lineHeight: itemHeight,
    fontSize: 14.5,
    background: 'lightblue'
  },
  startPanel: {
    width: itemWidth + 100,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);'
  },
  nodeLabelRoot: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  nodeLabelInput: {
    fontSize: theme.typography.pxToRem(28),
  },
  endPanel: { background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  nodeContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  label: {
    position: 'absolute',
    width: '90%',
    top: '50%',
    left: '50%',
    transform: `translate(-50%,-50%)`,
  },
  addButton: {
    position: 'absolute',
    top: (itemGrid + itemHeight) / 2,
    left: '50%',
    transform: `translate(-50%,-50%)`,
  },
});

interface Props extends WithStyles<typeof styles> {
  nodeLabel: string;
  nodeChildren: TreeNode[];
  changeNodeLabel: (e: any) => void;
  changeLabel: (id: string) => (e: any) => void;
  add: (index: number) => void;
  _delete: (id: string) => void;
  save: (order: number[]) => void;
}

const fn = (order: any, down?: any, originalIndex?: any, curIndex?: any, y?: any) => (index?: any) =>
  down && index === originalIndex
    ? { y: (curIndex + 1) * itemGrid + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: (n: any) => n === 'y' || n === 'zIndex' }
    : { y: (order.indexOf(index) + 1) * itemGrid, scale: 1, zIndex: '0', shadow: 1, immediate: false }

const NodeEditor: React.SFC<Props> = (props: Props) => {
  const { nodeLabel, nodeChildren, changeNodeLabel, changeLabel, add, save, _delete, classes } = props;
  const [isDown, setDown] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const order = useRef(nodeChildren.map((_, index) => index));
  const [springs, setSprings] = useSprings<any>(nodeChildren.length, fn(order.current));
  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    if (down) { setDown(down); } else { setTimeout(() => setDown(down), 600); }
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * itemGrid + y) / itemGrid), 0, nodeChildren.length - 1)
    const newOrder = swap(order.current, curIndex, curRow);
    setSprings(fn(newOrder, down, originalIndex, curIndex, y));
    if (!down) order.current = newOrder
  });

  const handleDelete = (id: string, childrenCount: number) => {
    if (childrenCount === 0) { _delete(id); } else { setDeleteId(id); }
  }

  return (
    <div className={classes.root}>
      <Fab
        variant="extended"
        color="primary"
        className={classes.saveButton}
        onClick={() => save(order!.current)}
      >
        保存<CheckIcon className={classes.extendedIcon}/>
      </Fab>
      <div className={classes.content} style={{ height: (nodeChildren.length + 2) * itemGrid}}>
        <div className={classnames(classes.panel, classes.startPanel)}>
          <div className={classes.nodeContent}>
            <TextField
              className={classes.label}
              value={nodeLabel}
              onChange={changeNodeLabel}
              InputProps={{
                classes: {input: classes.nodeLabelInput},
                disableUnderline: true
              }}
            />
            {!isDown &&
            <IconButton
              color="primary"
              className={classes.addButton}
              onClick={() => add(0)}
              onMouseDown={e => {e.stopPropagation();}}
            >
              <AddIcon />
            </IconButton>}
          </div>
        </div>
        {springs.map(({ zIndex, shadow, y, scale }, i) => {
          return (
            <animated.div
              key={i}
              {...bind(i)}
              className={classnames(classes.panel)}
              style={{
                zIndex,
                boxShadow: shadow.interpolate((s: number) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                transform: interpolate([y, scale], (y, s) => `translate3d(0,${y}px,0) scale(${s})`)
              }}
              children={(
                <NodeContent
                  nodeChildren={nodeChildren}
                  i={i}
                  isDown={isDown}
                  changeLabel={changeLabel}
                  handleDelete={handleDelete}
                  add={add}
                />
              )}
            />
          );
        })}
        <div
          className={classnames(classes.panel, classes.endPanel)}
          style={{transform: `translate3d(0,${(nodeChildren.length + 1) * itemGrid}px,0)`}}
        >
          <div className={classes.nodeContent}>
            <Typography className={classes.label} variant="h5">エンド</Typography>
          </div>
        </div>
      </div>
      <Dialog
          open={deleteId !== null}
          onClose={() => setDeleteId(null)}
        >
          <DialogTitle>この作業を削除してもよろしいですか？</DialogTitle>
          <DialogContent>
            <DialogContentText>この作業には細かな作業手順が含まれています。削除してもよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button onClick={() => _delete(deleteId!)} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default withStyles(styles)(NodeEditor);