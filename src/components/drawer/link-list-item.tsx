import * as React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

interface Props {
  path: string;
  to: string;
  clicked: (to: string) => void;
  label: string;
}

const LinkListItem: React.SFC<Props> = ({path, to, clicked, label}) => (
  <ListItem button onClick={() => clicked(to)}>
    <ListItemText primary={label} primaryTypographyProps={{color: path === to ? 'primary' : 'default'}}/>
  </ListItem>
);

export default LinkListItem;