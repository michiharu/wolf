import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from './redux/store';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import { pink, blue } from '@material-ui/core/colors';
import LoginRouter from './pages/login-router';
import Notifier from './notifier';

export const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  }
});

const Providers: React.FC<{}> = () => (
  <Provider store={Store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <SnackbarProvider maxSnack={3} autoHideDuration={8000}>
        <Notifier/>
        <LoginRouter/>
      </SnackbarProvider>
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(<Providers/>, document.querySelector('#root'));