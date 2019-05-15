import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import {
  Theme, createStyles, WithStyles, withStyles, Paper, TextField, FormControlLabel, Switch,
  List, ListItem, ListSubheader,
} from '@material-ui/core';

import TreeUtil from '../../func/tree';
import ExpansionTree from '../../components/expansion-tree/expansion-tree';
import { ManualState } from '../../redux/states/manualState';

const styles = (theme: Theme) => createStyles({
  switch: {
    minWidth: 150
  }
});

interface Props extends ManualState, WithStyles<typeof styles> {}

const ManualList: React.FC<Props> = (props: Props) => {

  const { manuals, classes } = props;
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const changeLabel = (e: any) => setSearchText(e.target.value);
  const handleOpen = (e: any) => setOpen(e.target.checked);
  const words = TreeUtil.splitSearchWords(searchText);
  const filtered = TreeUtil._searchAndFilter(words, manuals);
  return (
    <Paper>
      <List dense subheader={<ListSubheader>マニュアル一覧</ListSubheader>}>
        <ListItem>
          <TextField
            label="マニュアルの検索.."
            value={searchText}
            onChange={changeLabel}
            fullWidth
          />
          <FormControlLabel
            className={classes.switch}
            control={
              <Switch
                checked={open}
                onChange={handleOpen}
                color="primary"
              />
            }
            label="すべてを展開"
          />
        </ListItem>
        {filtered.map(n => 
        <ExpansionTree key={n.id} node={n} open={open} depth={0}/>)}
      </List>
    </Paper>
  );
};
function mapStateToProps(appState: AppState) {
  return appState.manuals;
}

export default connect(mapStateToProps)(withStyles(styles)(ManualList));