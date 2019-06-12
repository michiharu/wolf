import * as React from 'react';

import {
  makeStyles, Theme, Typography,
  Box, FormControlLabel, Switch, FormControl, Select, MenuItem,
} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { BaseSettingsActions } from './base-settings-container';
import Category from '../../../../data-types/category';
import { maxWidth } from '../settings';

const useStyles = makeStyles((theme: Theme) => ({
  root: {

  },
  container: { padding: theme.spacing(2) },
  chip: { margin: theme.spacing(1) },
  switch: { width: 200 },
}));

interface Props extends BaseSettingsActions {
  categories: Category[];
  manual: Manual;
}

const Collaborators: React.FC<Props> = props => {
  const { manual, categories, replace } =  props;
  const handleCategorySelect = (e: React.ChangeEvent<{ value: unknown; name?: string; }>) => {
    const newManual: Manual = {...manual, categoryId: e.target.value as string};
    replace(newManual);
  }
  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const newManual: Manual = {...manual, isPublic: checked};
    replace(newManual);
  }

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box p={2} maxWidth={maxWidth}>
        <Typography variant="h5">マニュアルの基本設定</Typography>
      </Box>
      <Box p={2} maxWidth={maxWidth}>
        <Typography variant="caption">カテゴリー</Typography>
        <FormControl fullWidth>
          <Select value={manual.id} onChange={handleCategorySelect}>
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
          />
        </Box>
      </Box>
    </div>
  );
}
export default Collaborators;