import * as React from 'react';
import classnames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, TextField,
  Paper, InputAdornment, Grid, FormControl, InputLabel, Select, OutlinedInput, MenuItem
} from '@material-ui/core';
import { Task, Switch, Input, Output } from '../../../../settings/layout';
import { Type } from '../../../../data-types/tree-node';
import ReactDOM from 'react-dom';

const styles = (theme: Theme) => createStyles({
  mainPaper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
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
  type: Type;
  label: string;
  input: string;
  output: string;
  cahngeType: (e: any) => void;
  changeLabel: (e: any) => void;
  changeInput: (e: any) => void;
  changeOutput: (e: any) => void;
}

const NodeDetails: React.FC<Props> = (props: Props) => {
  const {
    type, label, input, output,
    cahngeType, changeLabel, changeInput, changeOutput, classes
  } = props;

  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth((ReactDOM.findDOMNode(labelRef.current)! as HTMLElement).offsetWidth)
  });

  const InputIcon = (
    <InputAdornment position="start"><Input/></InputAdornment>
  );

  const OutputIcon = (
    <InputAdornment position="start"><Output/></InputAdornment>
  );

  return (
    <Paper className={classes.mainPaper}>
      <Grid container spacing={16}>
        <Grid item>
          <FormControl variant="outlined">
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
        </Grid>
        <Grid item xs={12} md>
          <TextField
            variant="outlined"
            label="タイトル"
            value={label}
            onChange={changeLabel}
            fullWidth
          />
        </Grid>
      </Grid>
      
      <TextField
        variant="outlined"
        className={classes.textfield}
        placeholder="インプット"
        value={input}
        onChange={changeInput}
        InputProps={{startAdornment: InputIcon}}
        fullWidth
      />
      <TextField
        variant="outlined"
        className={classes.textfield}
        placeholder="アウトプット"
        value={output}
        onChange={changeOutput}
        InputProps={{startAdornment: OutputIcon}}
        fullWidth
      />
    </Paper>
  );
}

export default withStyles(styles)(NodeDetails);