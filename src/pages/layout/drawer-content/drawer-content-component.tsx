import React, { useState, useCallback, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import { FixedSizeList as List } from 'react-window';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CategoriesState } from '../../../redux/states/main/categoriesState';
import { Fab, Box, Dialog, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import CreateManualContainer from '../create-manual/create-manual-container';
import { ExpansionActions } from './drawer-content-container';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Category from '../../../data-types/category';
import links from '../../../settings/links';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  extendedIcon: {
    marginLeft: theme.spacing(1),
  },
  listContainer: {
    height: `calc(100vh - 138px)`,
  },
  selected: {
    backgroundColor: theme.palette.grey[200],
  },
  notSelected: {
    backgroundColor: theme.palette.background.paper,
  }
}));

interface Props extends CategoriesState, ExpansionActions, RouteComponentProps {}

function DrawerContentComponent(props: Props) {
  const { categories, filter, filterReset, filterSet, location, history } = props;

  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  const onClickCategory = (c: Category) => () => {
    if (filter !== null && filter.id === c.id) {
      filterReset();
    } else {
      filterSet(c);
      if (location.pathname !== links.dashboard) {
        history.push(links.dashboard);
      }
    }
  }

  const [height, setHeight] = useState(300);
  const [listContainerEl, setListContainerEl] = useState<HTMLDivElement | null>(null);
  const getListContainerRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      setListContainerEl(el);
      setHeight(el.offsetHeight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (listContainerEl !== null) {
        setHeight(listContainerEl.offsetHeight);
      }
    });
  }, [listContainerEl]);

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
      <div ref={getListContainerRef} className={classes.listContainer}>
        <List
          height={height}
          itemCount={categories.length}
          itemSize={50}
          width={300}
        >
          {({ index, style }) => (
            <div
              className={(filter !== null && filter.id === categories[index].id) ? classes.selected : classes.notSelected}
              style={style}
              onClick={onClickCategory(categories[index])}
            >
              <Box display="flex" alignItems="center" height="100%" pl={2}>
                <Typography>{categories[index].name}</Typography>
              </Box>
            </div>
          )}
        </List>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <CreateManualContainer onClose={handleClose}/>
      </Dialog>
    </div>
  );
}

export default withRouter(DrawerContentComponent);