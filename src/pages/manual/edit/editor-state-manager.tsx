import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Snackbar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Toolbar, AppBar, Tab, Tabs,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Download from '@material-ui/icons/SaveAlt';
import CloseIcon from '@material-ui/icons/Close';
import ViewSettingsIcon from '@material-ui/icons/Settings';
import { Divergent, Convergent } from '../../../settings/layout' 

import { Tree, TreeNode, baseTreeNode, KTreeNode } from '../../../data-types/tree-node';
import NodeEditor, { NodeEditorProps } from './node-editor/node-editor';
import { RouteComponentProps, withRouter } from 'react-router';
import links from '../../../settings/links';
import TreeUtil from '../../../func/tree';
import { fileDownload } from '../../../func/file-download';
import TextEditor, { TextEditorProps } from './text-editor/text-editor';
import TreeNodeUtil from '../../../func/tree-node';
import { theme } from '../../..';
import { NodeEditMode } from '../../../data-types/node-edit-mode';

const styles = (theme: Theme) => createStyles({
  root: {
    // position: 'relative',
    // width: '100%',
    // overflow: 'scroll',
  },
  toolbar: {
    display: 'flex',
    width: theme.breakpoints.width('md'),
    margin: 'auto',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  convergent: {
    transform: 'scale(1, -1)',
  },
  close: {
    padding: theme.spacing.unit * 0.5,
  },
  editFinishButton: {
    marginLeft: theme.spacing.unit,
  }
});

export interface EditorStateManagerProps {
  manuals: Tree[];
  commons: Tree[];
  memos: KTreeNode[];
  changeManuals: (node: Tree[]) => void;
  changeMemo: (memoList: KTreeNode[]) => void;
}

interface Props extends EditorStateManagerProps, WithStyles<typeof styles>, RouteComponentProps<{id: string}> {}

interface State {
  tabIndex: number; // 0: カード表示、1: テキスト表示
  // divergent thinking（発散思考）、 convergent thinking（収束思考）
  mode: NodeEditMode;
  node: TreeNode;
  memoList: KTreeNode[];
  hasDifference: boolean;
  cannotSaveReason: CannotSaveReason;
  saved: boolean;
  nextLink: string | null;
  showViewSettings: boolean;
}

export type CannotSaveReason = 'switch' | 'case' | null;

class EditorStateManager extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { manuals, commons, memos, match } = props;
    const nodeId = match.params.id;
    this.state = EditorStateManager.getInitialState(manuals, nodeId, commons, memos);
  }

  componentDidMount() {
    /*
      popstateイベントはstateが変更される際に発火する。
      browserのhistoryはreactの読み込み時点から変化しておらずreact-routerが別にhistory管理を行なっているため、
      空のstateを追加（history.pushState）することでブラウザーの戻るボタンでpopstateイベントが発火するようにする。
    */
    history.pushState('', '', null);
    window.onpopstate = this.popstate;
    
  }

  componentWillUnmount() {
    window.onpopstate = null;
  }

  popstate = (e: any) => {
    e.preventDefault();
    this.differenceCheck(null);
  }

  static getInitialState = (trees: Tree[], id: string, commonNodes: Tree[], memoList: KTreeNode[]): State => {
    const foundNode = TreeUtil._findArray(trees, id)!;
    var node = TreeUtil._get(foundNode, baseTreeNode);
    node = TreeNodeUtil._init(node);
    return {
      tabIndex: 0,
      mode: 'dc',
      node,
      memoList,
      hasDifference: false,
      cannotSaveReason: null,
      saved: false,
      nextLink: null,
      showViewSettings: false,
    };
  }

  differenceCheck = (nextLink: string | null) => {
    const { manuals, match, history } = this.props;
    const node = TreeUtil._findArray(manuals, match.params.id)!;
    if (TreeUtil._hasDifference(node, this.state.node)) {
      this.setState({hasDifference: true, nextLink});
    } else {
      if (nextLink !== null) {
        history.push(nextLink)
      } else {
        history.goBack();
      }
    }
  }

  edit = (editNode: TreeNode) => {
    this.setState({node: editNode});
  }

  addMemo = (memo: KTreeNode) => {
    const { memoList } = this.state;
    memoList.push(memo);
    this.setState({memoList});
  }

  editMemo = (memo: KTreeNode) => {
    const { memoList } = this.state;
    this.setState({
      memoList: memoList.map(m => m.id === memo.id ? memo : m)
    });
  }

  deleteMemo = (memo: KTreeNode) => {
    const { memoList } = this.state;
    this.setState({memoList: memoList.filter(m => m.id !== memo.id)});
  }

  save = () => {
    const { manuals, changeManuals, changeMemo, history } = this.props;
    const {node, memoList} = this.state;
    const isAllSwitchHasCase = TreeUtil._isAllSwitchHasCase(node);
    const isAllCaseHasItem = TreeUtil._isAllCaseHasItem(node);
    const cannotSaveReason: CannotSaveReason = !isAllSwitchHasCase ? 'switch' :
                                               !isAllCaseHasItem   ? 'case'   : null;
    this.setState({cannotSaveReason});
    if (cannotSaveReason === null) {
      this.setState({saved: true});
      const newManuals = TreeUtil._replaceArray(manuals, node);
      changeManuals(newManuals);
      changeMemo(memoList);
      history.goBack();
    }
  }

  saveAndGo = () => {
    const { manuals, changeManuals, changeMemo, history } = this.props;
    const { node, memoList, nextLink } = this.state;
    const newManuals = TreeUtil._replaceArray(manuals, node);
    changeManuals(newManuals);
    changeMemo(memoList);
    if (nextLink !== null) {
      history.push(nextLink)
    } else {
      history.goBack();
    }
  }

  render() {
    const { commons, classes } = this.props;
    const { tabIndex, mode, node, memoList, hasDifference, cannotSaveReason, saved, showViewSettings } = this.state;
  
    const nodeProps: NodeEditorProps = {
      commons,
      mode,
      node,
      memoList,
      showViewSettings,
      edit: this.edit,
      deleteMemo: this.deleteMemo,
      addMemo: this.addMemo,
      editMemo: this.editMemo,
      closeViewSettings: () => this.setState({showViewSettings: false}),
    };

    const textProps: TextEditorProps = {
      commons,
      node,
      edit: this.edit,
    };

    const cannotSave: CannotSaveReason = cannotSaveReason !== null ? cannotSaveReason :
      !TreeUtil._isAllSwitchHasCase(node) ? 'switch' :
      !TreeUtil._isAllCaseHasItem(node)   ? 'case'   : null;
    const getStyle = (buttonMode: NodeEditMode) => {
      return mode === buttonMode ? { backgroundColor: theme.palette.background.paper } : undefined;
    };
    return (
      <div className={classes.root}>
        <div className={classes.toolbar}>
          <Tabs indicatorColor="primary" value={tabIndex} onChange={(_, tabIndex) => this.setState({tabIndex})}>
            <Tab label="ツリー表示" />
            <Tab label="テキスト表示" />
          </Tabs>

          <div style={{flexGrow: 1}} />

          {tabIndex === 0 && <>
            <Button style={getStyle('d')}  onClick={() => this.setState({mode: 'd'})} ><Divergent/></Button>
            <Button style={getStyle('dc')} onClick={() => this.setState({mode: 'dc'})}><Divergent/><Convergent className={classes.convergent}/></Button>
            <Button style={getStyle('c')}  onClick={() => this.setState({mode: 'c'})} ><Convergent className={classes.convergent}/></Button>
            <div style={{flexGrow: 1}} />
            <IconButton onClick={() => this.setState({showViewSettings: true})}><ViewSettingsIcon/></IconButton>
          </>}

          <Button variant="contained" color="primary" size="small" onClick={this.save} className={classes.editFinishButton}>編集完了</Button>
        </div>

        {tabIndex === 0 && <NodeEditor {...nodeProps}/>}
        {tabIndex === 1 && <TextEditor {...textProps}/>}
        
        <Dialog open={hasDifference} onClose={() => this.setState({hasDifference: false})}>
          <DialogTitle>マニュアルを保存せずに画面を移動してもよろしいですか？</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {cannotSave === 'switch' && '現在のデータは、分岐に条件が設定されていない項目があるため保存できません。'}
              {cannotSave === 'case'   && '現在のデータは、条件に詳細項目が設定されていない項目があるため保存できません。'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({hasDifference: false, nextLink: null})}>いいえ</Button>
            {cannotSave === null &&
            <Button onClick={this.saveAndGo} color="primary" autoFocus>保存して移動</Button>}
            <Button onClick={() => this.props.history.push(links.dashboard)} color="primary">保存せずに移動</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={cannotSaveReason !== null} onClose={() => this.setState({cannotSaveReason: null})}>
          <DialogTitle>このデータは保存できません</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {cannotSaveReason === 'switch' && 'すべての分岐には、１つ以上の条件を設定して下さい。'}
              {cannotSaveReason === 'case'   && 'すべての条件には、１つ以上の詳細項目を設定して下さい。'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({cannotSaveReason: null})} color="primary" autoFocus>OK</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={saved}
          autoHideDuration={5000}
          onClose={() => this.setState({saved: false})}
          message={<span>保存しました</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={() => this.setState({saved: false})}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(EditorStateManager));