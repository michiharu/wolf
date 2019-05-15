import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from './redux/store';
import { MuiThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core';
import { pink, blue } from '@material-ui/core/colors';
import StateManager from './pages/state-manager';

export const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
  typography: {
    useNextVariants: true,
  },
});

const Providers: React.SFC<{}> = () => (
  <Provider store={Store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <StateManager/>
    </MuiThemeProvider>
  </Provider>
  
);

ReactDOM.render(<Providers/>, document.querySelector('#root'));