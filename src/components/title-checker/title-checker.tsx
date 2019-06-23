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
  generate?: boolean;
  set: (preTitle: string) => Action<string>;
  enqueue: (titleSet: TitleSet) => Action<TitleSet>;
}

const TitleChecker: React.FC<Props> = props => {
  const {defaultTitle, disabled, title, preTitle, result, set, enqueue} = props;
  if (defaultTitle !== preTitle) {
    set(defaultTitle);
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
    set: (preTitle: string) => dispatch(titleCheckAction.set(preTitle)),
    enqueue: (titleSet: TitleSet) => dispatch(titleCheckAction.enqueue(titleSet)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TitleChecker);