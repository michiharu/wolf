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
  rightPaneWrapper: {
    position: 'absolute',
    overflow: 'visible',
    top: toolbarHeight,
    height: `calc(100vh - ${toolbarHeight}px)`,
    right: -24,
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight,
      height: `calc(100vh - ${toolbarMinHeight}px)`,
      right: -16,
    },
    
    width: '30vw',
    minWidth: rightPainWidth,
  },
  rightPanePaper: {
    width: '100%',
    height: '100%',
    overflow: 'scroll',
    borderLeft: 'solid 1px #ccc',
    backgroundColor: theme.palette.background.paper
  },
  root: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing.unit,
    },
  },
  commonSelectForm: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 120,
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
  formControl: {
    marginTop: theme.spacing.unit,
    width: '100%',
  },
  imageForm: {marginTop: theme.spacing.unit},
  imageIcon: {marginRight: theme.spacing.unit},
  img: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
  }
});

export interface RightPaneProps {
  rightPaneRef: HTMLDivElement;
  node: EditableNode | null;
  commonNodes: TreeNode[];
  isRoot: boolean;
  isCommon: string;
  changeIsCommon: (e: any) => void;
  changeNode: (node: EditableNode) => void;
  addDetails: () => void;
  addFromCommon: (e: any) => void;
  registAsCommon: (node: EditableNode) => void;
  deleteSelf: () => void;
}

interface Props extends RightPaneProps, WithStyles<typeof styles> {}

