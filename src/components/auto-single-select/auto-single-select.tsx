import React from 'react';
import Downshift, { GetItemPropsOptions } from 'downshift';
import { makeStyles, Theme, Paper } from '@material-ui/core';

import deburr from 'lodash/deburr';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 2000,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(2),
  },
}),
);

interface AutoSingleSelectProps {
  inputLabel?: string;
  placeholder?: string;
  suggestions: any[];
  labelProp: string;
  initialSelectedItem?: string | null;
  onChange: (selectedItem: any) => void;
  willReset?: boolean;
  setWillReset?: (will: boolean) => void;
  disabled?: boolean;
}

type RenderInputProps = TextFieldProps & {
  classes: ReturnType<typeof useStyles>;
  ref?: React.Ref<HTMLDivElement>;
};

const AutoSingleSelect: React.FC<AutoSingleSelectProps> = props => {

  const {
    inputLabel = '',
    placeholder = '',
    suggestions,
    labelProp,
    initialSelectedItem = null,
    onChange,
    willReset,
    setWillReset,
    disabled,
  } = props
  
  function renderInput(inputProps: RenderInputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;
  
    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: { root: classes.inputRoot, input: classes.inputInput },
          ...InputProps,
        }}
        {...other}
        disabled={disabled}
      />
    );
  }

  function getSuggestions(value: string, { showEmpty = false } = {}) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
  
    return inputLength === 0 && !showEmpty
      ? []
      : suggestions.filter(suggestion => {
          const keep = count < 5 && suggestion[labelProp].slice(0, inputLength).toLowerCase() === inputValue;
          if (keep) { count += 1; }
          return keep;
        });
  }

  interface RenderSuggestionProps {
    highlightedIndex: number | null;
    index: number;
    itemProps: MenuItemProps<'div', { button?: never }>;
    selectedItem: string;
    item: any;
  }
  
  function renderSuggestion(suggestionProps: RenderSuggestionProps) {
    const { item, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(item[labelProp]) > -1;
  
    return (
      <MenuItem
        {...itemProps}
        key={item[labelProp]}
        selected={isHighlighted}
        component="div"
        style={{fontWeight: isSelected ? 500 : 400}}
      >
        {item[labelProp]}
      </MenuItem>
    );
  }

  interface RenderSuggestionListProps {
    inputValue: string | null;
    highlightedIndex: number | null;
    selectedItem: string;
    getItemProps: (options: GetItemPropsOptions<any>) => any;
  }
  function renderSuggestionList(listProps: RenderSuggestionListProps) {
    const { inputValue, getItemProps, highlightedIndex, selectedItem } = listProps;
    return getSuggestions(inputValue!, { showEmpty: true }).map((item, index) =>
      renderSuggestion({
        item,
        index,
        itemProps: getItemProps({ item: item[labelProp] }),
        highlightedIndex,
        selectedItem,
      }),
    );
  }

  const classes = useStyles();
  return (
    <Downshift
      initialSelectedItem={initialSelectedItem}
      onChange={onChange}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
        openMenu,
        clearSelection,
      }) => {
        const { onBlur, onFocus, ...inputProps } = getInputProps({
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value === '') {
              clearSelection();
            }
          },
          onFocus: openMenu,
          placeholder
        });

        if (willReset) {
          clearSelection();
          setWillReset !== undefined && setWillReset(false);
        }

        return (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              label: inputLabel,
              InputLabelProps: getLabelProps({ shrink: true } as any),
              InputProps: { onBlur, onChange, onFocus },
              inputProps,
            })}
            <div {...getMenuProps()}>
              {isOpen && (
                <Paper className={classes.paper} square>
                  {renderSuggestionList({ inputValue, getItemProps, highlightedIndex, selectedItem })}
                </Paper>)}
            </div>
          </div>
        );
      }}
    </Downshift>
  );
}

export default AutoSingleSelect;