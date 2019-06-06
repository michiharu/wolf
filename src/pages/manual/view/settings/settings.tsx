import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Paper, List, ListItem, ListItemText, Box
} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import Collaborators from './collaborators/collaborators-container';
import Copy from './copy';
import DeleteForm from './delete';

const styles = (theme: Theme) => createStyles({

});

interface Props extends WithStyles<typeof styles> {
  manual: Manual;
}

const ManualSettings: React.FC<Props> = props => {
  const { manual } =  props;
  const [selected, setSelected] = useState(0)
  const handleSelect = (i: number) => () => setSelected(i);
  return (
    <Box m={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={4} lg={3}>
          <Paper >
            <List>
              <ListItem button selected={selected === 0} onClick={handleSelect(0)}>
                <ListItemText>コラボレーター</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 1} onClick={handleSelect(1)}>
                <ListItemText>マニュアルの複製</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 2} onClick={handleSelect(2)}>
                <ListItemText>マニュアルの非公開・削除</ListItemText>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={7}>
          {selected === 0 && <Collaborators/>}
          {selected === 1 && <Copy manual={manual}/>}
          {selected === 2 && <DeleteForm manual={manual}/>}
        </Grid>
      </Grid>
    </Box>
  );
}
export default withStyles(styles)(ManualSettings);