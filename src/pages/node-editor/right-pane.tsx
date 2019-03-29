import * as React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import {
  Theme, createStyles, WithStyles, withStyles, Portal, TextField,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  InputAdornment, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Divider, Button, Slide
} from '@material-ui/core';
import {
  Task, Switch, Case, Input, Output, toolbarHeight, toolbarMinHeight, rightPainWidth
} from '../../settings/layout';
import { Type, EditableNode } from '../../data-types/tree-node';
import { ButtonProps } from '@material-ui/core/Button';
import EditableNodeUtil from '../../func/editable-node-util';

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
  isRoot: boolean;
  changeNode: (node: EditableNode) => void;
  addDetails: () => void;
  deleteSelf: () => void;
}

const RightPane: React.FC<Props> = (props: Props) => {

  const {
    rightPaneRef, node, isRoot, changeNode, addDetails, deleteSelf, classes
  } = props;

  const cahngeType = (e: any) => {
    if (node === null) { return; }
    const newType = e.target.value === 'task' ? 'task' : 'switch';
    if (node.type === newType) { return; }

    if (node.children.length === 0) {
      const newNode: EditableNode = {...node, type: newType};
      changeNode(newNode);
    }

    if (newType === 'task') {
      const children: EditableNode[] = node.children.map(c => c.children).reduce((a, b) => a.concat(b));
      const newNode: EditableNode = {...node, type: newType, children};
      changeNode(newNode);
    } else {
      const newCase = EditableNodeUtil.getNewNode('switch');
      const children: EditableNode[] = [{...newCase, children: node.children}];
      const newNode: EditableNode = {...node, type: newType, children};
      changeNode(newNode);
    }
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

  const selectLabelRef = useRef(null);
  const [selectLabelWidth, setSelectLabelWidth] = useState(0);
  const inputLabelRef = useRef(null);
  const [inputLabelWidth, setInputLabelWidth] = useState(0);

  if (node !== null) {
    process.nextTick(() => {
      const selectEl = ReactDOM.findDOMNode(selectLabelRef.current) as HTMLElement | null;
      if (selectEl !== null) { setSelectLabelWidth(selectEl.offsetWidth); }

      const inputEl = ReactDOM.findDOMNode(inputLabelRef.current) as HTMLElement | null;
      if (inputEl !== null) { setSelectLabelWidth(inputEl.offsetWidth); }
    });      
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
          <InputLabel ref={selectLabelRef}>タイプ</InputLabel>
          <Select
            classes={{
              icon: focusType !== 'switch'
                ? classes.selectType
                : classnames(classes.selectType, classes.switchIcon),
              select: classes.select
            }}
            input={<OutlinedInput labelWidth={selectLabelWidth}/>}
            value={node !== null ? node.type : 'task'}
            onChange={cahngeType}
            IconComponent={
              p => focusType === 'task' ?   <Task {...p}/> :
                   focusType === 'switch' ? <Switch {...p}/> :
                                            <Case {...p}/>}
            fullWidth
            disabled={node !== null && node.type === 'case'}
          >
            <MenuItem value="task">作業</MenuItem>
            {node !== null && <MenuItem value="switch">分岐</MenuItem>}
            {node !== null && node.type === 'case' && <MenuItem value="case">条件</MenuItem>}
          </Select>
        </FormControl>
        <Divider className={classes.marginTop}/>

        <TextField
          variant="outlined"
          className={classes.marginTop}
          label="インプット"
          value={node !== null ? node.input : ''}
          onChange={changeInput}
          InputProps={{startAdornment: InputIcon}}
          fullWidth
          multiline
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
        <Button {...buttonProps} onClick={addDetails}>詳細項目を追加する</Button>
        
        <Divider className={classes.marginTop}/>
        {!isRoot && (
        <Button {...buttonProps} color="default" onClick={handleClickDelete}>この項目を削除する</Button>)}
        
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