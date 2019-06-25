import React, {useState, useEffect} from 'react';
import { Typography, Button, MenuItem, Box, TextField } from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { CollaboratorsActions } from './change-owner-container';
import { UsersState } from '../../../../redux/states/main/usersState';
import User from '../../../../data-types/user';

interface Props extends UsersState, CollaboratorsActions {
  user: User;
  manual: Manual;
}

const ChangeOwnerComponent: React.FC<Props> = props => {
  const { user, users, manual: propManual, replace } =  props;
  const [manual, setManual] = useState(propManual);
  const isOwner = propManual.ownerId === user.id;
  const hasChange = manual.ownerId !== propManual.ownerId;
  
  const handleSelect = (e: any) => setManual({...manual, ownerId: e.target.value});

  function handleReset() {
    setManual(propManual);
  }

  function handleClickSave() {
    replace(manual);
  }

  useEffect(() => {
    setManual(propManual);
  }, [propManual]);

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="flex-end" py={2}>
        <Box flexGrow={1}>
          <Typography variant="h5">オーナーの変更</Typography>
        </Box>
        {isOwner && <Box><Button onClick={handleReset} disabled={!hasChange}>元に戻す</Button></Box>}
        {isOwner && <Box><Button color="primary" onClick={handleClickSave} disabled={!hasChange}>変更する</Button></Box>}
      </Box>
      <Box display="flex" py={2}>
        <Box flexGrow={1}>
          <TextField
            select
            variant="outlined"
            label="オーナー"
            value={manual.ownerId}
            onChange={handleSelect}
            disabled={!isOwner}
            fullWidth
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {users.map(o => <MenuItem key={o.id} value={o.id}>{`${o.lastName} ${o.firstName}`}</MenuItem>)}
          </TextField>
        </Box>
      </Box>
    </div>
  );
}
export default ChangeOwnerComponent;