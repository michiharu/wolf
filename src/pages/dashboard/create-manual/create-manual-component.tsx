import * as React from 'react';
import { useState } from 'react';

import {
  Theme, createStyles, WithStyles, withStyles, TextField, FormControlLabel, Switch,
  Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';

import TreeUtil from '../../../func/tree';
import { ManualsState } from '../../../redux/states/manualsState';
import { LoginUserState } from '../../../redux/states/loginUserState';
import { CreateManualActions } from './create-manual-container';
import { baseManual, Manual } from '../../../data-types/tree';
import User from '../../../data-types/user';
import Util from '../../../func/util';

export const styles = (theme: Theme) => createStyles({
  switch: {
    minWidth: 150,
    margin: theme.spacing.unit,
    marginBottom: 0,
  }
});

interface Props extends ManualsState, CreateManualActions, WithStyles<typeof styles> {
  user: User;
  willCreate: boolean;
  handleWillCreate: () => void;
}

const CreateManualComponent: React.FC<Props> = props => {

  const { willCreate, handleWillCreate, classes } = props;
  const [label, setLabel] = useState('');
  const handleLabel = (e: any) => setLabel(e.target.value);
  const [isPublic, setIsPublic] = useState(true);
  const handleOpen = (e: any) => setIsPublic(e.target.checked);
  const close = () => {
    setLabel('');
    setIsPublic(true);
    handleWillCreate();
  }

  const create = () => {
    const {user, manuals, changeManuals} = props;
    const newManual: Manual = {...baseManual, id: Util.getID(), label, ownerId: user.id, isPublic};
    manuals.unshift(newManual);
    changeManuals(manuals);
    close();
  };

  return (
    <Dialog open={willCreate} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>マニュアルの新規作成</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="マニュアルの名称"
          value={label}
          onChange={handleLabel}
          fullWidth
        />
        <FormControlLabel
          className={classes.switch}
          control={<Switch checked={isPublic} onChange={handleOpen} color="primary"/>}
          label="公開"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>キャンセル</Button>
        <Button onClick={create} color="primary">作成</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateManualComponent;