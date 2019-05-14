import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
  Tabs, Tab, Typography, Divider, Button,
} from '@material-ui/core';
import { Link, RouteComponentProps } from 'react-router-dom';
import links from '../../../settings/links';
import { Tree, baseTreeNode, TreeNode } from '../../../data-types/tree-node';
import TreeUtil from '../../../func/tree';
import NodeViewer from './node-viewer';
import TreeNodeUtil from '../../../func/tree-node';


const styles = (theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing.unit * 2,
  },
  header: {
    width: theme.breakpoints.width('md'),
    margin: 'auto',
  },
  body: {
    width: theme.breakpoints.width('md'),
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

interface Props extends WithStyles<typeof styles>, RouteComponentProps<{id: string}> {
  manuals: Tree[];
}

const View: React.FC<Props> = props => {
  const { manuals, match, classes } =  props;
  const [node, setNode] = useState<TreeNode | null>(null);

  const manual = TreeUtil._findArray(manuals, match.params.id)!;
  if (node === null) {
    const tree = TreeUtil._get(manual, baseTreeNode);
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
        <div style={{display: 'flex'}}>
          <Typography variant="h4">{manual.label}</Typography>
          <div style={{flexGrow: 1}} />
          <Button component={LinkEdit} variant="contained" color="primary" size="small" style={{height: 48}}>編集する</Button>
        </div>
        <div>
          <Tabs value={tabIndex} onChange={handleChangeTab}>
            <Tab label="ツリー表示"/>
            <Tab label="テキスト表示"/>
            <Tab label="リクエスト"/>
          </Tabs>
        </div>
      </div>
      
      <Divider/>
      <div>
        {node !== null &&
        <NodeViewer
          node={node}
          showViewSettings={showVS}
          closeViewSettings={() => setShowVS(false)}
          edit={edit}
        />}
      </div>
    </div>
  );
}

export default withStyles(styles)(View);