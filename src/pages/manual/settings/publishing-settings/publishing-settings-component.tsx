import React, { useState, useEffect } from 'react';
import {
  makeStyles, Theme, Typography, Chip, Button, MenuItem, Box, FormControlLabel, Switch, TextField

} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { CollaboratorsActions } from './publishing-settings-container';
import { UsersState } from '../../../../redux/states/main/usersState';
import User from '../../../../data-types/user';
import _ from 'lodash';
import { UserGroupsState } from '../../../../redux/states/main/userGroupsState';

const useStyles = makeStyles((theme: Theme) => ({
  container: { padding: theme.spacing(2) },
  chip: { margin: theme.spacing(1) },
  switch: { width: 200 },
}));

interface Props extends UsersState, UserGroupsState, CollaboratorsActions {
  user: User;
  manual: Manual;
}

const PublishingSettingsComponent: React.FC<Props> = props => {
  const { user, users, userGroups: groups, manual: propManual, replace } = props;
  const [manual, setManual] = useState(propManual);
  const isOwner = manual.ownerId === user.id;
  const hasChange =
    manual.isPublic !== propManual.isPublic ||
    _.difference(manual.viewerIdsOfUser, propManual.viewerIdsOfUser).length !== 0 ||
    _.difference(manual.viewerIdsOfGroup, propManual.viewerIdsOfGroup).length !== 0 ||
    _.difference(propManual.viewerIdsOfUser, manual.viewerIdsOfUser).length !== 0 ||
    _.difference(propManual.viewerIdsOfGroup, manual.viewerIdsOfGroup).length !== 0;

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setManual({ ...manual, isPublic: checked });
  }

  // Viewer Of User
  const deleteViewerOfUser = (id: string) => () => {
    setManual({ ...manual, viewerIdsOfUser: manual.viewerIdsOfUser.filter(uid => uid !== id) });
  };

  const [selectViewerOfUser, setViewerOfUser] = useState('');
  const handleUserSelect = (e: any) => setViewerOfUser(e.target.value);
  const addViewerOfUser = () => {
    setManual({ ...manual, viewerIdsOfUser: manual.viewerIdsOfUser.concat([selectViewerOfUser]) });
    setViewerOfUser('');
  }
  const userViewers = manual.viewerIdsOfUser
    .map(uid => users.find(u => u.id === uid)!);
  const otherUsers = users
    .filter(u => manual.viewerIdsOfUser.find(uid => u.id === uid) === undefined && u.id !== user.id);
  // Viewer Of User ここまで

  // Viewer Of Group
  const deleteViewerOfGroup = (id: string) => () => {
    setManual({ ...manual, viewerIdsOfGroup: manual.viewerIdsOfGroup.filter(gid => gid !== id) });
  };

  const [selectViewerOfGroup, setViewerOfGroup] = useState('');
  const handleGroupSelect = (e: any) => setViewerOfGroup(e.target.value);
  const addViewerOfGroup = () => {
    setManual({ ...manual, viewerIdsOfGroup: manual.viewerIdsOfGroup.concat([selectViewerOfGroup]) });
    setViewerOfGroup('');
  }
  const groupViewers = manual.viewerIdsOfGroup
    .map(gid => groups.find(g => g.id === gid)!);
  const otherGroups = groups
    .filter(g => manual.viewerIdsOfGroup.find(gid => g.id === gid) === undefined);
  // Viewer Of Group ここまで

  function handleReset() {
    setManual(propManual);
  }

  function handleClickSave() {
    replace(manual);
  }

  useEffect(() => {
    setManual(propManual);
  }, [propManual]);

  const classes = useStyles();

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="flex-end" p={2}>
        <Box flexGrow={1}>
          <Typography variant="h5">公開設定</Typography>
        </Box>
        {isOwner && <Box><Button onClick={handleReset} disabled={!hasChange}>元に戻す</Button></Box>}
        {isOwner && <Box><Button color="primary" onClick={handleClickSave} disabled={!hasChange}>変更する</Button></Box>}
      </Box>
      <Box p={2} width="100%">
        <div><Typography variant="caption">公開・非公開</Typography></div>
        <Box pt={1}>
          <FormControlLabel
            className={classes.switch}
            control={<Switch checked={manual.isPublic} color="primary" onChange={handleSwitch} />}
            label="公開"
            disabled={!isOwner}
          />
        </Box>
      </Box>
      {!manual.isPublic && isOwner &&
        <Box px={2} pt={2}>
          <Box><Typography variant="caption">閲覧可能なユーザー</Typography></Box>
          {userViewers.length === 0 && <Chip className={classes.chip} label="未登録"/>}
          {userViewers.map((u, i) =>
            <Chip
              key={i}
              className={classes.chip}
              label={`${u.lastName} ${u.firstName}`}
              onDelete={isOwner ? deleteViewerOfUser(u.id) : undefined}
            />)}
        </Box>}

      {!manual.isPublic && isOwner &&
        <Box display="flex" flexDirection="row" alignItems="flex-end" p={2}>
          <Box flexGrow={1}>
            <TextField
              select
              variant="outlined"
              label="閲覧可能なユーザーの追加"
              value={selectViewerOfUser}
              onChange={handleUserSelect}
              disabled={!isOwner}
              fullWidth
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {otherUsers.map(o => <MenuItem key={o.id} value={o.id}>{`${o.lastName} ${o.firstName}`}</MenuItem>)}
            </TextField>
          </Box>
          <Box ml={2}>
            <Button variant="contained" color="primary" onClick={addViewerOfUser} disabled={selectViewerOfUser === ''}>追加</Button>
          </Box>
        </Box>}

      {!manual.isPublic && isOwner &&
        <Box px={2} pt={2}>
          <Box><Typography variant="caption">閲覧可能なユーザーグループ</Typography></Box>
          {groupViewers.length === 0 && <Chip className={classes.chip} label="未登録"/>}
          {groupViewers.map((g, i) =>
            <Chip
              key={i}
              className={classes.chip}
              label={g.name}
              onDelete={isOwner ? deleteViewerOfGroup(g.id) : undefined}
            />)}
        </Box>}

      {!manual.isPublic && isOwner &&
        <Box display="flex" flexDirection="row" alignItems="flex-end" p={2}>
          <Box flexGrow={1}>
            <TextField
              select
              variant="outlined"
              label="閲覧可能なユーザーグループの追加"
              value={selectViewerOfGroup}
              onChange={handleGroupSelect}
              disabled={!isOwner}
              fullWidth
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {otherGroups.map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
            </TextField>
          </Box>
          <Box ml={2}>
            <Button variant="contained" color="primary" onClick={addViewerOfGroup} disabled={selectViewerOfGroup === ''}>追加</Button>
          </Box>
        </Box>}
    </div>
  );
}
export default PublishingSettingsComponent;