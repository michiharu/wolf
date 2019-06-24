import React, {useState, useEffect} from 'react';
import {
  Theme, makeStyles, Typography, Chip, Button, MenuItem, Box, TextField
} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { CollaboratorsActions } from './collaborators-container';
import { UsersState } from '../../../../redux/states/main/usersState';
import User from '../../../../data-types/user';
import _ from 'lodash';

const useStyles = makeStyles((theme: Theme) => ({
  chip: { margin: theme.spacing(1) },
}));

interface Props extends UsersState, CollaboratorsActions {
  user: User;
  manual: Manual;
}

const Collaborators: React.FC<Props> = props => {
  const { user, users, manual: propManual, replace } =  props;
  const [manual, setManual] = useState(propManual);
  const isOwner = manual.ownerId === user.id;
  const hasChange =
  _.difference(manual.collaboratorIds, propManual.collaboratorIds).length !== 0 ||
  _.difference(propManual.collaboratorIds, manual.collaboratorIds).length !== 0;
  
  const deleteCollaborator = (id: string) => () => {
    setManual({...manual, collaboratorIds: manual.collaboratorIds.filter(cid => cid !== id)});    
  };

  const [selectCollaboratorId, setCollaboratorId] = useState('');
  const handleSelect = (e: any) => setCollaboratorId(e.target.value);
  const addCollaborator = () => {
    setManual({...manual, collaboratorIds: manual.collaboratorIds.concat([selectCollaboratorId])});    
    setCollaboratorId('');
  }

  function handleReset() {
    setManual(propManual);
  }

  function handleClickSave() {
    replace(manual);
  }

  useEffect(() => {
    setManual(propManual);
  }, [propManual]);

  const collaborators = manual.collaboratorIds
  .map(cid => users.find(u => u.id === cid)!);
  const others = users
  .filter(u => manual.collaboratorIds.find(cid => cid === u.id) === undefined && u.id !== user.id);

  const classes = useStyles();

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="flex-end" py={2}>
        <Box flexGrow={1}>
          <Typography variant="h5">コラボレーター</Typography>
        </Box>
        {isOwner && <Box><Button onClick={handleReset} disabled={!hasChange}>元に戻す</Button></Box>}
        {isOwner && <Box><Button color="primary" onClick={handleClickSave} disabled={!hasChange}>変更する</Button></Box>}
      </Box>
      <Box py={2}>
        <Box><Typography variant="caption">コラボレーター</Typography></Box>
        {collaborators.length === 0 && <Chip className={classes.chip} label="未登録"/>}
        {collaborators.map((c, i) => 
        <Chip
          key={i}
          className={classes.chip}
          label={`${c.lastName} ${c.firstName}`}
          onDelete={isOwner ? deleteCollaborator(c.id) : undefined}
        />)}
      </Box>
      <Box display="flex" flexDirection="row" alignItems="flex-end" py={2}>
        <Box flexGrow={1}>
          <TextField
            select
            variant="outlined"
            label="コラボレーターの追加"
            value={selectCollaboratorId}
            onChange={handleSelect}
            disabled={!isOwner}
            fullWidth
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {others.map(o => <MenuItem key={o.id} value={o.id}>{`${o.lastName} ${o.firstName}`}</MenuItem>)}
          </TextField>
        </Box>
        <Box ml={2}>
          <Button variant="contained" color="primary" onClick={addCollaborator} disabled={selectCollaboratorId === ''}>追加</Button>
        </Box>
      </Box>
    </div>
  );
}
export default Collaborators;