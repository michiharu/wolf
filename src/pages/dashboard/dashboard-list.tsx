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