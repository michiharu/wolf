import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, CssBaseline, createMuiTheme, Color } from '@material-ui/core';
import { pink, blue } from '@material-ui/core/colors';
import Authentication from './pages/authentication';

const theme = createMuiTheme({
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
    <Authentication/>
  </MuiThemeProvider>
);

ReactDOM.render(<ThemeProvider/>, document.querySelector('#root'));