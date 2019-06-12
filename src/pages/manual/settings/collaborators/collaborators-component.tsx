import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, Chip, Button, FormControl, InputLabel, Select, MenuItem, Grid, Box

} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { CollaboratorsActions } from './collaborators-container';
import { UsersState } from '../../../../redux/states/main/usersState';
import { maxWidth } from '../settings';

const styles = (theme: Theme) => createStyles({
  root: {

  },
  container: { padding: theme.spacing(2) },
  chip: { margin: theme.spacing(1) },
});

interface Props extends UsersState, CollaboratorsActions, WithStyles<typeof styles> {
  manual: Manual;
}

const Collaborators: React.FC<Props> = props => {
  const { users, manual, classes } =  props;
  const collaboratorIds = manual.collaboratorIds;
  const [collaboratorId, setCollaboratorId] = useState('');
  const changeCollaborators = (collaboratorIds: string[]) => {
    const newManual: Manual = {...manual, collaboratorIds};
    props.replace(newManual);
  };
  const deleteCollaborator = (id: string) => () => changeCollaborators(collaboratorIds.filter(cid => cid !== id));

  const handleSelect = (e: any) => setCollaboratorId(e.target.value);
  const addCollaborator = () => {
    changeCollaborators(collaboratorIds.concat([collaboratorId]));
    setCollaboratorId('');
  }

  const owner = users.find(u => u.id === manual.ownerId)!;
  const collaborators = collaboratorIds.map(cid => users.find(u => u.id === cid)!);
  const others = users.filter(u => collaboratorIds.find(cid => cid === u.id) === undefined);
  return (
    <div className={classes.root}>
      <Box p={2} maxWidth={maxWidth}>
        <Typography variant="h5">コラボレーター</Typography>
      </Box>
      <Box p={2} maxWidth={maxWidth}>
        <Typography variant="caption">オーナー</Typography>
        <Chip className={classes.chip} label={`${owner.lastName} ${owner.firstName}`}/>
      </Box>
      <Box p={2} maxWidth={maxWidth}>
        <Typography variant="caption">コラボレーター</Typography>
        {collaborators.map((c, i) => 
        <Chip
          key={i}
          className={classes.chip}
          label={`${c.lastName} ${c.firstName}`}
          onDelete={deleteCollaborator(c.id)}
        />)}
      </Box>
      <Box p={2} maxWidth={maxWidth}>
        <Grid container alignItems="flex-end" spacing={3}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>コラボレーターの追加</InputLabel>
              <Select value={collaboratorId} onChange={handleSelect}>
                <MenuItem value=""><em>None</em></MenuItem>
                {others.map(o => <MenuItem key={o.id} value={o.id}>{`${o.lastName} ${o.firstName}`}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={addCollaborator} disabled={collaboratorId === ''}>追加</Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
export default withStyles(styles)(Collaborators);