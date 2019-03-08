import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';

import { Stage, Layer } from 'react-konva';

import { TreeNode, TreeViewNode, Type } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, viewItem } from '../../../settings/layout';
import StartNode from '../../../components/konva-node/start-node';
import TreeViewUtil from '../../../func/tree-view';
import TaskNode, { TaskNodeProps } from '../../../components/konva-node/task-node';
import SwitchNode from '../../../components/konva-node/switch-node';

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
}

interface Props extends NodeViewProps, WithStyles<typeof styles> {}

const NodeViewer: React.FC<Props> = (props: Props) => {

  const { parentType, node: next, classes } = props;
  const [node, setNode] = useState<TreeViewNode | null>(null);
  const [nowLoading, setNowLoading] = useState(false);
  const containerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const resize = () => {
    const cref = containerRef.current, sref = stageRef.current;
    if (cref === null || sref === null) { throw 'Cannot find elements.'; }
    sref.width(cref.offsetWidth);
    sref.height(cref.offsetHeight);
    sref.draw();
  }

  if (node === null || node.id !== next.id) {
    const newNode = TreeViewUtil.getViewNode(parentType, next);
    const openNode = TreeViewUtil.open(parentType, newNode, newNode.id, true);
    setNode(openNode);
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
    const newNode = TreeViewUtil.open(parentType, node!,id, open);
    setNode(newNode);
  }

  if (node === null || nowLoading) {
    return <p>Now Loading..</p>;
  }
  
  const nodeProps: TaskNodeProps = {
    parentType,
    node,
    x: viewItem.spr.w * 2,
    y: viewItem.spr.h * 2,
    changeOpen
  };

  return (
    <div className={classes.root} ref={containerRef}>
      <Stage ref={stageRef} draggable>
        <Layer>
          {node.type === 'task' ? <TaskNode {...nodeProps}/> : <SwitchNode {...nodeProps}/>}
        </Layer>
      </Stage>
    </div>
  );
};

export default withStyles(styles)(NodeViewer);