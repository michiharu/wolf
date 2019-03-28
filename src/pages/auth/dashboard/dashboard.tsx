import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useState, useRef } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Divider, Grid, Button, TextField,
  Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper,
} from '@material-ui/core';

import FileUpload from '@material-ui/icons/NoteAdd';
import Add from '@material-ui/icons/Add';

import { TreeNode, NodeWithoutId } from '../../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight } from '../../../settings/layout';

import TreeUtil from '../../../func/tree';
import Tree from '../../../components/expansion-tree/expansion-tree';
import link from '../../../settings/path-list';
import Util from '../../../func/util';

const styles = (theme: Theme) => createStyles({
  root: {
    margin: 'auto',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    width: theme.breakpoints.width('lg'),
    height: `calc(100vh - ${toolbarHeight}px)`,

    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    
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
  tableToolsContainer: {
    width: '100%',
  },
  createFormCell: {
    paddingLeft: theme.spacing.unit * 2,
  },
  addButtonCell: {
    textAlign: 'right',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.paper,
    }
  },
});

export interface NodeListProps {
  treeNodes: TreeNode[];
  selectNode: (node: TreeNode | null) => void;
  addNode: (node: TreeNode) => void;
}

interface Props extends NodeListProps, WithStyles<typeof styles>, RouteComponentProps {}

const Dashboard: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;

  const { treeNodes, selectNode: select, addNode, history, classes } = props;
  const [searchText, setSearchText] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => !Util.isEmpty(newLabel) && addNode(TreeUtil.getNewNode(newLabel));

  const handleFileRead = () => {
    const content = fileReader.result as string;
    const nodeWithoutId: NodeWithoutId = JSON.parse(content);
    addNode(TreeUtil._setId(nodeWithoutId));
  }

  const handleFileChosen = (e: any) => {
    const file = e.target.files[0];
    if (file === undefined) { return; }
    fileReader = new FileReader();
    fileReader.onload = handleFileRead;
    fileReader.readAsText(file);
    e.target.value = '';
  }

  const selectNode = (node: TreeNode | null) => {
    history.push(link.edit);
    select(node);
  }
  
  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <TextField
          label="Search field"
          type="search"
          onChange={e => setSearchText(e.target.value)}
          margin="none"
          fullWidth
        />
      </div>

      <Paper>
        <Grid container className={classes.tableToolsContainer} justify="flex-end" alignItems="flex-end" spacing={16}>
          <Grid item>
            <Button component="label" color="primary">
              {'ファイルからインポート'}
              <FileUpload className={classes.rightIcon} />
              <form>
                <input type="file" style={{ display: 'none' }} accept=".json" onChange={handleFileChosen}/>
              </form>
            </Button>
          </Grid>
        </Grid>
        <Table>
          <TableBody>
            <TableRow className={classes.row}>
              <TableCell className={classes.createFormCell}>
                <TextField
                  variant="outlined"
                  label="新しいマニュアル"
                  onChange={e => setNewLabel(e.target.value)}
                  fullWidth/>
              </TableCell>
              <TableCell className={classes.addButtonCell}>
                <IconButton onClick={handleAdd}><Add/></IconButton>
              </TableCell>
            </TableRow>
            {treeNodes.map((e, i) => <Tree key={`tree-0-${i}`} node={e} depth={0} selectNode={selectNode}/>)}
          </TableBody>
        </Table>
      </Paper>
    </div>  
  );
};

export default withStyles(styles)(Dashboard);