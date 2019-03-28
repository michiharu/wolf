import * as React from 'react';
import { useState, useRef } from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Divider, Grid, Button, TextField
} from '@material-ui/core';

import FileUpload from '@material-ui/icons/NoteAdd';

import { TreeNode, NodeWithoutId } from '../../data-types/tree-node';
import { toolbarHeight, toolbarMinHeight } from '../../settings/layout';

import TreeUtil from '../../func/tree';
import NodeCard, { NodeCardProps } from '../../components/node-card/node-card';

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
});

export interface NodeListProps {
  treeNodes: TreeNode[];
  selectNode: (node: TreeNode | null) => void;
}

interface Props extends NodeListProps, WithStyles<typeof styles> {}

const NodeList: React.FC<Props> = (props: Props) => {
  var fileReader: FileReader;
  const formEl = useRef<HTMLFormElement>(null);

  const { treeNodes, selectNode, classes } = props;
  const [searchText, setSearchText] = useState('');
  const nodeArray = TreeUtil.toArrayWithParents([], treeNodes);
  const filteredNodes = TreeUtil.search(searchText, nodeArray);
  
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
        </Grid>
        
      </div>
      <Divider/>
      {filteredNodes.map(n => {
        const cardProps: NodeCardProps = {node: n, selectNode};
        return <NodeCard key={n.id} {...cardProps}/>;
      })}
    </div>  
  );
};

export default withStyles(styles)(NodeList);