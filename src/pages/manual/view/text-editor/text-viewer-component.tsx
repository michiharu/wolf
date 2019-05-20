import * as React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import {
  Theme, createStyles, WithStyles, withStyles, TextField, Grid,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  InputAdornment, FormControl, Select, MenuItem, Button, IconButton, Typography, Paper
} from '@material-ui/core';
import {
  Task, Switch, Case, Input, Output, PreConditions, PostConditions,
  WorkerInCharge, Remarks, NecessaryTools, Exceptions, Image, Close,
} from '../../../../settings/layout';
import { TreeNode, Type, NodeWithSimilarity, Tree, baseTreeNode } from '../../../../data-types/tree';

import TreeUtil from '../../../../func/tree';
import { phrase } from '../../../../settings/phrase';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
    padding: theme.spacing.unit * 2,
    width: '100%',
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
  title: {
    fontSize: 40,
  },
  imageIcon: {marginRight: theme.spacing.unit},
  imageFormContainer: {
    marginTop: -theme.spacing.unit * 2,
    marginBottom: -theme.spacing.unit,
    width: '100%',
    paddingLeft: 68
  },
  imageContainer: {
    position: 'relative',
    // width: '100%',
    // height: '100%',
  },
  img: {
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      height: 340,
      objectFit: 'cover',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
      height: 340,
      objectFit: 'cover',
    },
  },
  deleteButton: {
    position: 'absolute',
    top: -theme.spacing.unit,
    right: -theme.spacing.unit,
  }
});

export interface TextLineWithIconProps {
  itemNumber: string;
  node: TreeNode;
}

interface Props extends TextLineWithIconProps, WithStyles<typeof styles> {}

const TextViewer: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;
  var fileName: string;

  const {
    itemNumber, node, classes
  } = props;

  const selectIsCommonRef = useRef(null);
  const [selectIsCommonWidth, setSelectIsCommonWidth] = useState(0);
  const selectTypeRef = useRef(null);
  const [selectTypeWidth, setSelectTypeWidth] = useState(0);

  if (node !== null) {
    process.nextTick(() => {
      const commonEl = ReactDOM.findDOMNode(selectIsCommonRef.current) as HTMLElement | null;
      if (commonEl !== null) { setSelectIsCommonWidth(commonEl.offsetWidth); }
      const typeEl = ReactDOM.findDOMNode(selectTypeRef.current) as HTMLElement | null;
      if (typeEl !== null) { setSelectTypeWidth(typeEl.offsetWidth); }
    });      
  }

  const InputIcon = <InputAdornment position="start"><Input/></InputAdornment>;

  const OutputIcon = <InputAdornment position="start"><Output/></InputAdornment>;

  const PreConditionsIcon = <InputAdornment position="start"><PreConditions/></InputAdornment>;

  const PostConditionsIcon = <InputAdornment position="start"><PostConditions/></InputAdornment>;

  const WorkerInChargeIcon = <InputAdornment position="start"><WorkerInCharge/></InputAdornment>;

  const RemarksIcon = <InputAdornment position="start"><Remarks/></InputAdornment>;

  const NecessaryToolsIcon = <InputAdornment position="start"><NecessaryTools/></InputAdornment>;

  const ExceptionsIcon = <InputAdornment position="start"><Exceptions/></InputAdornment>;

  const focusType: Type = node === null ? 'task' : node.type;

  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        <Grid item xs={12} lg={8}>
          <Grid container alignItems="flex-end" spacing={8}>
            <Grid item>
              <FormControl>
                <Select
                  classes={{
                    icon: focusType !== 'switch'
                      ? classes.selectType
                      : classnames(classes.selectType, classes.switchIcon),
                    select: classes.select
                  }}
                  // input={<OutlinedInput labelWidth={selectTypeWidth}/>}
                  value={node.type}
                  IconComponent={
                    p => focusType === 'task' ?   <Task {...p}/> :
                        focusType === 'switch' ? <Switch {...p}/> :
                                                  <Case {...p}/>}
                  disabled
                >
                  <MenuItem value="task">作業</MenuItem>
                  <MenuItem value="switch">分岐</MenuItem>
                  {node.type === 'case' && <MenuItem value="case">条件</MenuItem>}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              {node.label !== itemNumber && <Typography variant="h5">{itemNumber}</Typography>}
            </Grid>
          </Grid>
          <TextField
            style={{paddingLeft: 80}}
            placeholder={
              node.type === 'task' ? phrase.placeholder.task :
              node.type === 'switch' ? phrase.placeholder.switch : phrase.placeholder.case
            }
            value={node.label}
            InputProps={{classes: {input: classes.title}}}
            fullWidth
            disabled
          />
          <TextField
            style={{paddingLeft: 80}}
            placeholder="インプット"
            value={node.input}
            InputProps={{startAdornment: InputIcon}}
            fullWidth
            multiline
            disabled
          />
          
          <TextField
            style={{paddingLeft: 80}}
            placeholder="アウトプット"
            value={node.output}
            InputProps={{startAdornment: OutputIcon}}
            fullWidth
            disabled
          />

            <TextField
              style={{paddingLeft: 80}}
              placeholder="事前条件"
              value={node.preConditions}
              InputProps={{startAdornment: PreConditionsIcon}}
              fullWidth
              multiline
              disabled
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="事後条件"
              value={node.postConditions}
              InputProps={{startAdornment: PostConditionsIcon}}
              fullWidth
              disabled
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="担当者"
              value={node.workerInCharge}
              InputProps={{startAdornment: WorkerInChargeIcon}}
              fullWidth
              multiline
              disabled
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="備考"
              value={node.remarks}
              InputProps={{startAdornment: RemarksIcon}}
              fullWidth
              disabled
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="必要システム・ツール"
              value={node.necessaryTools}
              InputProps={{startAdornment: NecessaryToolsIcon
              }}
              fullWidth
              multiline
              disabled
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="例外"
              value={node.exceptions}
              InputProps={{startAdornment: ExceptionsIcon}}
              fullWidth
              disabled
            />
        </Grid>
        <Grid item xs={12} lg={4}>
          {node.imageBlob.length !== 0 &&
          <Grid container justify="center">
            <Grid item>
              <Paper className={classes.imageContainer}>
                <img src={node.imageBlob} className={classes.img}/>
              </Paper>
            </Grid>
          </Grid>}
        </Grid>
      </Grid>
        
      {node.children.map((c, i) => <TextViewer key={c.id} {...props} itemNumber={`${itemNumber} - ${i + 1}`} node={c}/>)}

    </div>
  );
};

export default withStyles(styles)(TextViewer);