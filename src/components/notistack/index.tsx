import React from 'react';
import { OptionsObject } from 'notistack';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';


const closeSnackbarButton: (closeSnackbar: (key: OptionsObject['key']) => void) => (
  key: OptionsObject['key']
) => React.ReactNode = closeSnackbar => key => {
  return (
    <IconButton key={key} color="inherit" onClick={() => closeSnackbar(key)}>
      <Close style={{fontSize: 20}} />
    </IconButton>
  );
}

export default closeSnackbarButton;