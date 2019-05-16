import * as React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Tree } from '../../data-types/tree';
import { Task, Switch, Case, Delete } from '../../settings/layout';

export interface ExpansionTreeProps {
  node: Tree;
  depth: number;
  open: boolean;
}

interface Props extends ExpansionTreeProps {}

const paddingLeft = 16;

const ExpansionTree: React.FC<Props> = props => {

  const { node, depth, open } = props;
  const LinkEdit = (le: any) => <Link to={`/manual/${node.id}`} {...le}/>;

  return (
    <>
      <ListItem button component={LinkEdit} style={{paddingLeft: paddingLeft * (depth + 1)}}>
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
        />
      ))}
    </>
  );
};

export default ExpansionTree;