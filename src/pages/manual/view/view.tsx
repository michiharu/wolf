import * as React from 'react';
import {useState} from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualState } from '../../../redux/states/manualState';
import {
  Theme, createStyles, WithStyles, withStyles,
  Tabs, Tab, Typography, Divider, Button,
} from '@material-ui/core';
import { Link, RouteComponentProps } from 'react-router-dom';
import { baseTreeNode, TreeNode, Tree, Manual } from '../../../data-types/tree';
import TreeUtil from '../../../func/tree';
import NodeViewer from './node-viewer';
import TextViewer from './text-viewer';
import ManualSettings from './settings/settings';
import TreeNodeUtil from '../../../func/tree-node';
import RequestList from './request-list';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing.unit * 2,
  },
  header: {
    maxWidth: theme.breakpoints.width('md'),
    margin: 'auto',
  },
  body: {
    maxWidth: theme.breakpoints.width('md'),
    margin: 'auto',
    textAlign: 'right',
  },
  toolbar: theme.mixins.toolbar,
  convergent: {
    transform: 'scale(1, -1)',
  },
  close: {
    padding: theme.spacing.unit * 0.5,
  },
});

interface Props extends ManualState, WithStyles<typeof styles>, RouteComponentProps<{id: string}> {}

const View: React.FC<Props> = props => {
  const { manuals, match, classes } =  props;
  const [node, setNode] = useState<TreeNode | null>(null);

  const manual = TreeUtil._findArray(manuals, match.params.id)!;
  if (node === null) {
    const tree = TreeUtil._get<Tree, TreeNode>(manual, baseTreeNode);
    setNode(TreeNodeUtil._init(tree));
  }

  const [tabIndex, setTabIndex] = useState(0);
  const [showVS, setShowVS] = useState(false);
  const handleChangeTab = (_: any, i: number) => setTabIndex(i);
  const LinkEdit = (le: any) => <Link to={`/manual/${manual.id}/edit`} {...le}/>;
  const edit = (editNode: TreeNode) => setNode(editNode);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div style={{display: 'flex', height: 48}}>
          <Typography variant="h4">{manual.label}</Typography>
          <div style={{flexGrow: 1}} />
          {(tabIndex === 0 || tabIndex === 1) &&
          <Button component={LinkEdit} variant="contained" color="primary" size="small" style={{height: 48}}>編集する</Button>}
        </div>
        <div>
          <Tabs value={tabIndex} onChange={handleChangeTab}>
            <Tab label="ツリー表示"/>
            <Tab label="テキスト表示"/>
            <Tab label="リクエスト"/>
            <Tab label="設定"/>
          </Tabs>
        </div>
      </div>
      
      <Divider/>
      <div>
        {node !== null && tabIndex === 0 &&
        <NodeViewer
          node={node}
          showViewSettings={showVS}
          closeViewSettings={() => setShowVS(false)}
          edit={edit}
        />}

        {node !== null && tabIndex === 1 &&
        <TextViewer
          node={node}
          itemNumber={node.label}
        />}
        {node !== null && tabIndex === 2 && <RequestList manual={manual}/>}
        {node !== null && tabIndex === 3 && <ManualSettings manual={manual}/>}
      </div>
    </div>
  );
}

function mapStateToProps(appState: AppState) {
  return appState.manuals;
}

export default connect(mapStateToProps)(withStyles(styles)(View));