const RightPane: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;
  var fileName: string;

  const {
    rightPaneRef, node, commonNodes, isRoot, isCommon,
    changeIsCommon, changeNode, addDetails, addFromCommon, registAsCommon, deleteSelf, classes
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
  const buttonProps: ButtonProps = {
    className: classes.marginTop, color: 'primary', fullWidth: true
  };

  const [openDetails, setOpenDetails] = useState(false);

  const [deleteFlag, setDeleteFlag] = useState(false);
  const handleClickDelete = () => {
    if (node!.children.length !== 0) {
      setDeleteFlag(true);
    } else {
      deleteSelf();
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
      registAsCommon(node!);
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
      <Portal container={rightPaneRef}>
        <Slide direction="left" in={node !== null} mountOnEnter>
          <div className={classes.rightPaneWrapper}>
          <div className={classes.rightPanePaper}>
          <div className={classes.root}>
            {isRoot &&
            <FormControl variant="outlined" className={classes.commonSelectForm}>
              <InputLabel ref={selectIsCommonRef}>マニュアル用途</InputLabel>
              <Select
                input={<OutlinedInput labelWidth={selectIsCommonWidth}/>}
                value={isCommon}
                onChange={changeIsCommon}
              >
                <MenuItem value="false">オリジナル</MenuItem>
                <MenuItem value="true">共通</MenuItem>
              </Select>
            </FormControl>}

            <TextField
              variant="outlined"
              className={classes.marginTop}
              label="タイトル"
              value={node !== null ? node.label : ''}
              onChange={(e: any) => changeNode({...node!, label: e.target.value})}
              fullWidth
            />
            <FormControl variant="outlined" className={classes.marginTop}>
              <InputLabel ref={selectTypeRef}>タイプ</InputLabel>
              <Select
                classes={{
                  icon: focusType !== 'switch'
                    ? classes.selectType
                    : classnames(classes.selectType, classes.switchIcon),
                  select: classes.select
                }}
                input={<OutlinedInput labelWidth={selectTypeWidth}/>}
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
              variant="outlined"
              className={classes.marginTop}
              label="インプット"
              value={node !== null ? node.input : ''}
              onChange={(e: any) => changeNode({...node!, input: e.target.value})}
              InputProps={{startAdornment: InputIcon}}
              fullWidth
              multiline
            />
            
            <TextField
              variant="outlined"
              className={classes.marginTop}
              label="アウトプット"
              value={node !== null ? node.output : ''}
              onChange={(e: any) => changeNode({...node!, output: e.target.value})}
              InputProps={{startAdornment: OutputIcon}}
              fullWidth
            />

            <Collapse in={openDetails}>
              <TextField
                variant="outlined"
                className={classes.marginTop}
                label="事前条件"
                value={node !== null ? node.preConditions : ''}
                onChange={(e: any) => changeNode({...node!, preConditions: e.target.value})}
                InputProps={{startAdornment: PreConditionsIcon}}
                fullWidth
                multiline
              />
              <TextField
                variant="outlined"
                className={classes.marginTop}
                label="事後条件"
                value={node !== null ? node.postConditions : ''}
                onChange={(e: any) => changeNode({...node!, postConditions: e.target.value})}
                InputProps={{startAdornment: PostConditionsIcon}}
                fullWidth
              />
              <TextField
                variant="outlined"
                className={classes.marginTop}
                label="担当者"
                value={node !== null ? node.workerInCharge : ''}
                onChange={(e: any) => changeNode({...node!, workerInCharge: e.target.value})}
                InputProps={{startAdornment: WorkerInChargeIcon}}
                fullWidth
                multiline
              />
              <TextField
                variant="outlined"
                className={classes.marginTop}
                label="備考"
                value={node !== null ? node.remarks : ''}
                onChange={(e: any) => changeNode({...node!, remarks: e.target.value})}
                InputProps={{startAdornment: RemarksIcon}}
                fullWidth
              />
              <TextField
                variant="outlined"
                className={classes.marginTop}
                label="必要システム・ツール"
                value={node !== null ? node.necessaryTools : ''}
                onChange={(e: any) => changeNode({...node!, necessaryTools: e.target.value})}
                InputProps={{startAdornment: NecessaryToolsIcon
                }}
                fullWidth
                multiline
              />
              <TextField
                variant="outlined"
                className={classes.marginTop}
                label="例外"
                value={node !== null ? node.exceptions : ''}
                onChange={(e: any) => changeNode({...node!, exceptions: e.target.value})}
                InputProps={{startAdornment: ExceptionsIcon}}
                fullWidth
              />
              <Grid container className={classes.imageForm} spacing={16} alignItems="center">
                <Grid item xs>
                  <Button component="label" size="large" fullWidth>
                    <Image className={classes.imageIcon}/>
                    {node !== null && node.imageName.length !== 0 ? node.imageName : 'ファイルを選択'}
                    <form><input type="file" style={{ display: 'none' }} onChange={handleFileChosen}/></form>
                  </Button>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => changeNode({...node!, imageName: '', imageBlob: ''})}>
                    <Delete/>
                  </IconButton>
                </Grid>
              </Grid>
              {node !== null && node.imageBlob.length !== 0 && <img src={node.imageBlob} className={classes.img}/>}
              
            </Collapse>

            <Button {...buttonProps} onClick={() => setOpenDetails(!openDetails)}>
              {`詳細を${openDetails ? '非' : ''}表示`}
            </Button>

            <Divider className={classes.marginTop} />

            <Button {...buttonProps} onClick={addDetails}>項目を追加</Button>

            {commonNodes.length !== 0 &&
            <FormControl className={classes.formControl}>
              <InputLabel>共通マニュアルから項目を追加</InputLabel>
              <Select
                value=""
                onChange={addFromCommon}
              >
                <MenuItem value=""><em>追加をキャンセル</em></MenuItem>
                {commonNodes.map(c => <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>)}
              </Select>
            </FormControl>}
            
            {!isRoot && (
            <Button {...buttonProps} color="default" onClick={handleClickDelete}>この項目を削除</Button>)}
            {node !== null &&
            <Button {...buttonProps} color="default" onClick={handleAddCommon}>共通マニュアルに登録</Button>}        
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
          <Button onClick={() => { deleteSelf(); setDeleteFlag(false)}} color="primary" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

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
      </Dialog>}
    </>
  );
};

export default withStyles(styles)(RightPane);