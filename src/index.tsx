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

export const toolbarHeight = 42;
export const theme = createMuiTheme({
  mixins: {
    toolbar: {
        minHeight: toolbarHeight,
    }
  },
  palette: {
    primary: blue,
    secondary: pink,
  },
  typography: {
    // fontSize: 12,
    button: {
        textTransform: "none"
    }
  },
  props: {
    MuiCheckbox: {
        color: "primary"
    },
    MuiList: {
        dense: true
    },
    MuiRadio: {
        color: "primary"
    },
    MuiSwitch: {
        color: "primary"
    },
    MuiTextField: {
        variant: "outlined"
        // InputProps: {
        //     style: {
        //         height: 38
        //     }
        // }
    }
  },
});

const Providers: React.FC<{}> = () => (
  <Provider store={Store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <SnackbarProvider maxSnack={3} autoHideDuration={4000}>
        <Notifier/>
        <LoginRouter/>
      </SnackbarProvider>
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(<Providers/>, document.querySelector('#root'));