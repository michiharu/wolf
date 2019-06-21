import React, { useState } from 'react';
import { Typography, Button, TextField, Box } from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { CopyActions } from './copy-container';
import Util from '../../../../func/util';

interface Props extends CopyActions {
  manual: Manual;
}

const Copy: React.FC<Props> = props => {

  const [newTitle, setNewTitle] = useState('');
  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTitle(e.target.value);
  }

  function handleClick() {
    const { manual, copy } = props;
    copy({...manual, id: Util.getID(), title: newTitle});
    setNewTitle('');
  }

  return (
    <div>
      <Box p={2}><Typography variant="h5">マニュアルを複製する</Typography></Box>
      <Box display="flex" flexDirection="row" alignItems="flex-end" p={2}>
        <Box flexGrow={1}>
          <TextField label="複製後のマニュアルタイトルを入力" value={newTitle} onChange={handleChangeTitle} fullWidth/>
        </Box>
        <Box ml={2}><Button variant="contained" color="primary" onClick={handleClick}>複製する</Button></Box>
      </Box>
    </div>
  );
}
export default Copy;