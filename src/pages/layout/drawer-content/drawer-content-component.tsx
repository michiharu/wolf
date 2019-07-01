import React, { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CategoriesState } from '../../../redux/states/main/categoriesState';
import ExpansionListItemContainer from './expansion-list-item-container';
import { Fab, Box, Dialog } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import CreateManualContainer from '../create-manual/create-manual-container';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  extendedIcon: {
    marginLeft: theme.spacing(1),
  },
}));

interface Props extends
  CategoriesState {}

function DrawerContentComponent(props: Props) {
  const { categories } = props;

  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  const classes = useStyles();
  return (
    <div>
      <div className={classes.toolbar}/>
      <Divider />
        <Box m={2}>
          <Fab variant="extended" size="large" color="primary" onClick={handleOpen}>
            新規作成
            <Add className={classes.extendedIcon} />
          </Fab>
        </Box>
      <List component="nav">
        {categories.map(c => (
        <ExpansionListItemContainer
          key={c.id}
          category={c}
        />))}
      </List>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <CreateManualContainer onClose={handleClose}/>
      </Dialog>
    </div>
  );
}

export default DrawerContentComponent;