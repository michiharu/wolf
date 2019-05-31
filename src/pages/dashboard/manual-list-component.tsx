import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import {
  Theme, createStyles, WithStyles, withStyles, Paper, TextField, FormControlLabel, Switch,
  List, ListItem, Button, Typography,
} from '@material-ui/core';

import TreeUtil from '../../func/tree';
import ExpansionTree from '../../components/expansion-tree/expansion-tree';
import { ManualsState } from '../../redux/states/manualsState';
import { Add } from '@material-ui/icons';
import CreateManualContainer from './create-manual/create-manual-container';

const styles = (theme: Theme) => createStyles({
  switch: {
    minWidth: 150,
    marginLeft: theme.spacing(1),
  }
});

interface Props extends ManualsState, WithStyles<typeof styles> {}

const ManualList: React.FC<Props> = (props: Props) => {

  const { manuals, classes } = props;
  const [searchText, setSearchText] = useState('');
  const changeLabel = (e: any) => setSearchText(e.target.value);
  const [open, setOpen] = useState(false);
  const handleOpen = (e: any) => setOpen(e.target.checked);
  const [willCreate, setWillCreate] = useState(false);
  const handleWillCreate = () => setWillCreate(!willCreate);

  const words = TreeUtil.splitSearchWords(searchText);
  const filtered = TreeUtil._searchAndFilter(words, manuals);
  return (
    <Paper>
      <List dense>
        <ListItem>
          <Typography>マニュアル一覧</Typography>
          <div style={{flexGrow: 1}}/>
          <Button variant="contained" color="primary" onClick={handleWillCreate}>マニュアル新規作成<Add/></Button>
        </ListItem>
        <ListItem>
          <TextField
            label="マニュアルの検索.."
            value={searchText}
            onChange={changeLabel}
            fullWidth
          />
          <FormControlLabel
            className={classes.switch}
            control={<Switch checked={open} onChange={handleOpen} color="primary"/>}
            label="すべてを展開"
          />
        </ListItem>
        {filtered.map(n => 
        <ExpansionTree key={n.id} node={n} open={open} depth={0}/>)}
      </List>
      <CreateManualContainer willCreate={willCreate} handleWillCreate={handleWillCreate}/>
    </Paper>
  );
};
function mapStateToProps(appState: AppState) {
  return {...appState.manuals};
}

export default connect(mapStateToProps)(withStyles(styles)(ManualList));