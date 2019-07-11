import React from 'react';
import { Box, CircularProgress, makeStyles, Theme } from '@material-ui/core';
import { drawerWidth } from '../pages/layout/layout-component';

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    height: '50vh',
    width: `calc(100vw - ${drawerWidth}px)`,
    [theme.breakpoints.down('md')]: {
      width: '100vw',
    },
  },
  boxWithoutDrawer: {
    height: '50vh',
    width: '100vw',
  },
}));

interface Props {
  hasDrawer: boolean;
}

const NowLoading: React.FC<Props> = ({hasDrawer}) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-end"
      className={hasDrawer ? classes.box : classes.boxWithoutDrawer}
    >
      <Box>
        <CircularProgress size={60} color="primary" />
      </Box>
    </Box>
  );
}
export default NowLoading;