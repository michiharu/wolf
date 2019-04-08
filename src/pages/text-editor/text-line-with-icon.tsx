import * as React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import {
  Theme, createStyles, WithStyles, withStyles, Portal, TextField, Grid,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  InputAdornment, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Divider, Button, Slide, Collapse, IconButton
} from '@material-ui/core';
import {
  Task, Switch, Case, Input, Output, PreConditions, PostConditions,
  WorkerInCharge, Remarks, NecessaryTools, Exceptions, Image, Delete,
  toolbarHeight, toolbarMinHeight, rightPainWidth
} from '../../settings/layout';
import TreeNode, { Type, EditableNode, NodeWithSimilarity } from '../../data-types/tree-node';
import { ButtonProps } from '@material-ui/core/Button';
import EditableNodeUtil from '../../func/editable-node-util';
import SimilarityTable from '../../components/similarity-table/similarity-table';
import SimilarityUtil from '../../func/similarity';

const styles = (theme: Theme) => createStyles({
  select: {
    marginRight: theme.spacing.unit,
  },
  selectType: {
    marginRight: theme.spacing.unit,
  },
  switchIcon: {
    transform: 'scale(1, -1)',
  },
  formControl: {
    marginTop: theme.spacing.unit,
    width: '100%',
  },
  marginTop: {
    marginTop: 0,
  }
});

export interface TextLineWithIconProps {
  depth: number;
  node: TreeNode;
  commonNodes: TreeNode[];
  changeNode: (node: TreeNode) => void;
  // addDetails: () => void;
  // addFromCommon: (e: any) => void;
  // registAsCommon: (node: EditableNode) => void;
  deleteSelf: (node: TreeNode) => void;
}

interface Props extends TextLineWithIconProps, WithStyles<typeof styles> {}

