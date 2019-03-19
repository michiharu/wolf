import * as React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import {
  Theme, createStyles, WithStyles, withStyles, Portal, TextField,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  InputAdornment, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Divider, Button, Slide
} from '@material-ui/core';
import { Task, Switch, Input, Output, toolbarHeight, toolbarMinHeight, rightPainWidth } from '../../../settings/layout';
import { Type, EditableNode } from '../../../data-types/tree-node';
import { ButtonProps } from '@material-ui/core/Button';

const styles = (theme: Theme) => createStyles({
  rightPaneWrapper: {
    position: 'absolute',
    overflow: 'visible',
    top: toolbarHeight,
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight,
      height: `calc(100vh - ${toolbarMinHeight}px)`
    },
    right: -24,
    width: '25vw',
    minWidth: rightPainWidth,
  },
  rightPanePaper: {
    width: '100%',
    height: '100%',
    borderLeft: 'solid 1px #ccc',
    backgroundColor: theme.palette.background.paper
  },
  root: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing.unit,
    },
  },
  select: {
    marginRight: theme.spacing.unit,
  },
  selectType: {
    marginRight: theme.spacing.unit,
  },
  switchIcon: {
    transform: 'scale(1, -1)',
  },
  marginTop: {
    marginTop: theme.spacing.unit * 2,
  },
});

interface Props extends WithStyles<typeof styles> {
  rightPaneRef: HTMLDivElement;
  node: EditableNode | null;
  changeNode: (node: EditableNode) => void;
  addBefore: () => void;
  addNext: () => void;
  addDetails: () => void;
  deleteSelf: () => void;
}

const RightPane: React.FC<Props> = (props: Props) => {

  const {
    rightPaneRef, node, changeNode, addBefore, addNext, addDetails, deleteSelf, classes
  } = props;

  const cahngeType = (e: any) => {
    if (node === null) { return; }
    const newType = e.target.value === 'task' ? 'task' : 'switch';
    const newNode: EditableNode = {...node, type: newType};
    changeNode(newNode);
  };
  const changeLabel = (e: any) => {
    changeNode({...node!, label: e.target.value});
  };
  const changeInput = (e: any) => {
    changeNode({...node!, input: e.target.value});
  };
  const changeOutput = (e: any) => {
    changeNode({...node!, output: e.target.value});
  };

  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  if (node !== null) {
    process.nextTick(() => setLabelWidth((ReactDOM.findDOMNode(labelRef.current)! as HTMLElement).offsetWidth));      
  }

  const InputIcon = (
    <InputAdornment position="start"><Input/></InputAdornment>
  );

  const OutputIcon = (
    <InputAdornment position="start"><Output/></InputAdornment>
  );
  const focusType: Type = node === null ? 'task' : node.type; 
  const buttonProps: ButtonProps = {
    className: classes.marginTop, color: 'primary', fullWidth: true
  };

  const [deleteFlag, setDeleteFlag] = useState(false);
  const handleClickDelete = () => {
    if (node!.children.length !== 0) {
      setDeleteFlag(true);
    } else {
      deleteSelf();
    }
  }

  return (
    <>
    <Portal container={rightPaneRef}>
    <Slide direction="left" in={node !== null} mountOnEnter>
    <div className={classes.rightPaneWrapper}>
    <div className={classes.rightPanePaper}>
      <div className={classes.root}>
        <TextField
          variant="outlined"
          className={classes.marginTop}
          label="タイトル"
          value={node !== null ? node.label : ''}
          onChange={changeLabel}
          fullWidth
        />
        <FormControl variant="outlined" className={classes.marginTop}>
          <InputLabel ref={labelRef}>タイプ</InputLabel>
          <Select
            classes={{
              icon: focusType === 'task' ? classes.selectType : classnames(classes.selectType, classes.switchIcon),
              select: classes.select
            }}
            input={<OutlinedInput labelWidth={labelWidth}/>}
            value={node !== null ? node.type : 'task'}
            onChange={cahngeType}
            IconComponent={p => focusType === 'task' ? <Task {...p}/> : <Switch {...p}/>}
            fullWidth
          >
            <MenuItem value="task">作業</MenuItem>
            {node !== null && <MenuItem value="switch">分岐</MenuItem>}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          className={classes.marginTop}
          label="インプット"
          value={node !== null ? node.input : ''}
          onChange={changeInput}
          InputProps={{startAdornment: InputIcon}}
          fullWidth
        />
        <TextField
          variant="outlined"
          className={classes.marginTop}
          label="アウトプット"
          value={node !== null ? node.output : ''}
          onChange={changeOutput}
          InputProps={{startAdornment: OutputIcon}}
          fullWidth
        />
        <Divider className={classes.marginTop}/>
        <Button {...buttonProps} onClick={addBefore}>前に項目を追加する</Button>
        <Button {...buttonProps} onClick={addNext}>次に項目を追加する</Button>

        <Divider className={classes.marginTop}/>
        <Button {...buttonProps} onClick={addDetails}>詳細項目を追加する</Button>
        
        <Divider className={classes.marginTop}/>
        <Button {...buttonProps} color="default" onClick={handleClickDelete}>この項目を削除する</Button>
      </div>
      </div>
      </div>
    </Slide>
    </Portal>
      <Dialog open={deleteFlag} onClose={() => setDeleteFlag(false)}>
        <DialogTitle>この項目を削除してもよろしいですか？</DialogTitle>
        <DialogContent>
          <DialogContentText>この項目には詳細項目が含まれています。削除してもよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteFlag(false)}>Cancel</Button>
          <Button onClick={deleteSelf} color="primary" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withStyles(styles)(RightPane);