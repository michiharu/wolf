import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useState } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Paper, Grid, TextField,
  Table, TableHead, TableBody, TableRow, TableCell, IconButton,
  Divider,
  Typography,
} from '@material-ui/core';

import FileUpload from '@material-ui/icons/NoteAdd';
import Add from '@material-ui/icons/Add';

import { TreeNode, NodeWithoutId } from '../../data-types/tree-node';

import TreeUtil from '../../func/tree';
import ExpansionTree, { ExpansionTreeProps } from '../../components/expansion-tree/expansion-tree';
import link from '../../settings/path-list';
import Util from '../../func/util';

const styles = (theme: Theme) => createStyles({
  root: {
    marginBottom: theme.spacing.unit * 2,
  },
  label: {
    padding: theme.spacing.unit,
  },
  tableToolsContainer: {
    padding: theme.spacing.unit,
  },
  textFieldGrid: {
    paddingLeft: theme.spacing.unit,
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
  nodes: TreeNode[];
  openDepth: string;
  selectNode: (node: TreeNode | null) => void;
  addNode: (node: TreeNode) => void;
}

interface Props extends DashboardListProps, WithStyles<typeof styles> {}

const DashboardList: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;

  const { label, nodes, openDepth, selectNode, addNode, classes } = props;
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (!Util.isEmpty(newLabel)) { addNode(TreeUtil.getNewNode(newLabel)); }
    setNewLabel('');
  }

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
  
  return (
    <Paper>
      <Typography className={classes.label} variant="h5">{label}</Typography>
      <Grid container className={classes.tableToolsContainer} justify="space-between">
        <Grid item xs={12} sm={8}>
          <Grid container spacing={16}>
            <Grid item xs={9}>
              <TextField
                label="新しいマニュアル"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                // margin="none"
                fullWidth
              />
            </Grid>
            <Grid item>
              <IconButton onClick={handleAdd}><Add/></IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justify="flex-end" alignItems="flex-end" spacing={16}>
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
        <TableBody>
          {nodes.map((node, i) => {
            const treeProps: ExpansionTreeProps = { node, depth: 0, openDepth, selectNode };
            return <ExpansionTree key={`tree-0-${i}`} {...treeProps}/>;
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withStyles(styles)(DashboardList);