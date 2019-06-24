import React, { useState } from 'react';
import { Typography, Button, TextField, Box, Snackbar, IconButton } from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { DeleteActions } from './delete-container';
import { Close } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import links from '../../../../settings/links';
import User from '../../../../data-types/user';


interface Props extends DeleteActions, RouteComponentProps {
  user: User;
  manual: Manual;
}

const DeleteComponent: React.FC<Props> = props => {
  const { user, manual, manualDelete, history } = props;
  const isOwner = manual.ownerId === user.id;

  const [title, setTitle] = useState('');
  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  const [miss, setMiss] = useState(false);
  function handleClick() {
    if (manual.title === title) {
      manualDelete(manual);
      history.push(links.dashboard);
    } else {
      setMiss(true);
    }
  }
  function onClose() {
    setMiss(false);
  }

  return (
    <div>
      <Box py={2}><Typography variant="h5">マニュアルを削除する</Typography></Box>
      <Box display="flex" flexDirection="row" alignItems="flex-end" py={2}>
        <Box flexGrow={1}>
          <TextField
            label="確認のためタイトルを入力"
            value={title}
            onChange={handleChangeTitle}
            error={manual.title !== title && isOwner}
            fullWidth
            disabled={!isOwner}
          />
        </Box>
        <Box ml={2}>
          <Button variant="contained" color="primary" onClick={handleClick} disabled={!isOwner}>削除する</Button>
        </Box>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={miss}
        autoHideDuration={3000}
        onClose={onClose}
        message={<span>タイトルが一致しません</span>}
        action={[
          <IconButton key="close" color="inherit" onClick={onClose}>
            <Box><Close/></Box>
          </IconButton>
        ]}
      />
    </div>
  );
}
export default　withRouter(DeleteComponent);