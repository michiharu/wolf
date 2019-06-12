import React, { useState } from 'react';
import { Typography, Button, Grid, TextField, Box, Snackbar, IconButton } from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { DeleteActions } from './delete-container';
import { Close } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import links from '../../../../settings/links';


interface Props extends DeleteActions, RouteComponentProps {
  manual: Manual;
}

const DeleteComponent: React.FC<Props> = props => {
  const { manual, manualDelete, history } = props;
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
      <Box p={2}>
        <Typography variant="h5">マニュアルを削除する</Typography>    
      </Box>
      <Box p={2}>
        <Grid container alignItems="flex-end" spacing={3}>
          <Grid item xs={6}>
            <TextField
              placeholder="確認のためタイトルを入力"
              value={title}
              onChange={handleChangeTitle}
              error={manual.title !== title}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleClick}>削除する</Button>
          </Grid>
        </Grid>
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