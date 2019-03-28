import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core';
import { pink, blue } from '@material-ui/core/colors';
import DataManager from './pages/data-manager';
import * as serviceWorker from './serviceWorker';

export const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
  typography: {
    useNextVariants: true,
  },
});

const ThemeProvider: React.SFC<{}> = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <DataManager/>
  </MuiThemeProvider>
);

ReactDOM.render(<ThemeProvider/>, document.querySelector('#root'));
serviceWorker.register({});