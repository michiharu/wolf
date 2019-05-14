import * as React from 'react';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { Paper, Avatar, Typography, TextField, Button } from '@material-ui/core';
import { InputAdornment, IconButton } from '@material-ui/core';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import axios from '../../api/axios';
import { loginURL } from '../../api/definitions';
import { RootState } from '../state-manager';

const styles = (theme: Theme) =>
  createStyles({
    main: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.secondary.main,
    },
    textField: {
      marginTop: theme.spacing.unit * 2,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
  });

interface Props extends WithStyles<typeof styles> {
  login: (rootState: RootState) => void;
}

interface State {
  id: string;
  password: string;
  showPassword: boolean;
}

const Login = withStyles(styles)(class extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      id: '1',
      password: '1',
      showPassword: false,
    };
  }

  handleLogin = () => {
    const { id, password } = this.state;
    axios.post(loginURL, {id, password})
    .then(res => {
      const rootState = res.data;
      this.props.login(rootState);
    });    
  }

  render() {
    const { classes } = this.props;
    const { id, password, showPassword } = this.state;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">FlowLike Admin</Typography>

            <TextField
              className={classes.textField}
              label="ID"
              variant="outlined"
              value={id}
              onChange={e => this.setState({id : e.target.value})}
              fullWidth
              margin="normal"
            />
            <TextField
              className={classes.textField}
              label="パスワード"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => this.setState({password: e.target.value})}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => this.setState({showPassword: !showPassword})}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.submit}
            onClick={this.handleLogin}
            fullWidth
          >
            ログイン
          </Button>
        </Paper>
      </main>
    );
  }
});

export default Login;
