import * as React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import {
  Theme, createStyles, WithStyles, withStyles, Grid,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  InputAdornment, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Divider, Button, Slide, Collapse, IconButton, Paper
} from '@material-ui/core';

import {
  Task, Switch, Case, Input, Output, PreConditions, PostConditions,
  WorkerInCharge, Remarks, NecessaryTools, Exceptions, Image, Delete,
} from '../../../../settings/layout';
import {TreeNode, Type, NodeWithSimilarity, Tree, KWithArrow, baseKWithArrow } from '../../../../data-types/tree';
import { ButtonProps } from '@material-ui/core/Button';
import SimilarityTable from '../../../../components/similarity-table/similarity-table';
import SimilarityUtil from '../../../../func/similarity';
import TreeUtil from '../../../../func/tree';
import { phrase } from '../../../../settings/phrase';
import { ScrollableTextField } from '../../../../components/custom-mui/scrollable-textfield';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    maxHeight: '100%',
    overflow: 'scroll',
    padding: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 2,
  },
  commonSelectForm: {
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
  imageForm: { marginTop: theme.spacing.unit },
  imageIcon: { marginRight: theme.spacing.unit },
  img: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
  }
});

export interface RightPaneProps {
  isRoot: boolean;
  node: KWithArrow | null;
  commonNodes: Tree[];
  changeNode: (node: KWithArrow) => void;
  addDetails: () => void;
  addFromCommon: (e: any) => void;
  registAsCommon: (node: TreeNode) => void;
  deleteSelf: () => void;
  setShowViewSettings: () => void;
}

interface Props extends RightPaneProps, WithStyles<typeof styles> { }

