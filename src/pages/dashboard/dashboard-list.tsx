import * as React from 'react';
import { useState } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Paper, Grid, TextField,
  Table, TableHead, TableBody, TableRow, TableCell, IconButton,
  Divider,
  Typography,
} from '@material-ui/core';

import FileUpload from '@material-ui/icons/NoteAdd';

import { TreeWithoutId, Tree } from '../../data-types/tree-node';

import TreeUtil from '../../func/tree';
import ExpansionTree, { ExpansionTreeProps } from '../../components/expansion-tree/expansion-tree';
import Util from '../../func/util';

const styles = (theme: Theme) => createStyles({
  root: {
    marginBottom: theme.spacing.unit * 2,
  },
  headerTitle: {
    paddingLeft: theme.spacing.unit * 8,
  },
  label: {
    padding: theme.spacing.unit,
  },
  tableToolsContainer: {
    padding: theme.spacing.unit,
  },
  addArea: {
    width: '100%',
  },
  textField: {
    minWidth: 240,
  },
  addButtonCell: {
    textAlign: 'right',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    }
  },
});

export interface DashboardListProps {
  label?: string;
  nodes: Tree[];
  openAll: boolean;
  selectNode: (node: Tree | null) => void;
  addNode: (node: Tree) => void;
  deleteNode: (node: Tree) => void;
}

interface Props extends DashboardListProps, WithStyles<typeof styles> {}

const DashboardList: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;

  const { label, nodes, openAll, selectNode, addNode, deleteNode, classes } = props;
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (!Util.isEmpty(newLabel)) {
      const newNode = TreeUtil.getNewNode('task');
      addNode({...newNode, label: newLabel});
    }
    setNewLabel('');
  }

  const handleFileRead = () => {
    const content = fileReader.result as string;
    const nodeWithoutId: TreeWithoutId = JSON.parse(content);
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

  const handleChange = (e: any) => {
    if (e.keyCode === 13) {
      handleAdd();
    }
  }
  
  return (
    <Paper>
      <Grid container className={classes.tableToolsContainer} justify="space-between">
        <Grid item xs={12} md={6}>
          <Typography className={classes.label} variant="h5">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={16} justify="space-between">
            <Grid item xs>
              <TextField
                className={classes.textField}
                label="新しいマニュアル(Enterで追加)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item>
              <IconButton component="label">
                <FileUpload/>
                <form>
                  <input type="file" style={{ display: 'none' }} accept=".json" onChange={handleFileChosen}/>
                </form>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {nodes.length !== 0 && <Divider/>}
      <Table>
        {nodes.length !== 0 &&
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="caption" className={classes.headerTitle}>タイトル</Typography></TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>}
        
        <TableBody>
          {nodes.map((node, i) => {
            const treeProps: ExpansionTreeProps = { node, depth: 0, openAll, selectNode, deleteNode };
            return <ExpansionTree key={`tree-0-${i}`} {...treeProps}/>;
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withStyles(styles)(DashboardList);