import React, { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CategoriesState } from '../../../redux/states/login-data/categoriesState';
import { ManualsState } from '../../../redux/states/login-data/manualsState';
import ExpansionListItemContainer from './expansion-list-item-container';
import { Fab, Box, Dialog } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import links from '../../../settings/links';
import CreateManualContainer from '../create-manual/create-manual-container';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  extendedIcon: {
    marginLeft: theme.spacing(1),
  },
}));

interface Props extends
  CategoriesState,
  ManualsState,
  RouteComponentProps {}

function DrawerContentComponent(props: Props) {
  const { categories, manuals, location, history } = props;
  if (manuals === null) { throw new Error('Manual cannot be null.'); }

  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
    if (location.pathname !== links.dashboard) {
      history.push(links.dashboard);
    }
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
          manuals={manuals.filter(m => m.categoryId === c.id)}
        />))}
      </List>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <CreateManualContainer onClose={handleClose}/>
      </Dialog>
    </div>
  );
}

export default withRouter(DrawerContentComponent);