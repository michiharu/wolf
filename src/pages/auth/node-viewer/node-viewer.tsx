import * as React from 'react';
import { useRef, useEffect } from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Fab } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { Stage } from 'react-konva';

import { TreeNode, Type } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight } from '../../../settings/layout';

import ToolContainer from '../../../components/tool-container/tool-container';
import FlatNodes from '../../../components/konva-node/flatNodes';

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

  const { containerRef, parentType, node, back, classes } = props;
  
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
        <FlatNodes parentType={parentType} node={node}/>
      </Stage>
    </div>
  );
};

export default withStyles(styles)(NodeViewer);