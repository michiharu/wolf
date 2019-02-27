import * as React from 'react';
import classnames from 'classnames';
import { Theme, createStyles, WithStyles, withStyles, Typography, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TreeNode from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight } from '../../../settings/layout';

import { useState, useRef } from 'react';
import clamp from 'lodash-es/clamp';
import swap from 'lodash-move';
import { useGesture } from 'react-with-gesture';
import { useSprings, animated, interpolate } from 'react-spring';

const styles = (theme: Theme) => createStyles({
  root: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
    backgroundColor: '#ccc',
    display: 'flex',
    userSelect: 'none',
    justifyContent: 'center',
    paddingTop: theme.spacing.unit * 3,
  },
  content: {
    position: 'relative',
    width: 320,
    height: 240,
  },
  panel: {
    position: 'absolute',
    width: 320,
    height: 90,
    overflow: 'visible',
    pointerEvents: 'auto',
    transformOrigin: '50% 50% 0px',
    borderRadius: 5,
    color: 'white',
    lineHeight: 90,
    paddingLeft: 32,
    fontSize: 14.5,
    background: 'lightblue'
  },
  panelContent: {
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
  }
});

interface Props extends WithStyles<typeof styles> {
  node: TreeNode;
  changeNode: (node: TreeNode) => void;
}

const itemGrid = 200;

const fn = (order: any, down?: any, originalIndex?: any, curIndex?: any, y?: any) => (index?: any) =>
  down && index === originalIndex
    ? { y: curIndex * itemGrid + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: (n: any) => n === 'y' || n === 'zIndex' }
    : { y: order.indexOf(index) * itemGrid, scale: 1, zIndex: '0', shadow: 1, immediate: false }

const NodeView: React.SFC<Props> = (props: Props) => {
  const { node, changeNode, classes } = props;
  const [items, setItems] = useState(node.children);
  const [isDown, setDown] = useState(false);

  const order = useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  const [springs, setSprings] = useSprings<any>(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    setDown(down);
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * itemGrid + y) / itemGrid), 0, items.length - 1)
    const newOrder = swap(order.current, curIndex, curRow)
    setSprings(fn(newOrder, down, originalIndex, curIndex, y)) // Feed springs new style data, they'll animate the view without causing a single render
    if (!down) order.current = newOrder
  });

  return (
    <div className={classes.root}>
      <div className={classes.content} style={{ height: items.length * itemGrid }}>
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
                <div className={classes.panelContent}>
                  <Typography>{items[i].label}</Typography>
                  {!isDown &&
                  <Fab color="primary" className={classes.addButton}><AddIcon /></Fab>}
                </div>
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withStyles(styles)(NodeView);