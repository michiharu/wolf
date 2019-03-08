import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Fab,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Portal, Grid,
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';

import TreeNode, { Type } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight } from '../../../settings/layout';

import { useState, useRef } from 'react';
import DragDrop from './drag-drop/drag-drop';
import NodeDetails from './node-details/node-details';
import ToolContainer from '../../../components/tool-container/tool-container';

const styles = (theme: Theme) => createStyles({
  root: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
    paddingTop: theme.spacing.unit * 8,
  },
  saveButton: {
    minWidth: 100,
  },
  extendedIcon: {
    marginLeft: theme.spacing.unit,
  },
  mainPaper: {
    height: 400,
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  inputIcon: {
    color: theme.palette.primary.main,
    transform: 'rotate(-110deg) scale(1, -1)',
  },
  outputIcon: {
    color: theme.palette.primary.main,
    transform: 'rotate(160deg) scale(1, -1)',
  },
});

interface Props extends WithStyles<typeof styles> {
  containerRef: HTMLDivElement;
  nodeType: Type;
  nodeLabel: string;
  nodeInput: string;
  nodeOutput: string;
  nodeChildren: TreeNode[];
  changeType: (e: any) => void;
  changeNodeLabel: (e: any) => void;
  changeInput: (e: any) => void;
  changeOutput: (e: any) => void;
  changeIfState: (id: string) => (e: any) => void;
  changeLabel: (id: string) => (e: any) => void;
  add: (index: number) => void;
  _delete: (id: string) => void;
  save: (order: number[]) => void;
  back: () => void;
  selectNode: (node: TreeNode | null) => void;
}

const NodeEditor: React.FC<Props> = (props: Props) => {

  const {
    containerRef, nodeType, nodeLabel, nodeInput, nodeOutput, nodeChildren, changeType, changeNodeLabel, changeInput, changeOutput,
    changeIfState, changeLabel,  add, save, _delete, back, selectNode, classes
  } = props;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const order = useRef(nodeChildren.map((_, index) => index));

  return (
    <div className={classes.root}>
    
      <ToolContainer containerRef={containerRef}>
        <Grid container spacing={16}>
          <Grid item>
            <Fab color="primary" onClick={back} size="medium">
              <ArrowBack/>
            </Fab>
          </Grid>
          <Grid item>
            <Fab className={classes.saveButton} variant="extended" color="primary" onClick={() => save(order!.current)}>
              保存<CheckIcon className={classes.extendedIcon}/>
            </Fab>
          </Grid>
        </Grid>
      </ToolContainer>

      <Grid container justify="center">
        <Grid item md={12} lg={6}>
          <NodeDetails
            type={nodeType}
            label={nodeLabel}
            input={nodeInput}
            output={nodeOutput}
            cahngeType={changeType}
            changeLabel={changeNodeLabel}
            changeInput={changeInput}
            changeOutput={changeOutput}
          />
        </Grid>
        <Grid item md={12} lg={6}>
          <DragDrop
            parentType={nodeType}
            nodeChildren={nodeChildren}
            order={order}
            changeIfState={changeIfState}
            changeLabel={changeLabel}
            add={add}
            _delete={_delete}
            setDeleteId={setDeleteId}
            save={save}
            back={back}
            selectNode={selectNode}
          />
        </Grid>
      </Grid>
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>この作業を削除してもよろしいですか？</DialogTitle>
        <DialogContent>
          <DialogContentText>この作業には細かな作業手順が含まれています。削除してもよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={() => _delete(deleteId!)} color="primary" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(NodeEditor);