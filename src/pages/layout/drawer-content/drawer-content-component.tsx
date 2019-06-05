import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CategoriesState } from '../../../redux/states/categoriesState';
import { ManualsState } from '../../../redux/states/manualsState';
import Category from '../../../data-types/category';
import { DrawerActions } from './drawer-content-container';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Manual } from '../../../data-types/tree';
import links from '../../../settings/links';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

interface Props extends
  CategoriesState,
  ManualsState,
  DrawerActions,
  RouteComponentProps {}

function DrawerContentComponent(props: Props) {
  const { categories, filter, manuals, filterSet, filterReset, location, history } = props;
  if (manuals === null) { throw new Error('Manual cannot be null.'); }
  const classes = useStyles();

  const onClickCategory = (category: Category) => () => {
    if (filter !== null && filter.id === category.id) {
      filterReset();
    } else {
      filterSet(category);
      if (location.pathname !== links.dashboard) {
        history.push(links.dashboard);
      }
    }
  }

  const onClickManual = (manual: Manual) => () => {
    if (location.pathname === `/manual/${manual.id}`) {
      history.push(links.dashboard);
    } else {
      filterReset();
      history.push(`/manual/${manual.id}`);
    }
  }

  return (
    <div>
      <div className={classes.toolbar}/>
      <Divider />
      <List component="nav">
        {categories.map(c => <>
          <ListItem button key={c.id} onClick={onClickCategory(c)} selected={filter !== null && c.id === filter.id}>
            <ListItemText primary={c.name} />
          </ListItem>
          <List component="div" disablePadding>
            {manuals.filter(m => m.categoryId === c.id).map(m => (
              <ListItem button className={classes.nested} key={m.id} onClick={onClickManual(m)} selected={location.pathname === `/manual/${m.id}`}>
                <ListItemText primary={m.title} />
              </ListItem>
            ))}
          </List>
        </>)}
      </List>
    </div>
  );
}

export default withRouter(DrawerContentComponent);