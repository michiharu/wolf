import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

interface Props {
  label: string;
  children: React.ReactElement<any>;
}

const FlowItem: React.SFC<Props> = (props: Props) => {
  const { label, children } = props;
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
        {children}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={label}/>
      <ListItemSecondaryAction>
        <IconButton aria-label="Add">
          <AddIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default FlowItem;