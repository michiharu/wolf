import React, {useState} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Category from '../../../data-types/category';
import { ExpansionActions } from './expansion-list-item-container';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Manual } from '../../../data-types/tree';
import links from '../../../settings/links';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

interface Props extends
  ExpansionActions,
  RouteComponentProps {
    filter: Category | null;
    category: Category;
    manuals: Manual[];
  }

function ExpansionListItemComponent(props: Props) {
  const { category: c, filter, manuals, filterSet, filterReset, location, history } = props;
  if (manuals === null) { throw new Error('Manual cannot be null.'); }
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const onClickCategory = () => {
    if (filter !== null && filter.id === c.id) {
      filterReset();
      setOpen(false);
    } else {
      filterSet(c);
      setOpen(true);
      if (location.pathname !== links.dashboard) {
        history.push(links.dashboard);
      }
    }
  }

  const onClickManual = (manual: Manual) => () => {
    if (location.pathname === `/manual/${manual.id}/tree`) {
      history.push(links.dashboard);
    } else {
      filterReset();
      history.push(`/manual/${manual.id}/tree`);
    }
  }

  return (
    <>
      <ListItem button onClick={onClickCategory} selected={filter !== null && c.id === filter.id}>
        <ListItemText primary={c.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {manuals.filter(m => m.categoryId === c.id).map(m => (
            <ListItem button className={classes.nested} key={m.id} onClick={onClickManual(m)} selected={location.pathname === `/manual/${m.id}/tree`}>
              <ListItemText primary={m.title} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default withRouter(ExpansionListItemComponent);