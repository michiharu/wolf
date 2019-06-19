import React, {useEffect, useState} from 'react';

import {
  makeStyles, Theme, Typography,
  Box, FormControlLabel, Switch, FormControl, Select, MenuItem, TextField, Button,
} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { BaseSettingsActions } from './base-settings-container';
import Category from '../../../../data-types/category';
import { maxWidth } from '../settings';
import User from '../../../../data-types/user';

const useStyles = makeStyles((theme: Theme) => ({
  root: {

  },
  title: { width: 'calc(100% - 64px)' },

  chip: { margin: theme.spacing(1) },
  switch: { width: 200 },
}));

interface Props extends BaseSettingsActions {
  user: User;
  categories: Category[];
  manual: Manual;
}

const Collaborators: React.FC<Props> = props => {
  const { user, manual, categories, replace } =  props;
  const isOwner = manual.ownerId === user.id;
  const [isEditing, setIsEditing] = useState(false);
  function handleClickEdit() {
    if (isEditing) {
      const newManual: Manual = {...manual, title};
      replace(newManual);
    }
    setIsEditing(!isEditing);
  }
  const [title, setTitle] = useState(manual.title);
  const handleChangeTitle: React.ChangeEventHandler<HTMLInputElement> = e => {
    setTitle(e.target.value);
  }

  const handleCategorySelect = (e: React.ChangeEvent<{ value: unknown; name?: string; }>) => {
    const newManual: Manual = {...manual, categoryId: e.target.value as string};
    replace(newManual);
  }
  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const newManual: Manual = {...manual, isPublic: checked};
    replace(newManual);
  }

  useEffect(() => {
    setTitle(manual.title);
  }, [manual.title]);


  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box p={2} maxWidth={maxWidth}>
        <Typography variant="h5">マニュアルの基本設定</Typography>
      </Box>
      <Box p={2} maxWidth={maxWidth}>
        <Typography variant="caption">マニュアル名称</Typography>
        <Box>
          <TextField
            className={classes.title}
            value={title}
            onChange={handleChangeTitle}
            disabled={!isEditing}
          />
          <Button onClick={handleClickEdit} disabled={!isOwner}>変更</Button>
        </Box>
      </Box>
      <Box p={2} maxWidth={maxWidth}>
        <Typography variant="caption">カテゴリー</Typography>
        <FormControl fullWidth>
          <Select value={manual.categoryId} onChange={handleCategorySelect} disabled={!isOwner}>
            {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <Box p={2} maxWidth={maxWidth}>
        <div><Typography variant="caption">公開・非公開</Typography></div>
        <Box pt={1}>
          <FormControlLabel
            className={classes.switch}
            control={<Switch checked={manual.isPublic} color="primary" onChange={handleSwitch} />}
            label="公開"
            disabled={!isOwner}
          />
        </Box>
      </Box>
    </div>
  );
}
export default Collaborators;