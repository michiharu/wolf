import React, { useState } from 'react';
import { Typography, Button, Grid, TextField, Box, Snackbar, IconButton } from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { CopyActions } from './copy-container';
import Util from '../../../../func/util';
import { Close } from '@material-ui/icons';

interface Props extends CopyActions {
  select: Manual;
}

const Copy: React.FC<Props> = props => {
  const [newTitle, setNewTitle] = useState('');
  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTitle(e.target.value);
  }
  const [copied, setCopied] = useState(false);
  function handleClick() {
    const { select, manualUpdate } = props;
    manualUpdate({...select, id: Util.getID(), title: newTitle});
    setNewTitle('');
    setCopied(true);
  }
  function onClose() {
    setCopied(false);
  }

  return (
    <div>
      <Box p={2}>
        <Typography variant="h5">マニュアルを複製する</Typography>    
      </Box>
      <Box p={2}>
        <Grid container alignItems="flex-end" spacing={3}>
          <Grid item xs={6}>
            <TextField
              placeholder="複製後のマニュアルタイトルを入力"
              value={newTitle}
              onChange={handleChangeTitle}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleClick}>複製する</Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={copied}
        autoHideDuration={3000}
        onClose={onClose}
        message={<span>保存しました</span>}
        action={[
          <IconButton key="close" color="inherit" onClick={onClose}>
            <Box><Close/></Box>
          </IconButton>
        ]}
      />
    </div>
  );
}
export default Copy;