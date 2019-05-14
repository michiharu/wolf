import * as React from 'react';
import { useState } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Paper, TextField, FormControlLabel, Switch,
  List, ListItem, ListItemIcon, ListItemText, ListSubheader,
} from '@material-ui/core';


import { Tree } from '../../data-types/tree-node';

import { Task } from '../../settings/layout';
import TreeUtil from '../../func/tree';
import { RouteComponentProps } from 'react-router-dom';
import ExpansionTree from '../../components/expansion-tree/expansion-tree';

const styles = (theme: Theme) => createStyles({
  switch: {
    minWidth: 150
  }
});

export interface ManualListProps extends RouteComponentProps {
  treeNodes: Tree[];
}

interface Props extends ManualListProps, WithStyles<typeof styles> {}

const ManualList: React.FC<Props> = (props: Props) => {

  const { treeNodes, classes } = props;
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const changeLabel = (e: any) => setSearchText(e.target.value);
  const handleOpen = (e: any) => setOpen(e.target.checked);
  const select = (node: Tree) => { props.history.push(`/manual/${node.id}`); }
  const words = TreeUtil.splitSearchWords(searchText);
  const filteredNode = TreeUtil._searchAndFilter(words, treeNodes);
  return (
    <Paper>
      <List dense subheader={<ListSubheader>マニュアル一覧</ListSubheader>}>
        <ListItem>
          <TextField
            label="マニュアルの検索.."
            value={searchText}
            onChange={changeLabel}
            fullWidth
          />
          <FormControlLabel
            className={classes.switch}
            control={
              <Switch
                checked={open}
                onChange={handleOpen}
                color="primary"
              />
            }
            label="すべてを展開"
          />
        </ListItem>
        {filteredNode.map(n => 
        <ExpansionTree key={n.id} node={n} open={open} depth={0} select={select}/>)}
      </List>
    </Paper>
  );
};

export default withStyles(styles)(ManualList);