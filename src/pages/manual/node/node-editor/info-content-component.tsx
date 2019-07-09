import * as React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import {
  Theme, TextField, Button,
  InputAdornment, MenuItem, IconButton, Paper, Box, Collapse
} from '@material-ui/core';
import {
  Task, Switch, Case, Input, Output, PreConditions, PostConditions,
  WorkerInCharge, Remarks, NecessaryTools, Exceptions, Image, Close, More, Less,
} from '../../../../settings/layout';
import { TreeNode, isTask, isSwitch} from '../../../../data-types/tree';

import { phrase } from '../../../../settings/phrase';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    marginTop: theme.spacing(2),
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
  imageButton: {
    paddingTop: theme.spacing(1.8),
    paddingBottom: theme.spacing(1.8),
  },
  imageIcon: {
    // marginLeft: -theme.spacing(0.28),
    marginRight: theme.spacing(1)
  },
  imageFormContainer: {
    marginTop: -theme.spacing(2),
    marginBottom: -theme.spacing(1),
    width: '100%',
    paddingLeft: 68
  },
  imageContainer: {
    position: 'relative',
  },
  img: {
    width: '100%',
    height: 400,
    objectFit: 'contain',
    verticalAlign: 'bottom',
  },
  deleteButton: {
    position: 'absolute',
    top: -theme.spacing(2),
    right: -theme.spacing(2),
  }
}));

export interface InfoContentProps {
  node: TreeNode;
  isEditing: boolean;
  changeNode: (node: TreeNode) => void;
}

interface Props extends InfoContentProps { }

