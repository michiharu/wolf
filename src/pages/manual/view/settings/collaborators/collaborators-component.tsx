import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, Chip, Button, FormControl, InputLabel, Select, MenuItem, Grid

} from '@material-ui/core';
import { Manual } from '../../../../../data-types/tree';
import { CollaboratorsActions } from './collaborators-container';
import { UsersState } from '../../../../../redux/states/usersState';

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
    props.set(newManual);
  };
  const deleteCollaborator = (id: string) => () => {
    changeCollaborators(collaboratorIds.filter(cid => cid !== id));
    setCollaboratorId('');
  }
  const handleSelect = (e: any) => setCollaboratorId(e.target.value);
  const addCollaborator = () => changeCollaborators(collaboratorIds.concat([collaboratorId]));

  const owner = users.find(u => u.id === manual.ownerId)!;
  const collaborators = collaboratorIds.map(cid => users.find(u => u.id === cid)!);
  const others = users.filter(u => collaboratorIds.find(cid => cid === u.id) === undefined);
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="caption">オーナー</Typography>
        <Chip className={classes.chip} label={`${owner.lastName} ${owner.firstName}`}/>
      </div>
      <div className={classes.container}>
        <Typography variant="caption">コラボレーター</Typography>
        {collaborators.map((c, i) => 
        <Chip
          key={i}
          className={classes.chip}
          label={`${c.lastName} ${c.firstName}`}
          onDelete={deleteCollaborator(c.id)}
        />)}
      </div>
      <div className={classes.container}>
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
            <Button variant="contained" color="primary" onClick={addCollaborator}>追加</Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
export default withStyles(styles)(Collaborators);