import * as React from 'react';
import { useRef, useState } from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';

import Konva, { Node } from 'konva';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';

import TreeNode from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight } from '../../../settings/layout';
import TaskNode from '../../../components/konva-node/TaskNode';

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

  const rectRef = useRef<Node>();

  const [x, setX] = useState(0);

  const handleDragStart = (e: any) => {
    const target = e.target;
    for(var n = 0; n < target.getChildren().length; n++) {
      var shape = target.getChildren()[n];
      new Konva.Tween({
          node: shape,
          shadowOffset: {
            x: 15,
            y: 15
          },
          scaleX: 1.1,
          scaleY: 1.1
      }).play();
  }
  };
  const handleDragEnd = (e: any) => {
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    });
    const {x, y} = e.target.getClientRect();
    rectRef.current!.to({x, y, duration: 2});
  };
  // const onDragMove

  const width = 200;
  const height = 40;

  const { node, classes } = props;
  return (
    <div className={classes.root}>
      <Stage width={2000} height={1000} draggable>
        <Layer>
          <TaskNode node={node} x={100} y={100}/>
          
          {/* {[...Array(10)].map((n, i) => (
            <Star
              key={i}
              x={Math.random() * 2000}
              y={Math.random() * 1000}
              numPoints={5}
              innerRadius={20}
              outerRadius={40}
              fill="#89b717"
              opacity={0.8}
              draggable
              rotation={Math.random() * 180}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.6}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))} */}
        </Layer>
      </Stage>
    </div>
  );
};

export default withStyles(styles)(NodeViewer);