const TextLineWithIcon: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;
  var fileName: string;

  const {
    depth, node, commonNodes, deleteSelf,
    changeNode, classes
  } = props;

  const cahngeType = (e: any) => {
    if (node === null) { return; }
    const newType = e.target.value === 'task' ? 'task' : 'switch';
    if (node.type === newType) { return; }

    if (node.children.length === 0) {
      const newNode: TreeNode = {...node, type: newType};
      changeNode(newNode);
    }

    if (newType === 'task') {
      const children: TreeNode[] = node.children.map(c => c.children).reduce((a, b) => a.concat(b));
      const newNode: TreeNode = {...node, type: newType, children};
      changeNode(newNode);
    } else {
      const newCase = EditableNodeUtil.getNewNode('switch');
      const children: TreeNode[] = [{...newCase, children: node.children}];
      const newNode: TreeNode = {...node, type: newType, children};
      changeNode(newNode);
    }
  };

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

  const [deleteFlag, setDeleteFlag] = useState(false);
  const handleClickDelete = () => {
    if (node!.children.length !== 0) {
      setDeleteFlag(true);
    } else {
      deleteSelf(node);
    }
  }
  const [filteredSimilarityList, setFilteredSimilarityList] = useState<NodeWithSimilarity[] | null>(null);
  const handleAddCommon = () => {
    const similarityList = SimilarityUtil.get(node!, commonNodes);
    const filteredList = similarityList
    .filter(s => s._label === 100 && s._input === 100 && s._output === 100 && s._childrenLength === 100);
    console.log(similarityList);

    if (filteredList.length !== 0) {
      setFilteredSimilarityList(filteredList);
    } else {
      // registAsCommon(node!);
    }
  }

  const handleFileRead = () => {
    const content = fileReader.result as string;
    changeNode({...node!, imageName: fileName, imageBlob: content});
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

  return (
    <>
    <div style={{marginTop: 20, width: '100%', paddingLeft: 40 * depth}}>
      <FormControl className={classes.marginTop}>
        <Select
          classes={{
            icon: focusType !== 'switch'
              ? classes.selectType
              : classnames(classes.selectType, classes.switchIcon),
            select: classes.select
          }}
          // input={<OutlinedInput labelWidth={selectTypeWidth}/>}
          value={node !== null ? node.type : 'task'}
          onChange={cahngeType}
          IconComponent={
            p => focusType === 'task' ?   <Task {...p}/> :
                focusType === 'switch' ? <Switch {...p}/> :
                                          <Case {...p}/>}
          disabled={node !== null && node.type === 'case'}
        >
          <MenuItem value="task">作業</MenuItem>
          {node !== null && <MenuItem value="switch">分岐</MenuItem>}
          {node !== null && node.type === 'case' && <MenuItem value="case">条件</MenuItem>}
        </Select>
      </FormControl>
      <TextField
        className={classes.marginTop}
        placeholder="タイトル"
        value={node !== null ? node.label : ''}
        onChange={(e: any) => changeNode({...node!, label: e.target.value})}
        fullWidth
      />

      <TextField
        className={classes.marginTop}
        style={{paddingLeft: 80}}
        placeholder="インプット"
        value={node !== null ? node.input : ''}
        onChange={(e: any) => changeNode({...node!, input: e.target.value})}
        InputProps={{startAdornment: InputIcon}}
        fullWidth
        multiline
      />
      
      <TextField
        className={classes.marginTop}
        style={{paddingLeft: 80}}
        placeholder="アウトプット"
        value={node !== null ? node.output : ''}
        onChange={(e: any) => changeNode({...node!, output: e.target.value})}
        InputProps={{startAdornment: OutputIcon}}
        fullWidth
      />

        <TextField
          className={classes.marginTop}
          style={{paddingLeft: 80}}
          placeholder="事前条件"
          value={node !== null ? node.preConditions : ''}
          onChange={(e: any) => changeNode({...node!, preConditions: e.target.value})}
          InputProps={{startAdornment: PreConditionsIcon}}
          fullWidth
          multiline
        />
        <TextField
          className={classes.marginTop}
          style={{paddingLeft: 80}}
          placeholder="事後条件"
          value={node !== null ? node.postConditions : ''}
          onChange={(e: any) => changeNode({...node!, postConditions: e.target.value})}
          InputProps={{startAdornment: PostConditionsIcon}}
          fullWidth
        />
        <TextField
          className={classes.marginTop}
          style={{paddingLeft: 80}}
          placeholder="担当者"
          value={node !== null ? node.workerInCharge : ''}
          onChange={(e: any) => changeNode({...node!, workerInCharge: e.target.value})}
          InputProps={{startAdornment: WorkerInChargeIcon}}
          fullWidth
          multiline
        />
        <TextField
          className={classes.marginTop}
          style={{paddingLeft: 80}}
          placeholder="備考"
          value={node !== null ? node.remarks : ''}
          onChange={(e: any) => changeNode({...node!, remarks: e.target.value})}
          InputProps={{startAdornment: RemarksIcon}}
          fullWidth
        />
        <TextField
          className={classes.marginTop}
          style={{paddingLeft: 80}}
          placeholder="必要システム・ツール"
          value={node !== null ? node.necessaryTools : ''}
          onChange={(e: any) => changeNode({...node!, necessaryTools: e.target.value})}
          InputProps={{startAdornment: NecessaryToolsIcon
          }}
          fullWidth
          multiline
        />
        <TextField
          className={classes.marginTop}
          style={{paddingLeft: 80}}
          placeholder="例外"
          value={node !== null ? node.exceptions : ''}
          onChange={(e: any) => changeNode({...node!, exceptions: e.target.value})}
          InputProps={{startAdornment: ExceptionsIcon}}
          fullWidth
        />
        <Grid
          container
          style={{width: '100%', paddingLeft: 68}}
          className={classes.marginTop}
          spacing={16}
          alignItems="flex-end"
        >
          <Grid item>
            <IconButton component="label">
              <Image/>
              <form><input type="file" style={{ display: 'none' }} onChange={handleFileChosen}/></form>
            </IconButton>
          </Grid>
          <Grid item xs>
            <TextField
              value={node !== null && node.imageName !== undefined ? node.imageName : ''}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => changeNode({...node!, imageName: '', imageBlob: ''})}>
              <Delete/>
            </IconButton>
          </Grid>
        </Grid>
        {/* {node !== null && node.imageBlob.length !== 0 && <img src={node.imageBlob} />} */}
        
        {node.children.map(c => <TextLineWithIcon key={c.id} {...props} depth={depth + 1} node={c}/>)}
          
      <Dialog open={deleteFlag} onClose={() => setDeleteFlag(false)}>
        <DialogTitle>この項目を削除してもよろしいですか？</DialogTitle>
        <DialogContent>
          <DialogContentText>この項目には詳細項目が含まれています。削除してもよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteFlag(false)}>Cancel</Button>
          <Button onClick={() => { deleteSelf(node); setDeleteFlag(false)}} color="primary" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
{/* 
      {node !== null &&
      <Dialog
        fullWidth
        maxWidth="lg"
        open={filteredSimilarityList !== null}
        onClose={() => setFilteredSimilarityList(null)}
      >
        <DialogTitle>{`「${node!.label}」を共通マニュアルに登録してもよろしいですか？`}</DialogTitle>
        <DialogContent>
          <SimilarityTable target={node} list={commonNodes}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilteredSimilarityList(null)}>キャンセル</Button>
          <Button onClick={() => {setFilteredSimilarityList(null); registAsCommon(node!);}} color="primary" autoFocus>登録</Button>
        </DialogActions>
      </Dialog>} */}
    </div>
    {/* <Divider style={{marginTop: 20}}/> */}
    </>
  );
};

export default withStyles(styles)(TextLineWithIcon);