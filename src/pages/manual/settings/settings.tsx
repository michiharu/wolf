import * as React from 'react';
import {useState} from 'react';
import {
  Grid, Paper, List, ListItem, ListItemText, Box
} from '@material-ui/core';
import BaseSettings from './base-settings/base-settings-container';
import Collaborators from './collaborators/collaborators-container';
import PublishingSettings from './publishing-settings/publishing-settings-container';
import Copy from './copy/copy-container';
import Delete from './delete/delete-container';
import ChangeOwner from './change-owner/change-owner-container';

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
                <ListItemText>公開設定</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 3} onClick={handleSelect(3)}>
                <ListItemText>マニュアルの複製</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 4} onClick={handleSelect(4)}>
                <ListItemText>マニュアルのオーナー変更</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 5} onClick={handleSelect(5)}>
                <ListItemText>マニュアルの削除</ListItemText>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={9}>
          <Box maxWidth={600}>
            {selected === 0 && <BaseSettings/>}
            {selected === 1 && <Collaborators/>}
            {selected === 2 && <PublishingSettings/>}
            {selected === 3 && <Copy/>}
            {selected === 4 && <ChangeOwner/>}
            {selected === 5 && <Delete/>}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
export default ManualSettings;