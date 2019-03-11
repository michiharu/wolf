import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Fab } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { Stage, Layer } from 'react-konva';

import { TreeNode, TreeViewNode, Type, FlatNode } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, viewItem } from '../../../settings/layout';

import TreeViewUtil from '../../../func/tree-view';
import ToolContainer from '../../../components/tool-container/tool-container';
import TaskNode, { TaskNodeProps } from '../../../components/konva-node/task-node';
import SwitchNode from '../../../components/konva-node/switch-node';
import { theme } from '../../..';
import FlatUtil from '../../../func/flat-view';
import TreeToFlat from '../../../components/konva-node/tree-to-flat';

const styles = (theme: Theme) => createStyles({
  root: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
});

export interface NodeViewProps {
  containerRef: HTMLDivElement;
  parentType: Type;
  node: TreeNode;
  back: () => void;
}

interface Props extends NodeViewProps, WithStyles<typeof styles> {}

const NodeViewer: React.FC<Props> = (props: Props) => {

  const { containerRef, parentType, node: next, back, classes } = props;
  const [node, setNode] = useState<FlatNode | null>(null);
  const [nowLoading, setNowLoading] = useState(false);
  const stageContainerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const resize = () => {
    const cref = stageContainerRef.current, sref = stageRef.current;
    if (cref === null || sref === null) { throw 'Cannot find elements.'; }
    sref.width(cref.offsetWidth);
    sref.height(cref.offsetHeight);
    sref.draw();
  }

  const point = {
    x: viewItem.spr.w * 2,
    y: theme.spacing.unit * 10,
  };

  if (node === null || node.id !== next.id) {
    const newNode = FlatUtil.getViewNode(parentType, next);
    newNode.point = point;
    const saveNode = newNode.children.length !== 0 ?
                     FlatUtil.open(point, newNode, newNode.id, true) : newNode;
    setNode(saveNode);
  }

  const clear = () => {
    window.removeEventListener('resize', resize);
  }

  useEffect(() => {
    process.nextTick(resize);
    window.addEventListener('resize', resize);
    return clear;
  });

  const changeOpen = (id: string, open: boolean) => {
    const newNode = FlatUtil.open(point, node!,id, open);
    setNode(newNode);
  }

  if (node === null || nowLoading) {
    return <p>Now Loading..</p>;
  }
  
  // const nodeProps: TaskNodeProps = {
  //   parentType,
  //   node,
  //   x: viewItem.spr.w * 2,
  //   y: theme.spacing.unit * 10,
  //   changeOpen
  // };

  return (
    <div className={classes.root} ref={stageContainerRef}>
      <ToolContainer containerRef={containerRef}>
        <Grid container spacing={16}>
          <Grid item>
            <Fab color="primary" onClick={back} size="medium"><ArrowBack/></Fab>
          </Grid>
        </Grid>
      </ToolContainer>
      <Stage ref={stageRef} draggable>
        {/* <Layer>
          {node.type === 'task' ? <TaskNode {...nodeProps}/> : <SwitchNode {...nodeProps}/>}
        </Layer> */}
        <TreeToFlat node={node} changeOpen={changeOpen}/>
      </Stage>
    </div>
  );
};

export default withStyles(styles)(NodeViewer);