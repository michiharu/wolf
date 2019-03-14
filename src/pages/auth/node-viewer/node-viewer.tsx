import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Fab } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';

import { Stage, Layer } from 'react-konva';

import { TreeNode, Type, KNode, Cell, Point } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, viewItem } from '../../../settings/layout';

import ToolContainer from '../../../components/tool-container/tool-container';
import KNodeUtil from '../../../func/k-node';
import NodeRect from '../../../components/konva-node/node-rect';
import RightPane from './right-pane';

const styles = (theme: Theme) => createStyles({
  root: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
  saveButton: {
    minWidth: 100,
  },
  extendedIcon: {
    marginLeft: theme.spacing.unit,
  },
});

export interface NodeViewProps {
  toolRef: HTMLDivElement;
  rightPaneRef: HTMLDivElement;
  parentType: Type;
  node: TreeNode;
  back: () => void;
  changeNode: (node: TreeNode) => void;
}

interface Props extends NodeViewProps, WithStyles<typeof styles> {}

const NodeViewer: React.FC<Props> = (props: Props) => {

  const { toolRef, rightPaneRef, parentType, node: next, back, changeNode, classes } = props;
  
  const stageContainerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const resize = () => {
    const cref = stageContainerRef.current, sref = stageRef.current;
    if (cref === null || sref === null) { throw 'Cannot find elements.'; }
    sref.width(cref.offsetWidth);
    sref.height(cref.offsetHeight);
    sref.draw();
  }

  const clear = () => {
    window.removeEventListener('resize', resize);
  }

  useEffect(() => {
    process.nextTick(resize);
    window.addEventListener('resize', resize);
    return clear;
  });

  const [node, setNode] = useState<KNode | null>(null);
  const [map, setMap] = useState<Cell[][] | null>(null);
  const [beforePoint, setBeforePoint] = useState<Point | null>(null);
  const [focusNode, setFocusNode] = useState<KNode | null>(null);

  const saveNodeState = (node: KNode) => {
    setNode(node);
    setMap(KNodeUtil.makeMap(KNodeUtil.toFlat(node)));
  }

  const point = {
    x: viewItem.spr.w * 2,
    y: viewItem.spr.h * 5,
  };

  if (node === null || node.id !== next.id) {
    const newNode = KNodeUtil.getViewNode(parentType, next);
    setFocusNode(newNode);
    const openNode = KNodeUtil.open(point, newNode, newNode.id, true);
    saveNodeState(openNode);
  }

  if (node === null) {
    return <p>Now Loading..</p>;
  }

  const changeOpen = (id: string, open: boolean) => {
    const newNode = KNodeUtil.open(point, node!, id, open);
    saveNodeState(newNode);
  }

  const deleteFocus = () => saveNodeState(KNodeUtil._deleteFocus(node));

  const dragMove = (selfNode: KNode, p: Point) => {

    if (beforePoint === null || beforePoint.x !== p.x || beforePoint.y !== p.y) {
      setBeforePoint(p);
      if (map !== null && 0 <= p.x && p.x < map.length) {
        const cell = map[p.x][p.y];
        if (cell === undefined || cell.node.id === selfNode.id) { return; }
        console.log(cell.action);

        if (cell.action === 'move') {
          const newNode = KNodeUtil.move(point, node!, selfNode, cell.node);
          saveNodeState(newNode);
        }

        if (cell.action === 'push') {
          const newNode = KNodeUtil.push(point, node!, selfNode, cell.node);
          saveNodeState(newNode);
        }
      }
    }
  }

  const dragEnd = () => {
    const newNode = KNodeUtil.deleteDummy(point, node!);
    saveNodeState(newNode);
  }

  const flatNodes = KNodeUtil.toFlat(node);

  const nodeActionProps = { changeOpen, dragMove, dragEnd, deleteFocus };

  return (
    <div className={classes.root} ref={stageContainerRef}>
      <ToolContainer containerRef={toolRef}>
        <Grid container spacing={16}>
          <Grid item>
            <Fab color="primary" onClick={back} size="medium"><ArrowBack/></Fab>
          </Grid>
          <Grid item>
            <Fab className={classes.saveButton} variant="extended" color="primary" onClick={() => changeNode(node)}>
              保存<CheckIcon className={classes.extendedIcon}/>
            </Fab>
          </Grid>
        </Grid>
      </ToolContainer>
      <Stage ref={stageRef} onClick={deleteFocus} draggable>
        <Layer>
          {/* {map !== null && map.map((_, x) => (
          <Group key={`group-${x}`}>
            {_.map((__, y) => {
              const cell = map[x][y];
              if (cell === undefined) { return <Rect key={`${x}-${y}`}/>; }
              const fill = cell.action === 'push' ? 'yellow' :
                          cell.action === 'move' ? 'blue'   :
                          cell.action === 'open' ? 'green'  : 'grey';
              return <Rect key={`${x}-${y}`} x={x * unit} y={y * unit + 300} width={unit} height={unit} fill={fill}/>;
              })}
          </Group>))} */}
          {flatNodes.map(n => <NodeRect key={n.id} node={n} {...nodeActionProps}/>)}
        </Layer>
      </Stage>
      <RightPane rightPaneRef={rightPaneRef}/>
    </div>
  );
};

export default withStyles(styles)(NodeViewer);