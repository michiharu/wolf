import React, {useState, useEffect} from 'react';
import { Typography, Button, Box } from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { CollaboratorsActions } from './change-owner-container';
import { UsersState } from '../../../../redux/states/main/usersState';
import User from '../../../../data-types/user';
import AutoSingleSelect from '../../../../components/auto-single-select/auto-single-select';

interface Props extends UsersState, CollaboratorsActions {
  user: User;
  manual: Manual;
}

const ChangeOwnerComponent: React.FC<Props> = props => {
  const { user, users, manual: propManual, replace } =  props;
  const [manual, setManual] = useState(propManual);
  const isOwner = propManual.ownerId === user.id;
  const hasChange = manual.ownerId !== propManual.ownerId;
  
  const handleSelect = (item: string | null) => {
    if (item !== null) {
      setManual({...manual, ownerId: users.find(u => item === createUserIdentityName(u))!.id});
    }
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

  const createUserIdentityName = (u: User) => `${u.lastName} ${u.firstName} (${u.id})`;
  interface UserAsItem extends User { name: string; }
  
  const usersAsItem: UserAsItem[] = users.map(u => ({...u, name: createUserIdentityName(u)}));
  const item = createUserIdentityName(users.find(u => u.id === manual.ownerId)!);
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
          <AutoSingleSelect
            inputLabel="オーナーの変更"
            suggestions={usersAsItem}
            labelProp="name"
            initialSelectedItem={item}
            onChange={handleSelect}
            disabled={!isOwner}
          />
        </Box>
      </Box>
    </div>
  );
}
export default ChangeOwnerComponent;