import * as React from 'react';
import { useState } from 'react';

import {
  Theme,  TextField, FormControlLabel, Switch,
  Button, DialogTitle, DialogContent, DialogActions, makeStyles, Box, Typography, FormControl, Select, MenuItem,
} from '@material-ui/core';

import { CreateManualActions } from './create-manual-container';
import { baseManual, Manual, baseTree } from '../../../data-types/tree';
import User from '../../../data-types/user';
import Util from '../../../func/util';
import { CategoriesState } from '../../../redux/states/main/categoriesState';

const useStyles = makeStyles((theme: Theme) => ({
  switch: {
    minWidth: 150,
    margin: theme.spacing(1),
    marginBottom: 0,
  }
}));

interface Props extends CategoriesState, CreateManualActions {
  user: User;
  onClose: () => void;
}

const CreateManualComponent: React.FC<Props> = props => {

  const { categories, onClose } = props;
  const [title, setTitle] = useState('');
  const handleLabel = (e: any) => setTitle(e.target.value);
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const handleCategorySelect = (e: React.ChangeEvent<{ value: unknown; name?: string; }>) => {
    setCategoryId(e.target.value as string);
  }

  const [isPublic, setIsPublic] = useState(true);
  const handleIsPublic = (e: any) => setIsPublic(e.target.checked);
  const close = () => {
    setTitle('');
    setIsPublic(true);
    onClose();
  }

  const create = () => {
    const {user, add} = props;
    const newManual: Manual = {
      ...baseManual, id: Util.getID(), beforeSaving: true, title, categoryId, isPublic, ownerId: user.id, rootTree: baseTree
    };
    add(newManual);
    close();
  };
  const classes = useStyles();
  return (
    <>
      <DialogTitle>マニュアルの新規作成</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="マニュアルの名称"
          value={title}
          onChange={handleLabel}
          fullWidth
        />
        <Box py={2}>
          <Typography variant="caption">カテゴリー</Typography>
          <FormControl fullWidth>
            <Select value={categoryId} onChange={handleCategorySelect}>
              {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <FormControlLabel
          className={classes.switch}
          control={<Switch checked={isPublic} onChange={handleIsPublic} color="primary"/>}
          label="公開"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>キャンセル</Button>
        <Button onClick={create} color="primary">作成</Button>
      </DialogActions>
    </>
  );
};

export default CreateManualComponent;