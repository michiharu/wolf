import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useState, useRef } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Paper, Grid, TextField,
  Table, TableHead, TableBody, TableRow, TableCell, IconButton,
  FormControl, InputLabel, Select, MenuItem,
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
    padding: theme.spacing.unit * 2,
    width: theme.breakpoints.width('lg'),

    [theme.breakpoints.down('md')]: {
      width: '100%',
    },

  },
  searchContainer: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  tableToolsContainer: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
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

  const selectNode = (node: TreeNode | null) => {
    history.push(link.edit);
    select(node);
  }
  
  return (
    <div className={classes.root}>

      <Grid container className={classes.searchContainer} justify="space-between">
        <Grid item xs={12} sm={8}>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Search field"
                type="search"
                onChange={e => setSearchText(e.target.value)}
                margin="none"
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justify="flex-end" alignItems="flex-end" spacing={16}>
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Age</InputLabel>
                <Select
                  value={values.age}
                  onChange={handleChange}
                  inputProps={{
                    name: 'age',
                    id: 'age-simple',
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Paper>
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
        <Table>
          <TableBody>
            {treeNodes.map((e, i) => <Tree key={`tree-0-${i}`} node={e} depth={0} selectNode={selectNode}/>)}
          </TableBody>
        </Table>
      </Paper>
    </div>  
  );
};

export default withStyles(styles)(Dashboard);