import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';
import { TitleCheckState } from '../../redux/states/titleCheckState';
import { AppState } from '../../redux/store';
import { titleCheckAction, TitleSet } from '../../redux/actions/titileCheckAction';
import { TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { Check, Error } from '@material-ui/icons';
import { green, red } from '@material-ui/core/colors';

interface Props extends TitleCheckState {
  defaultTitle: string;
  disabled?: boolean;
  willGenerate?: string;
  set: (params: {preTitle: string; willGenerate?: string}) => Action<{preTitle: string; willGenerate?: string}>;
  generate: () => Action<void>;
  enqueue: (titleSet: TitleSet) => Action<TitleSet>;
}

const TitleChecker: React.FC<Props> = props => {
  const {defaultTitle, disabled, willGenerate, title, preTitle, result, set, generate, enqueue} = props;
  if (defaultTitle !== preTitle) {
    set({preTitle: defaultTitle, willGenerate});
    if (willGenerate !== undefined) {
      generate()
    }
  }

  function handleTitleChange(e: any) {
    enqueue({preTitle: defaultTitle, title: e.target.value});
  }

  const renderAdornment = title !== defaultTitle ? (
    <InputAdornment position="end">
      {(result === null || title !== result.title) ? <CircularProgress size={24}/> :
      result.valid ? <Check style={{color: green[300]}}/> : <Error style={{color: red[300]}}/>}
    </InputAdornment>
  ) : undefined;

  const helperText: string | undefined =
  title === defaultTitle ? '' :
  result === null ? '' :
  result.valid ? 'このタイトルは使用可能です' : 'このタイトルは重複しているため使用できません';
  
  return (
    <TextField
      label="マニュアルの名称"
      value={title}
      onChange={handleTitleChange}
      InputProps={{ endAdornment: renderAdornment }}
      helperText={helperText}
      disabled={disabled !== undefined && disabled}
      fullWidth
    />
  );
}

function mapStateToProps(appState: AppState) {
  return {...appState.titleCheck};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    set: (params: {preTitle: string; willGenerate?: string}) => dispatch(titleCheckAction.set(params)),
    generate: () => dispatch(titleCheckAction.generate()),
    enqueue: (titleSet: TitleSet) => dispatch(titleCheckAction.enqueue(titleSet)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TitleChecker);