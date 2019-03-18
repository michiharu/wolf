import * as React from 'react';
import { useState, useRef } from 'react';
import { Theme, createStyles, WithStyles, withStyles, Divider, Avatar, Grid, Typography, Hidden, Button } from '@material-ui/core';
import { TextField, Paper } from '@material-ui/core';

import FileUpload from '@material-ui/icons/NoteAdd';

import { TreeNode, TreeNodeWithParents, NodeWithoutId } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight, Task, Switch, Input, Output } from '../../../settings/layout';

import TreeUtil from '../../../func/tree';
import Util from '../../../func/util';
import WithIcon from '../../../components/with-icon/with-icon';
import KNodeUtil from '../../../func/k-node';

const styles = (theme: Theme) => createStyles({
  root: {
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${toolbarMinHeight}px)`,
    },
    
  },
  searchContainer: {
    padding: theme.spacing.unit * 2,
    maxWidth: 800, 
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  card: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    maxWidth: 800, 
  },
  header: {marginBottom: theme.spacing.unit},
  label: {
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  xput: {
    padding: theme.spacing.unit * 2,
  },
  vDivider: {
    height: '100%',
    borderRight: 'solid 1px #cccc',
  },
  children: {
    padding: theme.spacing.unit * 2,
    // [theme.breakpoints.down('xs')]: {
    //   borderTop: 'solid 1px #cccc',
    // },
  }
});

export interface NodeListProps {
  treeNodes: TreeNode[];
  selectNode: (node: TreeNode | null) => void;
  addNode: (node: TreeNode) => void;
}

interface Props extends NodeListProps, WithStyles<typeof styles> {}

const NodeList: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;
  const formEl = useRef<HTMLFormElement>(null);

  const { treeNodes, selectNode, addNode, classes } = props;
  const [searchText, setSearchText] = useState('');
  const nodeArray = TreeUtil.toArrayWithParents([], treeNodes);
  const filteredNodes = TreeUtil.search(searchText, nodeArray);

  const handleFileRead = () => {
    // console.log('Read');
    const content = fileReader.result as string;
    const nodeWithoutId: NodeWithoutId = JSON.parse(content);
    addNode(KNodeUtil._setId(nodeWithoutId));
    // fileReader.abort();
    fileReader = new FileReader();
    
  }

  const handleFileChosen = (e: any) => {
    // console.log('Chosen');
    const file = e.target.files[0];
    fileReader = new FileReader();
    fileReader.onload = handleFileRead;
    // fileReader.onloadend = () => fileReader.abort();
    fileReader.readAsText(file);

  } 
  
  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <Grid container alignItems="flex-end" spacing={16}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search field"
              type="search"
              onChange={e => setSearchText(e.target.value)}
              margin="none"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button component="label" color="primary">
              {'ファイルからインポート'}
              <FileUpload className={classes.rightIcon} />
              <form ref={formEl}>
                <input type="file" style={{ display: 'none' }} accept=".json" onChange={handleFileChosen}/>
              </form>
            </Button>
          </Grid>
        </Grid>
        
      </div>
      <Divider/>
      {filteredNodes.map(n => {
        const hasInfo = !Util.isEmpty(n.input) || !Util.isEmpty(n.output);
        const hasChildren = n.children.length !== 0;
        return ( 
          <Paper key={n.id} className={classes.card} elevation={1}>
            <Grid container className={(hasInfo || hasChildren) ? classes.header : undefined} spacing={16}>
              <Grid item><Avatar>{n.type === 'task' ? <Task/> : <Switch/>}</Avatar></Grid>
              <Grid item xs>
                <Typography color="textSecondary">
                  {n.parents.length !== 0 && n.parents.map(p => p.label).reduce((a, b) => `${a} ＞ ${b}`)}
                </Typography>
                <Typography variant="h5" className={classes.label} onClick={() => selectNode(n)}>
                  {n.label}
                  </Typography>
              </Grid>
            </Grid>

            {(hasInfo || hasChildren) && <>
              <Divider/>
              <Grid container>

                {hasInfo && (
                <Grid item xs={12} sm={5}>
                  <div className={classes.xput}>
                    {!Util.isEmpty(n.input) && <WithIcon icon={<Input/>} gutter>{n.input}</WithIcon>}
                    {!Util.isEmpty(n.output) && <WithIcon icon={<Output/>} right gutter>{n.output}</WithIcon>}
                  </div>
                </Grid>)}
                
                <Hidden xsDown>
                  {hasInfo && hasChildren && <Grid item><div className={classes.vDivider}/></Grid>}
                </Hidden>
                
                {hasChildren && (
                <Grid item xs>
                  <div className={classes.children}>
                    {n.children.length > 0 && <Typography variant="body2">・{n.children[0].label}</Typography>}
                    {n.children.length > 1 && <Typography variant="body2">・{n.children[1].label}</Typography>}
                    {n.children.length > 2 && <Typography variant="body2">・{n.children[2].label}</Typography>}
                  </div>
                </Grid>)}
                
              </Grid>
            </>}
          </Paper>
        );
      })}
    </div>  
  );
};

export default withStyles(styles)(NodeList);