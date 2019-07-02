import React, {useEffect, useState} from 'react';
import { Typography, Box, TextField, Button } from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { BaseSettingsActions } from './base-settings-container';
import Category from '../../../../data-types/category';
import User from '../../../../data-types/user';

import TitleChecker from '../../../../components/title-checker/title-checker';
import { TitleCheckState } from '../../../../redux/states/titleCheckState';
import AutoSingleSelect from '../../../../components/auto-single-select/auto-single-select';

interface Props extends TitleCheckState, BaseSettingsActions {
  user: User;
  categories: Category[];
  manual: Manual;
  title: string;
}

const BaseSettings: React.FC<Props> = props => {
  const { user, manual: propManual, title, result, categories, replace, titleReset } =  props;
  const [manual, setManual] = useState(propManual);
  const isOwner = manual.ownerId === user.id;
  const hasChange = title !== propManual.title ||
                    manual.categoryId !== propManual.categoryId ||
                    manual.description !== propManual.description;

  const isValid =　propManual.title === title || (title !== '' && result !== null && title === result.title && result.valid);

  const handleCategorySelect = (item: string) => {
    setManual({...manual, categoryId: categories.find(c => c.name === item)!.id});
  }

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManual({...manual, description: e.target.value as string});
  }

  function handleReset() {
    setManual(propManual);
    titleReset({preTitle: manual.title})
  }

  function handleClickSave() {
    replace({...manual, title});
  }

  useEffect(() => {
    setManual(propManual);
  }, [propManual]);
  
  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="flex-end" py={2}>
        <Box flexGrow={1}><Typography variant="h5">マニュアルの基本設定</Typography></Box>
        {isOwner && <Box><Button onClick={handleReset} disabled={!hasChange}>元に戻す</Button></Box>}
        {isOwner &&
        <Box><Button color="primary" onClick={handleClickSave} disabled={!hasChange || !isValid}>変更する</Button></Box>}
      </Box>
      <Box py={2}>
        <TitleChecker defaultTitle={propManual.title} disabled={!isOwner}/>
      </Box>
      <Box py={2} width="100%">
        <AutoSingleSelect
          inputLabel="カテゴリー"
          suggestions={categories}
          labelProp="name"
          initialSelectedItem={categories.find(c => manual.categoryId === c.id)!.name}
          onChange={handleCategorySelect}
        />
      </Box>
      <Box py={2}>
        <TextField
          variant="outlined"
          label="説明"
          value={manual.description}
          onChange={handleChangeDescription}
          multiline
          rows={6}
          rowsMax={12}
          disabled={!isOwner}
          fullWidth
        />
      </Box>
    </div>
  );
}
export default BaseSettings;