const InfoContentComponent: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;
  var fileName: string;

  const { node, changeNode, isEditing } = props;
  const [open, setOpen] = useState(isEditing);
  function handleOpenClose() {
    setOpen(!open);
  }
  const selectIsCommonRef = useRef(null);
  const [, setSelectIsCommonWidth] = useState(0);
  const selectTypeRef = useRef(null);
  const [, setSelectTypeWidth] = useState(0);

  if (node !== null) {
    process.nextTick(() => {
      const commonEl = ReactDOM.findDOMNode(selectIsCommonRef.current) as HTMLElement | null;
      if (commonEl !== null) { setSelectIsCommonWidth(commonEl.offsetWidth); }
      const typeEl = ReactDOM.findDOMNode(selectTypeRef.current) as HTMLElement | null;
      if (typeEl !== null) { setSelectTypeWidth(typeEl.offsetWidth); }
    });
  }

  const handleFileRead = () => {
    const content = fileReader.result as string;
    changeNode({ ...node!, imageName: fileName, imageBlob: content });
    fileName = '';
  }

  const handleFileChosen = (e: any) => {
    const file = e.target.files[0];
    if (file === undefined) { return; }
    fileReader = new FileReader();
    fileReader.onload = handleFileRead;
    fileReader.readAsDataURL(file);
    const filePath = String(e.target.value).split('\\');
    fileName = filePath[filePath.length - 1];
    e.target.value = '';
  }

  const handleDeleteImage = (node: TreeNode) => () => {
    changeNode({ ...node!, imageName: '', imageBlob: '' });
  }

  const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, label: e.target.value as string});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, input: e.target.value as string});

  const handleOutput = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, output: e.target.value as string});

  const handlePreConditions = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, preConditions: e.target.value as string});

  const handlePostConditions = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, postConditions: e.target.value as string});

  const handleWorkerInCharge = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, workerInCharge: e.target.value as string});

  const handleRemarks = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, remarks: e.target.value as string});

  const handleNecessaryTools = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, necessaryTools: e.target.value as string});

  const handleExceptions = (e: React.ChangeEvent<HTMLInputElement>) =>  changeNode({ ...node!, exceptions: e.target.value as string});

  const classes = useStyles();

  const InputIcon = <InputAdornment position="start"><Input /></InputAdornment>;

  const OutputIcon = <InputAdornment position="start"><Output /></InputAdornment>;

  const PreConditionsIcon = <InputAdornment position="start"><PreConditions /></InputAdornment>;

  const PostConditionsIcon = <InputAdornment position="start"><PostConditions /></InputAdornment>;

  const WorkerInChargeIcon = <InputAdornment position="start"><WorkerInCharge /></InputAdornment>;

  const RemarksIcon = <InputAdornment position="start"><Remarks /></InputAdornment>;

  const NecessaryToolsIcon = <InputAdornment position="start"><NecessaryTools /></InputAdornment>;

  const ExceptionsIcon = <InputAdornment position="start"><Exceptions /></InputAdornment>;

  const InputField = (
    <Box mt={1.5}>
      <TextField
        label="インプット"
        value={node.input}
        onChange={handleInput}
        InputProps={{ startAdornment: InputIcon }}
        fullWidth
        multiline
        disabled={!isEditing}
      />
    </Box>);

  const OutputField = (
    <Box mt={1.5}>
      <TextField
        label="アウトプット"
        value={node.output}
        onChange={handleOutput}
        InputProps={{ startAdornment: OutputIcon }}
        fullWidth
        disabled={!isEditing}
      />
    </Box>);

  const PreConditionsField = (
    <Box mt={1.5}>
      <TextField
        label="事前条件"
        value={node.preConditions}
        onChange={handlePreConditions}
        InputProps={{ startAdornment: PreConditionsIcon }}
        fullWidth
        multiline
        disabled={!isEditing}
      />
    </Box>);

  const PostConditionsField = (
    <Box mt={1.5}>
      <TextField
        label="事後条件"
        value={node.postConditions}
        onChange={handlePostConditions}
        InputProps={{ startAdornment: PostConditionsIcon }}
        fullWidth
        disabled={!isEditing}
      />
    </Box>);

  const WorkerInChargeField = (
    <Box mt={1.5}>
      <TextField
        label="担当者"
        value={node.workerInCharge}
        onChange={handleWorkerInCharge}
        InputProps={{ startAdornment: WorkerInChargeIcon }}
        fullWidth
        multiline
        disabled={!isEditing}
      />
    </Box>);

  const RemarksField = (
    <Box mt={1.5}>
      <TextField
        label="備考"
        value={node.remarks}
        onChange={handleRemarks}
        InputProps={{ startAdornment: RemarksIcon }}
        fullWidth
        disabled={!isEditing}
      />
    </Box>);

  const NecessaryToolsField = (
    <Box mt={1.5}>
      <TextField
        label="必要システム・ツール"
        value={node.necessaryTools}
        onChange={handleNecessaryTools}
        InputProps={{ startAdornment: NecessaryToolsIcon }}
        fullWidth
        multiline
        disabled={!isEditing}
      />
    </Box>);

  const ExceptionsField = (
    <Box mt={1.5}>
      <TextField
        label="例外"
        value={node.exceptions}
        onChange={handleExceptions}
        InputProps={{ startAdornment: ExceptionsIcon }}
        fullWidth
        disabled={!isEditing}
      />
    </Box>);

  return (
    <Box>
      <Box display="flex" flexDirection="row">
        <TextField
          select
          variant="outlined"
          label="タイプ"
          value={node.type}
          InputProps={{
            startAdornment:
              isTask(node.type)   ? <Task className={classes.selectType}/> :
              isSwitch(node.type) ? <Switch className={classes.selectType}/> :
              <Case className={classnames(classes.selectType, classes.switchIcon)}/>
          }}
          disabled
        >
          <MenuItem value="0">作業</MenuItem>
          <MenuItem value="1">分岐</MenuItem>
          <MenuItem value="2">条件</MenuItem>
        </TextField>
        <Box flexGrow={1}/>
        <Box>
          <IconButton onClick={handleOpenClose}>{open ? <Less /> : <More />}</IconButton>
        </Box>
      </Box>
      <Box mt={1.5}>
        <TextField
          placeholder={
            isTask(node.type) ? phrase.placeholder.task :
              isSwitch(node.type) ? phrase.placeholder.switch : phrase.placeholder.case
          }
          value={node.label}
          onChange={handleLabel}
          fullWidth
          disabled={!isEditing}
        />
      </Box>
      {node.imageBlob.length !== 0 &&
        <Box mt={1.5} justifyContent="center">
          <Paper className={classes.imageContainer}>
            <img src={node.imageBlob} className={classes.img} alt={node.imageName} />
            {isEditing &&
            <IconButton className={classes.deleteButton} onClick={handleDeleteImage(node)}>
              <Close />
            </IconButton>}
          </Paper>
        </Box>}
      <Collapse in={!open}>
        {node.input.length !== 0 && InputField}
        {node.output.length !== 0 && OutputField}
        {node.preConditions.length !== 0 && PreConditionsField}
        {node.postConditions.length !== 0 && PostConditionsField}
        {node.workerInCharge.length !== 0 && WorkerInChargeField}
        {node.remarks.length !== 0 && RemarksField}
        {node.necessaryTools.length !== 0 && NecessaryToolsField}
        {node.exceptions.length !== 0 && ExceptionsField}
      </Collapse>

      <Collapse in={open}>
      {isEditing && node.imageBlob.length === 0 &&
        <Box mt={1.5}>
          <Button component="label" variant="outlined" className={classes.imageButton} fullWidth>
            <Image className={classes.imageIcon} />
            {node.imageName.length !== 0 ? node.imageName : 'ファイルを選択'}
            <form><input type="file" style={{ display: 'none' }} onChange={handleFileChosen} /></form>
          </Button>
        </Box>}
        {InputField}
        {OutputField}
        {PreConditionsField}
        {PostConditionsField}
        {WorkerInChargeField}
        {RemarksField}
        {NecessaryToolsField}
        {ExceptionsField}
      </Collapse>
    </Box>
  );
};

export default InfoContentComponent;