const RightPane: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;
  var fileName: string;

  const {
    isRoot, node, commonNodes, changeNode, addDetails,
    addFromCommon, registAsCommon, deleteSelf, setShowViewSettings, classes
  } = props;

  const cahngeType = (e: any) => {
    if (node === null) { return; }
    const newType = e.target.value === 'task' ? 'task' : 'switch';
    if (node.type === newType) { return; }

    if (node.children.length === 0) {
      const newNode: KWithArrow = { ...node, type: newType };
      changeNode(newNode);
    }

    if (newType === 'task') {
      const children: KWithArrow[] = node.children.map(c => c.children).reduce((a, b) => a.concat(b));
      const newNode: KWithArrow = { ...node, type: newType, children };
      changeNode(newNode);
    } else {
      const newCase = TreeUtil.getNewNode('switch', baseKWithArrow);
      const children: KWithArrow[] = [{ ...newCase, children: node.children }];
      const newNode: KWithArrow = { ...node, type: newType, children };
      changeNode(newNode);
    }
  };

  const selectIsCommonRef = useRef(null);
  const [selectIsCommonWidth, setSelectIsCommonWidth] = useState(0);

  if (node !== null) {
    process.nextTick(() => {
      const commonEl = ReactDOM.findDOMNode(selectIsCommonRef.current) as HTMLElement | null;
      if (commonEl !== null) { setSelectIsCommonWidth(commonEl.offsetWidth); }
    });
  }

  const InputIcon = <InputAdornment position="start"><Input /></InputAdornment>;

  const OutputIcon = <InputAdornment position="start"><Output /></InputAdornment>;

  const PreConditionsIcon = <InputAdornment position="start"><PreConditions /></InputAdornment>;

  const PostConditionsIcon = <InputAdornment position="start"><PostConditions /></InputAdornment>;

  const WorkerInChargeIcon = <InputAdornment position="start"><WorkerInCharge /></InputAdornment>;

  const RemarksIcon = <InputAdornment position="start"><Remarks /></InputAdornment>;

  const NecessaryToolsIcon = <InputAdornment position="start"><NecessaryTools /></InputAdornment>;

  const ExceptionsIcon = <InputAdornment position="start"><Exceptions /></InputAdornment>;


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

    if (filteredList.length !== 0) {
      setFilteredSimilarityList(filteredList);
    } else {
      registAsCommon(node!);
    }
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

  return (

    <Paper className={classes.root}>
      <Grid container spacing={16} alignItems="center">
        <Grid item xs>
          <FormControl variant="outlined">
            <InputLabel>タイプ</InputLabel>
            <Select
              classes={{
                icon: focusType !== 'switch'
                  ? classes.selectType
                  : classnames(classes.selectType, classes.switchIcon),
                select: classes.select
              }}
              input={<OutlinedInput labelWidth={48} />}
              value={node !== null ? node.type : 'task'}
              onChange={cahngeType}
              IconComponent={
                p => focusType === 'task' ? <Task {...p} /> :
                  focusType === 'switch' ? <Switch {...p} /> :
                    <Case {...p} />}
              disabled={node === null || node.type === 'case'}
            >
              <MenuItem value="task">作業</MenuItem>
              {node !== null && <MenuItem value="switch">分岐</MenuItem>}
              {node !== null && node.type === 'case' && <MenuItem value="case">条件</MenuItem>}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          
        </Grid>
      </Grid>
      <ScrollableTextField
        variant="outlined"
        className={classes.marginTop}
        label="タイトル"
        placeholder={
          node === null ? 'タイトル' :
          node.type === 'task' ? phrase.placeholder.task :
          node.type === 'switch' ? phrase.placeholder.switch : phrase.placeholder.case
        }
        InputLabelProps={{shrink: true}}
        value={node !== null ? node.label : ''}
        onChange={(e: any) => changeNode({ ...node!, label: e.target.value })}
        fullWidth
        disabled={node === null}
      />

      <Grid container className={classes.imageForm} spacing={16} alignItems="center">
        <Grid item xs>
          <Button component="label" size="large" fullWidth disabled={node === null}>
            <Image className={classes.imageIcon} />
            {node !== null && node.imageName.length !== 0 ? node.imageName : 'ファイルを選択'}
            <form><input type="file" style={{ display: 'none' }} onChange={handleFileChosen} /></form>
          </Button>
        </Grid>
        <Grid item>
          <IconButton onClick={() => changeNode({ ...node!, imageName: '', imageBlob: '' })} disabled={node === null}>
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
      {node !== null && node.imageBlob.length !== 0 && <img src={node.imageBlob} className={classes.img} />}

      <Collapse in={openDetails}>
        <ScrollableTextField
          variant="outlined"
          className={classes.marginTop}
          label="インプット"
          value={node !== null ? node.input : ''}
          onChange={(e: any) => changeNode({ ...node!, input: e.target.value })}
          InputProps={{ startAdornment: InputIcon }}
          fullWidth
          disabled={node === null}
        />

        <ScrollableTextField
          variant="outlined"
          className={classes.marginTop}
          label="アウトプット"
          value={node !== null ? node.output : ''}
          onChange={(e: any) => changeNode({ ...node!, output: e.target.value })}
          InputProps={{ startAdornment: OutputIcon }}
          fullWidth
          disabled={node === null}
        />
        <ScrollableTextField
          variant="outlined"
          className={classes.marginTop}
          label="事前条件"
          value={node !== null ? node.preConditions : ''}
          onChange={(e: any) => changeNode({ ...node!, preConditions: e.target.value })}
          InputProps={{ startAdornment: PreConditionsIcon }}
          fullWidth
          disabled={node === null}
        />
        <ScrollableTextField
          variant="outlined"
          className={classes.marginTop}
          label="事後条件"
          value={node !== null ? node.postConditions : ''}
          onChange={(e: any) => changeNode({ ...node!, postConditions: e.target.value })}
          InputProps={{ startAdornment: PostConditionsIcon }}
          fullWidth
          disabled={node === null}
        />
        <ScrollableTextField
          variant="outlined"
          className={classes.marginTop}
          label="担当者"
          value={node !== null ? node.workerInCharge : ''}
          onChange={(e: any) => changeNode({ ...node!, workerInCharge: e.target.value })}
          InputProps={{ startAdornment: WorkerInChargeIcon }}
          fullWidth
          disabled={node === null}
        />
        <ScrollableTextField
          variant="outlined"
          className={classes.marginTop}
          label="備考"
          value={node !== null ? node.remarks : ''}
          onChange={(e: any) => changeNode({ ...node!, remarks: e.target.value })}
          InputProps={{ startAdornment: RemarksIcon }}
          fullWidth
          disabled={node === null}
        />
        <ScrollableTextField
          variant="outlined"
          className={classes.marginTop}
          label="必要システム・ツール"
          value={node !== null ? node.necessaryTools : ''}
          onChange={(e: any) => changeNode({ ...node!, necessaryTools: e.target.value })}
          InputProps={{
            startAdornment: NecessaryToolsIcon
          }}
          fullWidth
          disabled={node === null}
        />
        <ScrollableTextField
          variant="outlined"
          className={classes.marginTop}
          label="例外"
          value={node !== null ? node.exceptions : ''}
          onChange={(e: any) => changeNode({ ...node!, exceptions: e.target.value })}
          InputProps={{ startAdornment: ExceptionsIcon }}
          fullWidth
          disabled={node === null}
        />
      </Collapse>

      <Button {...buttonProps} onClick={() => setOpenDetails(!openDetails)}>
        {`詳細を${openDetails ? '非' : ''}表示`}
      </Button>

      <Divider className={classes.marginTop} />

      <Button {...buttonProps} onClick={addDetails} disabled={node === null}>項目を追加</Button>

      {commonNodes.length !== 0 && node !== null &&
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
      <Button {...buttonProps} color="default" onClick={handleClickDelete} disabled={node === null}>この項目を削除</Button>)}

      {node !== null &&
      <Button {...buttonProps} color="default" onClick={handleAddCommon}>共通マニュアルに登録</Button>}

      <Dialog open={deleteFlag} onClose={() => setDeleteFlag(false)}>
        <DialogTitle>この項目を削除してもよろしいですか？</DialogTitle>
        <DialogContent>
          <DialogContentText>この項目には詳細項目が含まれています。削除してもよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteFlag(false)}>Cancel</Button>
          <Button onClick={() => { deleteSelf(); setDeleteFlag(false) }} color="primary" autoFocus>Delete</Button>
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
            <SimilarityTable target={node} list={commonNodes} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFilteredSimilarityList(null)}>キャンセル</Button>
            <Button onClick={() => { setFilteredSimilarityList(null); registAsCommon(node!); }} color="primary" autoFocus>登録</Button>
          </DialogActions>
        </Dialog>}
        
    </Paper>
  );
};

export default withStyles(styles)(RightPane);