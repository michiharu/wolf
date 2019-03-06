import * as React from 'react';
import classnames from 'classnames';
import { Theme, createStyles, WithStyles, withStyles, Typography, IconButton } from '@material-ui/core';

import OutlinedFlag from '@material-ui/icons/OutlinedFlag';
import Flag from '@material-ui/icons/Flag';
import AddIcon from '@material-ui/icons/Add';
import NodeContent from './node-content';

import TreeNode, { Type } from '../../../../data-types/tree-node';

import { useState, useEffect } from 'react';
import clamp from 'lodash-es/clamp';
import swap from 'lodash-move';
import { useGesture } from 'react-with-gesture';
import { useSprings, animated, interpolate } from 'react-spring';

export const itemGrid = 98;
export const itemHeight = 48;
export const separate = itemGrid - itemHeight;
export const gridHasIf = 140;
export const heightHasIf = 90;
export const itemWidth  = 400;

const styles = (theme: Theme) => createStyles({
  dragArea: {
    display: 'flex',
    position: 'relative',
    userSelect: 'none',
    justifyContent: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  content: {
    position: 'relative',
    marginTop: theme.spacing.unit * 2,
    width: itemWidth,
  },
  panel: {
    position: 'absolute',
    width: itemWidth,
    overflow: 'visible',
    pointerEvents: 'auto',
    transformOrigin: '50% 50% 0px',
    borderRadius: 5,
    color: 'white',
    lineHeight: itemHeight,
    fontSize: 14.5,
    background: theme.palette.background.paper
  },
  panelRoot: {
    position: 'relative',
    width: itemWidth,
  },
  startFinishText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%,-50%)`,
  },
  startFinishFlag: {
    marginBottom: -2,
    color: 'green',
    fontSize: theme.typography.pxToRem(32),
  },
  addButton: {
    position: 'absolute',
    bottom: -separate * 1.5,
    left: '50%',
    transform: `translate(-50%,-50%)`,
  },
});

interface Props extends WithStyles<typeof styles> {
  parentType: Type;
  nodeChildren: TreeNode[];
  order: React.MutableRefObject<number[]>;
  changeIfState: (id: string) => (e: any) => void;
  changeLabel: (id: string) => (e: any) => void;
  add: (index: number) => void;
  _delete: (id: string) => void;
  setDeleteId: (id: string) => void;
  save: (order: number[]) => void;
  back: () => void;
  selectNode: (node: TreeNode | null) => void;
}

const fn = (grid: number, order: any, down?: any, originalIndex?: any, curIndex?: any, y?: any) => (index?: any) => {

  return down && index === originalIndex
    ? { y: (curIndex + 1) * grid + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: (n: any) => n === 'y' || n === 'zIndex' }
    : { y: (order.indexOf(index) + 1) * grid, scale: 1, zIndex: '0', shadow: 1, immediate: false };
}

const DragDrop: React.SFC<Props> = (props: Props) => {
  var timeout: NodeJS.Timeout;
  const {
    parentType, nodeChildren, order, changeIfState, changeLabel,
    add, _delete, setDeleteId, selectNode, classes
  } = props;
  const grid = parentType === 'task' ? itemGrid : gridHasIf;
  const height = parentType === 'task' ? itemHeight : heightHasIf;

  const [isDown, setDown] = useState(false);
  const [springs, setSprings] = useSprings<any>(nodeChildren.length, fn(grid, order.current));
  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    if (down) { setDown(down); } else { timeout = setTimeout(() => setDown(down), 600); }
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * grid + y) / grid), 0, nodeChildren.length - 1);
    const newOrder = swap(order.current, curIndex, curRow);
    setSprings(fn(grid, newOrder, down, originalIndex, curIndex, y));
    if (!down) order.current = newOrder
  });

  useEffect(() => clearTimeout(timeout));

  const handleDelete = (id: string, childrenCount: number) => {
    if (childrenCount === 0) { _delete(id); } else { setDeleteId(id); }
  }

  return (
    <div className={classes.dragArea}>
      <div className={classes.content} style={{ height: (nodeChildren.length + 2) * grid - separate}}>
        <div className={classes.panel} style={{height}}>
          <div className={classes.panelRoot} style={{height}}>
            <Typography variant="h4" className={classes.startFinishText}>
            スタート<OutlinedFlag className={classes.startFinishFlag} />
            </Typography>
            
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
                  parentType={parentType}
                  nodeChildren={nodeChildren}
                  i={i}
                  isDown={isDown}
                  changeIfState={changeIfState}
                  changeLabel={changeLabel}
                  handleDelete={handleDelete}
                  add={add}
                  selectNode={selectNode}
                />
              )}
            />
          );
        })}
        <div
          className={classes.panel}
          style={{transform: `translate3d(0,${(nodeChildren.length + 1) * grid}px,0)`, height}}
        >
          <div className={classes.panelRoot} style={{height}}>
            <Typography variant="h4" className={classes.startFinishText}>
            完了<Flag className={classes.startFinishFlag} />
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(DragDrop);