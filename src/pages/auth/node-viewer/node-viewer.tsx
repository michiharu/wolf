import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';

import { Stage, Layer } from 'react-konva';

import { TreeNode, TreeViewNode } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight } from '../../../settings/layout';
import StartNode from '../../../components/konva-node/start-node';
import TreeViewUtil from '../../../func/tree-view';
import TaskNodeChildren, { TaskNodeChildrenProps } from '../../../components/konva-node/task-node-children';

const styles = (theme: Theme) => createStyles({
  root: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
  },
});

interface Props extends WithStyles<typeof styles> {
  containerRef: HTMLDivElement;
  node: TreeNode;
}

const NodeViewer: React.FC<Props> = (props: Props) => {
  var timeout: NodeJS.Timeout;
  const { node: next, classes } = props;
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

  const reLoad = () => {
    setNowLoading(true);
    timeout = setTimeout(() => setNowLoading(false), 1);
  }

  if (node === null || node.id !== next.id) {
    const newNode = TreeViewUtil.getViewNode('task', next);
    console.log(newNode);
    setNode(newNode);
    reLoad();
  }

  const clear = () => {
    clearTimeout(timeout);
    window.removeEventListener('resize', resize);
  }

  useEffect(() => {
    process.nextTick(resize);
    window.addEventListener('resize', resize);
    return clear;
  });

  const changeOpen = (id: string, open: boolean) => {
    const newNode = TreeViewUtil.open('task', node!,id, open);
    setNode(newNode);
  }

  if (node === null || nowLoading) {
    return <p>Now Loading..</p>;
  }
  
  const childrenProps: TaskNodeChildrenProps = {
    parentType: 'task',
    nodes: node.children,
    x: 100,
    y: 200,
    changeOpen
  };

  return (
    <div className={classes.root} ref={containerRef}>
      <Stage ref={stageRef} draggable>
        <Layer>
          <StartNode x={100} y={100}/>
          <TaskNodeChildren {...childrenProps}/>
        </Layer>
      </Stage>
    </div>
  );
};

export default withStyles(styles)(NodeViewer);