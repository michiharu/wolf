import * as React from 'react';
import { useState } from 'react';

import {
  Theme,  TextField,
  Button, DialogTitle, DialogContent, DialogActions, makeStyles, Box, Tabs, Tab, Collapse, InputAdornment, IconButton,
} from '@material-ui/core';

import { ProfileActions } from './profile-container';
import { LoginUser } from '../../../data-types/user';
import { Action } from 'typescript-fsa';
import _ from 'lodash';
import axios from '../../../api/axios';
import { Password } from '../../../data-types/password';
import { passwordURL } from '../../../api/definitions';
import { MyNotification } from '../../../redux/states/notificationsState';
import { getKey } from '../../../redux/saga';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import Util from '../../../func/util';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  switch: {
    minWidth: 150,
    margin: theme.spacing(1),
    marginBottom: 0,
  }
}));

interface Props extends ProfileActions {
  user: LoginUser;
  update: (user: LoginUser) => Action<LoginUser>;
  enqueue: (notification: MyNotification) => Action<MyNotification>;
  onClose: () => void;
}

const ProfileComponent: React.FC<Props> = props => {

  const { user: next, update, enqueue, onClose } = props;
  const [user, setUser] = useState(next);

  const [isEditing, setIsEditing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  function handleTabChange(e: React.ChangeEvent<{}>, index: any) { setTabIndex(index) }
  const startEditing = () => setIsEditing(true);

  const [lastName, setLastName] = useState(user.lastName);
  const handleLastName = (e: any) => setLastName(e.target.value);
  const [firstName, setFirstName] = useState(user.firstName);
  const handleFirstName = (e: any) => setFirstName(e.target.value);
  const [mail, setMail] = useState(user.mail);
  const handleMail = (e: any) => setMail(e.target.value);

  const handleUpdate = () => {
    const newUser = {...user, lastName, firstName, mail};
    update(newUser);
    setIsEditing(false);
    setTabIndex(0);
  }

  if (!_.isEqual(user, next)) {
    setUser(next);
    setLastName(next.lastName);
    setFirstName(next.firstName);
    setMail(next.mail);
  }

  const [beforeFirstPasswordSubmit, setBeforeFirstPasswordSubmit] = useState(true);

  const [oldPassword, setOldPassword] = useState('');
  const handleOldPassword = (e: any) => setOldPassword(e.target.value);
  const [showOld, setShowOld] = useState(false);
  const handleShowOld = () => setShowOld(!showOld);
  const oldValidMsg = Util.validPassword(oldPassword);


  const [newPassword, setNewPassword] = useState('');
  const handleNewPassword = (e: any) => setNewPassword(e.target.value);
  const [showNew, setShowNew] = useState(false);
  const handleShowNew = () => setShowNew(!showNew);
  const newValidMsg = Util.validPassword(newPassword);

  const [confirmation, setConfirmation] = useState('');
  const handleConfirmation = (e: any) => setConfirmation(e.target.value);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleShowConfirmation = () => setShowConfirmation(!showConfirmation);

  const handlePasswordUpdate = () => {
    setBeforeFirstPasswordSubmit(false);
    if (oldValidMsg !== undefined || newValidMsg !== undefined) { return; }

    const password: Password = {now: oldPassword, next: newPassword};
    axios
    .put<Password>(`${passwordURL}/${user.id}`, password)
    .then(res => {
      const notification: MyNotification =
        { key: getKey(), variant: 'success', message: 'パスワードを更新しました' };
      enqueue(notification);

      setOldPassword('');
      setNewPassword('');
      setConfirmation('');
      setIsEditing(false);
      setTabIndex(0);
      return res;
    })
    .catch(error => {
      const notification: MyNotification =
        { key: getKey(), variant: 'error', message: 'パスワード更新に失敗しました' };
      enqueue(notification);
      return ({ error });
    })
  }

  const cancel = () => {
    setLastName(user.lastName);
    setFirstName(user.firstName);
    setMail(user.mail);
    setOldPassword('');
    setNewPassword('');
    setConfirmation('');

    setIsEditing(false);
    setTabIndex(0);
  }

  const mailRegex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  const mailValidation = mailRegex.test(mail);
  const renderBase = (
    <div>
      <Box pb={2} display="flex" flexDirection="row">
        <Box flexGrow={1} pr={1}>
          <TextField
            label="姓"
            value={lastName}
            onChange={handleLastName}
            error={lastName === ''}
            helperText={lastName === '' ? "姓は必須です" : undefined}
            fullWidth
            disabled={!isEditing}
          />
        </Box>
        <Box flexGrow={1} pl={1}>
          <TextField
            label="名"
            value={firstName}
            onChange={handleFirstName}
            error={firstName === ''}
            helperText={firstName === '' ? '名は必須です' : undefined}
            fullWidth
            disabled={!isEditing}
          />
        </Box>
      </Box>
      <TextField
        label="メールアドレス"
        value={mail}
        onChange={handleMail}
        error={!mailValidation}
        helperText={mail === '' ? "メールアドレスは必須です" : !mailValidation ? "不正なメールアドレスです" : undefined}
        fullWidth
        disabled={!isEditing}
      />
    </div>
  );

  const renderPassword = (
    <div>
      <Box pb={2}>
        <TextField
          label="古いパスワード"
          type={showOld ? 'text' : 'password'}
          value={oldPassword}
          onChange={handleOldPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowOld}>
                  {showOld ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!beforeFirstPasswordSubmit && oldValidMsg !== undefined}
          helperText={!beforeFirstPasswordSubmit ? oldValidMsg : undefined}
          fullWidth
        />
      </Box>
      <Box pb={2}>
        <TextField
          label="新しいパスワード"
          type={showNew ? 'text' : 'password'}
          value={newPassword}
          onChange={handleNewPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowNew}>
                  {showNew ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!beforeFirstPasswordSubmit && newValidMsg !== undefined}
          helperText={!beforeFirstPasswordSubmit ? newValidMsg : undefined}
          fullWidth
        />
      </Box>
      <TextField
        label="新しいパスワードの確認"
        type={showConfirmation ? 'text' : 'password'}
        value={confirmation}
        onChange={handleConfirmation}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleShowConfirmation}>
                {showConfirmation ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={newPassword !== confirmation}
        helperText={newPassword !== confirmation ? "新しいパスワードと一致していません" : undefined}
        fullWidth
      />
    </div>
  );

  const isValid = lastName !== '' && firstName !== '' && mailValidation;

  const classes = useStyles();
  return (
    <>
      <DialogTitle className={classes.root}>プロフィール</DialogTitle>
      <DialogContent>

        <Collapse in={isEditing}>
          <Box mt={-2} mb={2}>
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="基本情報" />
              <Tab label="パスワード" />
            </Tabs>
          </Box>
        </Collapse>
        <Box height={260}>
          {(!isEditing || tabIndex === 0) && renderBase}
          {tabIndex === 1 && renderPassword}
        </Box>

      </DialogContent>
      <DialogActions>
        {!isEditing && <Button onClick={onClose}>閉じる</Button>}
        {isEditing && <Button onClick={cancel}>キャンセル</Button>}
        {!isEditing && <Button onClick={startEditing} color="primary">編集</Button>}
        {isEditing && tabIndex === 0 &&
        <Button onClick={handleUpdate} color="primary" disabled={!isValid}>基本情報の更新</Button>}
        {isEditing && tabIndex === 1 &&
        <Button
          color="primary"
          onClick={handlePasswordUpdate}
          disabled={
            newPassword !== confirmation ||
            (!beforeFirstPasswordSubmit && (oldValidMsg !== undefined || newValidMsg !== undefined))
          }
        >
          パスワードの更新
        </Button>}
      </DialogActions>
    </>
  );
};

export default ProfileComponent;