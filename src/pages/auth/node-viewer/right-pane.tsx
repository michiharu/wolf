import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import {
  Theme, createStyles, WithStyles, withStyles, Portal, TextField,
  InputAdornment, FormControl, InputLabel, Select, OutlinedInput, MenuItem
} from '@material-ui/core';
import { Task, Switch, Input, Output } from '../../../settings/layout';
import { Type } from '../../../data-types/tree-node';

const styles = (theme: Theme) => createStyles({
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
  textfield: {
    marginTop: theme.spacing.unit * 2,
  },
});

interface Props extends WithStyles<typeof styles> {
  rightPaneRef: HTMLDivElement;
  // type: Type;
  // label: string;
  // input: string;
  // output: string;
  // cahngeType: (e: any) => void;
  // changeLabel: (e: any) => void;
  // changeInput: (e: any) => void;
  // changeOutput: (e: any) => void;
}

const RightPane: React.FC<Props> = (props: Props) => {

  // const {
  //   rightPaneRef, type, label, input, output,
  //   cahngeType, changeLabel, changeInput, changeOutput, classes
  // } = props;

  const {
    rightPaneRef, classes
  } = props;

  const type = 'task', label = 'test-label', input = '', output = '',
    cahngeType = () => {}, changeLabel = () => {}, changeInput = () => {}, changeOutput = () => {};


  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    process.nextTick(() => setLabelWidth((ReactDOM.findDOMNode(labelRef.current)! as HTMLElement).offsetWidth));
    // setLabelWidth((ReactDOM.findDOMNode(labelRef.current)! as HTMLElement).offsetWidth);
  });

  const InputIcon = (
    <InputAdornment position="start"><Input/></InputAdornment>
  );

  const OutputIcon = (
    <InputAdornment position="start"><Output/></InputAdornment>
  );

  return (
    <Portal container={rightPaneRef}>
      <div className={classes.root}>
        <TextField
          variant="outlined"
          className={classes.textfield}
          label="タイトル"
          value={label}
          onChange={changeLabel}
          fullWidth
        />
        <FormControl variant="outlined" className={classes.textfield}>
          <InputLabel ref={labelRef}>タイプ</InputLabel>
          <Select
            classes={{
              icon: type === 'task' ? classes.selectType : classnames(classes.selectType, classes.switchIcon),
              select: classes.select
            }}
            input={<OutlinedInput labelWidth={labelWidth}/>}
            value={type}
            onChange={cahngeType}
            IconComponent={p => type === 'task' ? <Task {...p}/> : <Switch {...p}/>}
            fullWidth
          >
            <MenuItem value="task">作業</MenuItem>
            <MenuItem value="switch">分岐</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          className={classes.textfield}
          label="インプット"
          value={input}
          onChange={changeInput}
          InputProps={{startAdornment: InputIcon}}
          fullWidth
        />
        <TextField
          variant="outlined"
          className={classes.textfield}
          label="アウトプット"
          value={output}
          onChange={changeOutput}
          InputProps={{startAdornment: OutputIcon}}
          fullWidth
        />
      </div>
    </Portal>
  );
};

export default withStyles(styles)(RightPane);