import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Tree, isTask, isSwitch } from '../../data-types/tree';
import { Task, Switch, Case } from '../../settings/layout';
import AdapterLink from '../custom-mui/adapter-link';

export interface ExpansionTreeProps {
  node: Tree;
  depth: number;
  open: boolean;
}

interface Props extends ExpansionTreeProps {}

const paddingLeft = 16;

const ExpansionTree: React.FC<Props> = props => {

  const { node, depth, open } = props;

  return (
    <>
      <ListItem
        button
        to={`/manual/${node.id}`}
        component={AdapterLink}
        style={{paddingLeft: paddingLeft * (depth + 1)}}
      >
        <ListItemIcon>
          {isTask(node.type) ? <Task/> :
          isSwitch(node.type) ? <Switch style={{transform: 'scale(1, -1)'}}/> : <Case/>}
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