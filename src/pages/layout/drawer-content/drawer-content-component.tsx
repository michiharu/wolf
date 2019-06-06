import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CategoriesState } from '../../../redux/states/categoriesState';
import { ManualsState } from '../../../redux/states/manualsState';
import ExpansionListItemContainer from './expansion-list-item-container';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
}));

interface Props extends
  CategoriesState,
  ManualsState {}

function DrawerContentComponent(props: Props) {
  const { categories, manuals } = props;
  if (manuals === null) { throw new Error('Manual cannot be null.'); }
  const classes = useStyles();

  return (
    <div>
      <div className={classes.toolbar}/>
      <Divider />
      <List component="nav">
        {categories.map(c => (
        <ExpansionListItemContainer
          key={c.id}
          category={c}
          manuals={manuals.filter(m => m.categoryId === c.id)}
        />))}
      </List>
    </div>
  );
}

export default DrawerContentComponent;