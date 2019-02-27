import * as React from 'react';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { TextField, Button } from '@material-ui/core';
import { DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { InputAdornment, IconButton } from '@material-ui/core';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import axios from '../../settings/axios';
import User from '../../data-types/user';
import { loginURL, LoginPostRequest } from '../../data-types/api';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 800,
      margin: 'auto',
    },
    button: {
      marginBottom: theme.spacing.unit * 2,
      margin: 'auto'
    }
  });

interface Props extends WithStyles<typeof styles> {
  login: (user: User) => void;
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
      id: 'user1@sfsolutions.jp',
      password: 'password1',
      showPassword: false,
    };
  }

  handleChangeId       = (e: any) => this.setState({ id      : e.target.value });
  handleChangePassword = (e: any) => this.setState({ password: e.target.value });

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleLogin = () => {
    const { id, password } = this.state;
    const data: LoginPostRequest = {id, password};
    axios.post(loginURL, data)
    .then(res => {
      const user = {...res.data.user};
      this.props.login(user);
    });    
  }

  render() {
    const { classes } = this.props;
    const { id, password, showPassword } = this.state;

    return (
      <div className={classes.root}>
        <DialogTitle>いまココにログイン</DialogTitle>
        <DialogContent>
          <DialogContentText>
            いまココは組織で働くみんなを幸せにする勤怠管理アプリです。いまココを使えば勤怠の記録・集計がとても簡単に！さあ、いまココを使い始めましょう！
          </DialogContentText>
          <TextField
            label="ID"
            variant="outlined"
            value={id}
            onChange={this.handleChangeId}
            fullWidth
            margin="normal"
          />
          <TextField
            label="パスワード"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            
            value={password}
            onChange={this.handleChangePassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            size="large"
            className={classes.button}
            onClick={this.handleLogin}
          >
            ログイン
          </Button>
        </DialogActions>
      </div>
    );
  }
});

export default Login;
