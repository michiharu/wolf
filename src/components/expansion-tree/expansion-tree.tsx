import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText
} from '@material-ui/core';
import { Tree } from '../../data-types/tree-node';
import { Task, Switch, Case, Delete } from '../../settings/layout';

export interface ExpansionTreeProps {
  node: Tree;
  depth: number;
  open: boolean;
  select: (node: Tree) => void;
}

interface Props extends ExpansionTreeProps {}

const paddingLeft = 16;

const ExpansionTree: React.FC<Props> = props => {

  const { node, depth, open, select} = props;

  return (
    <>
      <ListItem button onClick={() => select(node)} style={{paddingLeft: paddingLeft * (depth + 1)}}>
        <ListItemIcon>
          {node.type === 'task' ? <Task/> :
            node.type === 'switch' ? <Switch style={{transform: 'scale(1, -1)'}}/> : <Case/>}
        </ListItemIcon>
        <ListItemText primary={node.label}/>
      </ListItem>
      {open && node.children.map((c, i) => (
        <ExpansionTree
          key={`tree-${depth}-${i}`}
          node={c}
          depth={depth + 1}
          open={open}
          select={select}
        />
      ))}
    </>
  );
};

export default ExpansionTree;