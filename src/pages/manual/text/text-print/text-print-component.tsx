import * as React from 'react';
import classnames from 'classnames';

import {
  Theme, createStyles, WithStyles, withStyles, TextField, Grid,
  InputAdornment, FormControl, Select, MenuItem, Typography, Paper
} from '@material-ui/core';
import {
  Task, Switch, Case, Input, Output, PreConditions, PostConditions,
  WorkerInCharge, Remarks, NecessaryTools, Exceptions,
} from '../../../../settings/layout';
import { TreeNode, Type, isSwitch, isTask, isCase } from '../../../../data-types/tree';

import { phrase } from '../../../../settings/phrase';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
    padding: theme.spacing(2),
    width: '100%',
  },
  select: {
    marginRight: theme.spacing(1),
  },
  selectType: {
    marginRight: theme.spacing(1),
  },
  switchIcon: {
    transform: 'scale(1, -1)',
  },
  title: {
    fontSize: 40,
  },
  imageIcon: {marginRight: theme.spacing(1)},
  imageFormContainer: {
    marginTop: -theme.spacing(2),
    marginBottom: -theme.spacing(1),
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
    top: -theme.spacing(1),
    right: -theme.spacing(1),
  }
});

export interface TextLineWithIconProps {
  itemNumber: string;
  node: TreeNode;
}

interface Props extends TextLineWithIconProps, WithStyles<typeof styles> {}

const TextPrint: React.FC<Props> = (props: Props) => {

  const {
    itemNumber, node, classes
  } = props;

  const InputIcon = <InputAdornment position="start"><Input/></InputAdornment>;

  const OutputIcon = <InputAdornment position="start"><Output/></InputAdornment>;

  const PreConditionsIcon = <InputAdornment position="start"><PreConditions/></InputAdornment>;

  const PostConditionsIcon = <InputAdornment position="start"><PostConditions/></InputAdornment>;

  const WorkerInChargeIcon = <InputAdornment position="start"><WorkerInCharge/></InputAdornment>;

  const RemarksIcon = <InputAdornment position="start"><Remarks/></InputAdornment>;

  const NecessaryToolsIcon = <InputAdornment position="start"><NecessaryTools/></InputAdornment>;

  const ExceptionsIcon = <InputAdornment position="start"><Exceptions/></InputAdornment>;

  const focusType: Type = node === null ? Type.task : node.type;

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Grid container alignItems="flex-end" spacing={1}>
            <Grid item>
              <FormControl>
                <Select
                  classes={{
                    icon: !isSwitch(focusType) ? classes.selectType : classnames(classes.selectType, classes.switchIcon),
                    select: classes.select
                  }}
                  value={node.type}
                  IconComponent={
                    p => isTask(focusType) ? <Task {...p}/> : isSwitch(focusType) ? <Switch {...p}/> : <Case {...p}/>}
                  disabled
                >
                  <MenuItem value="0">作業</MenuItem>
                  <MenuItem value="1">分岐</MenuItem>
                  {isCase(node.type) && <MenuItem value="2">条件</MenuItem>}
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
              isTask(node.type) ? phrase.placeholder.task :
              isSwitch(node.type) ? phrase.placeholder.switch : phrase.placeholder.case
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
                <img src={node.imageBlob} className={classes.img} alt={node.imageName}/>
              </Paper>
            </Grid>
          </Grid>}
        </Grid>
      </Grid>
        
      {node.children.map((c, i) => <TextPrint key={c.id} {...props} itemNumber={`${itemNumber} - ${i + 1}`} node={c}/>)}

    </div>
  );
};

export default withStyles(styles)(TextPrint);