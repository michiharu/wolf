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

import SimilarityUtil from '../../../../func/similarity';
import TreeUtil from '../../../../func/tree';
import { phrase } from '../../../../settings/phrase';

const styles = (theme: Theme) => createStyles({
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
  changeNode: (node: TreeNode) => void;
  deleteSelf: (node: TreeNode) => void;
}

interface Props extends TextLineWithIconProps, WithStyles<typeof styles> {}

const TextLineWithIcon: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;
  var fileName: string;

  const {
    itemNumber, node, deleteSelf,
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
      const newCase = TreeUtil.getNewNode('switch', baseTreeNode);
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
    <div className={classes.root}>
      <Grid container spacing={2}>
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
                  onChange={cahngeType}
                  IconComponent={
                    p => focusType === 'task' ?   <Task {...p}/> :
                        focusType === 'switch' ? <Switch {...p}/> :
                                                  <Case {...p}/>}
                  disabled={node.type === 'case'}
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
            onChange={(e: any) => changeNode({...node!, label: e.target.value})}
            fullWidth
          />
          <TextField
            style={{paddingLeft: 80}}
            placeholder="インプット"
            value={node.input}
            onChange={(e: any) => changeNode({...node!, input: e.target.value})}
            InputProps={{startAdornment: InputIcon}}
            fullWidth
            multiline
          />
          
          <TextField
            style={{paddingLeft: 80}}
            placeholder="アウトプット"
            value={node.output}
            onChange={(e: any) => changeNode({...node!, output: e.target.value})}
            InputProps={{startAdornment: OutputIcon}}
            fullWidth
          />

            <TextField
              style={{paddingLeft: 80}}
              placeholder="事前条件"
              value={node.preConditions}
              onChange={(e: any) => changeNode({...node!, preConditions: e.target.value})}
              InputProps={{startAdornment: PreConditionsIcon}}
              fullWidth
              multiline
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="事後条件"
              value={node.postConditions}
              onChange={(e: any) => changeNode({...node!, postConditions: e.target.value})}
              InputProps={{startAdornment: PostConditionsIcon}}
              fullWidth
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="担当者"
              value={node.workerInCharge}
              onChange={(e: any) => changeNode({...node!, workerInCharge: e.target.value})}
              InputProps={{startAdornment: WorkerInChargeIcon}}
              fullWidth
              multiline
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="備考"
              value={node.remarks}
              onChange={(e: any) => changeNode({...node!, remarks: e.target.value})}
              InputProps={{startAdornment: RemarksIcon}}
              fullWidth
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="必要システム・ツール"
              value={node.necessaryTools}
              onChange={(e: any) => changeNode({...node!, necessaryTools: e.target.value})}
              InputProps={{startAdornment: NecessaryToolsIcon
              }}
              fullWidth
              multiline
            />
            <TextField
              style={{paddingLeft: 80}}
              placeholder="例外"
              value={node.exceptions}
              onChange={(e: any) => changeNode({...node!, exceptions: e.target.value})}
              InputProps={{startAdornment: ExceptionsIcon}}
              fullWidth
            />
            <div style={{paddingLeft: 72}}>
              <Button component="label" size="small">
                <Image className={classes.imageIcon}/>
                {node.imageName.length !== 0 ? node.imageName : 'ファイルを選択'}
                <form><input type="file" style={{ display: 'none' }} onChange={handleFileChosen}/></form>
              </Button>
            </div>
        </Grid>
        <Grid item xs={12} lg={4}>
          {node.imageBlob.length !== 0 &&
          <Grid container justify="center">
            <Grid item>
              <Paper className={classes.imageContainer}>
                <img src={node.imageBlob} className={classes.img}/>
                <IconButton className={classes.deleteButton} onClick={() => changeNode({...node!, imageName: '', imageBlob: ''})}>
                  <Close/>
                </IconButton>
              </Paper>
            </Grid>
          </Grid>}
        </Grid>
      </Grid>
        
      {node.children.map((c, i) => <TextLineWithIcon key={c.id} {...props} itemNumber={`${itemNumber} - ${i + 1}`} node={c}/>)}
          
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
  );
};

export default withStyles(styles)(TextLineWithIcon);