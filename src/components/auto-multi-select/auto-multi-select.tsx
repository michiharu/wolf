import React from 'react';
import Downshift from 'downshift';
import { makeStyles, Theme, Paper, Chip } from '@material-ui/core';

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

interface AutoMultiSelectProps {
  inputLabel?: string;
  placeholder?: string;
  suggestions: any[];
  labelProp: string;
  initialSelectedItem?: string[];
  onChange: (selectedItem: any[]) => void;

  // 選択されているアイテムを、このコンポーネントの外のイベントからリセットする場合に使用する
  willReset?: boolean;
  setWillReset?: (will: boolean) => void;

  disabled?: boolean;
}

type RenderInputProps = TextFieldProps & {
  classes: ReturnType<typeof useStyles>;
  ref?: React.Ref<HTMLDivElement>;
};

const AutoMultiSelect: React.FC<AutoMultiSelectProps> = props => {

  const {
    inputLabel = '',
    placeholder = '',
    suggestions,
    labelProp,
    initialSelectedItem = [],
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
    suggestion: any;
  }
  
  function renderSuggestion(suggestionProps: RenderSuggestionProps) {
    const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion[labelProp]) > -1;
  
    return (
      <MenuItem
        {...itemProps}
        key={suggestion[labelProp]}
        selected={isHighlighted}
        component="div"
        style={{fontWeight: isSelected ? 500 : 400}}
      >
        {suggestion[labelProp]}
      </MenuItem>
    );
  }

  const [inputValue, setInputValue] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<string[]>(initialSelectedItem);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
    }
  }

  function handleInputChange(event: React.ChangeEvent<{ value: string }>) {
    setInputValue(event.target.value);
  }

  function handleChange(item: string) {
    let newSelectedItem = [...selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue('');
    setSelectedItem(newSelectedItem);
    onChange(newSelectedItem);
  }

  const handleDelete = (item: string) => () => {
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setSelectedItem(newSelectedItem);
  };

  const classes = useStyles();
  console.log('selectedItem');
  console.log(selectedItem);
  return (
    <Downshift
      inputValue={inputValue}
      selectedItem={selectedItem}
      onChange={handleChange}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        highlightedIndex,
        isOpen,
        inputValue: inputValueDS,
        selectedItem: selectedItemDS,
        openMenu,
        clearSelection,
      }) => {
        const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
          onKeyDown: handleKeyDown,
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
              InputLabelProps: getLabelProps(),
              InputProps: {
                startAdornment: selectedItem.map((item: string) => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className={classes.chip}
                    onDelete={handleDelete(item)}
                  />
                )),
                onBlur,
                onChange: event => {
                  handleInputChange(event);
                  onChange!(event as React.ChangeEvent<HTMLInputElement>);
                },
                onFocus,
              },
              inputProps,
            })}
            {isOpen && (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValueDS!, {showEmpty: true}).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion[labelProp] }),
                    highlightedIndex,
                    selectedItem: selectedItemDS,
                  }),
                )}
              </Paper>)}
          </div>
        );
      }}
    </Downshift>
  );
}

export default AutoMultiSelect;