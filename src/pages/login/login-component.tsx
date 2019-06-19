import * as React from 'react';
import {useState} from 'react';
import { makeStyles, Theme, Paper, Avatar, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { InputAdornment, IconButton } from '@material-ui/core';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { LoginActions } from './login-container';

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  wrapper: {
    marginTop: theme.spacing(3),
    position: 'relative',
    width: '100%'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

interface Props extends LoginActions {
  loading: boolean;
}

const LoginComponent: React.FC<Props> = ({loading, login}) => {
  const [id, setId] = useState('1');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const handleChangeId = (e: any) => setId(e.target.value);
  const handleChangePassword = (e: any) => setPassword(e.target.value);
  const handleChangeShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    login({id, password});
  }

  const classes = useStyles();
  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Flow Like</Typography>

        <TextField
          className={classes.textField}
          label="ID"
          variant="outlined"
          value={id}
          onChange={handleChangeId}
          fullWidth
          margin="normal"
        />
        <TextField
          className={classes.textField}
          label="パスワード"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChangePassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={handleChangeShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        <div className={classes.wrapper}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            onClick={handleLogin}
            fullWidth
          >
            ログイン
          </Button>
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
        
      </Paper>
    </main>
  );
}

export default LoginComponent;
