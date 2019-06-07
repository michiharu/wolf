import * as React from 'react';
import {useState} from 'react';
import {
  Grid, Paper, List, ListItem, ListItemText, Box
} from '@material-ui/core';
import BaseSettings from './base-settings/base-settings-container';
import Collaborators from './collaborators/collaborators-container';
import Copy from './copy/copy-container';
import Delete from './delete/delete-container';

export const maxWidth = 600;

interface Props {}

const ManualSettings: React.FC<Props> = props => {
  const [selected, setSelected] = useState(0)
  const handleSelect = (i: number) => () => setSelected(i);
  return (
    <Box m={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={4} lg={3}>
          <Paper >
            <List>
              <ListItem button selected={selected === 0} onClick={handleSelect(0)}>
                <ListItemText>基本設定</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 1} onClick={handleSelect(1)}>
                <ListItemText>コラボレーター</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 2} onClick={handleSelect(2)}>
                <ListItemText>マニュアルの複製</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 3} onClick={handleSelect(3)}>
                <ListItemText>マニュアルの削除</ListItemText>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={7}>
          {selected === 0 && <BaseSettings/>}
          {selected === 1 && <Collaborators/>}
          {selected === 2 && <Copy/>}
          {selected === 3 && <Delete/>}
        </Grid>
      </Grid>
    </Box>
  );
}
export default ManualSettings;