import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Paper, List, ListItem, ListItemText

} from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import Collaborators from './collaborators';
import Operation from './operation';
import Copy from './copy';
import DeleteForm from './delete';

const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: theme.breakpoints.width('md'),
    margin: 'auto',
    paddingTop: theme.spacing.unit * 3,
  },
});

interface Props extends WithStyles<typeof styles> {
  manual: Manual;
}

const ManualSettings: React.FC<Props> = props => {
  const { manual, classes } =  props;
  const [selected, setSelected] = useState(0)
  const handleSelect = (i: number) => () => setSelected(i);
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item sm={4}>
          <Paper>
            <List>
              <ListItem button selected={selected === 0} onClick={handleSelect(0)}>
                <ListItemText>コラボレーター</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 1} onClick={handleSelect(1)}>
                <ListItemText>運用</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 2} onClick={handleSelect(2)}>
                <ListItemText>マニュアルの複製</ListItemText>
              </ListItem>
              <ListItem button selected={selected === 3} onClick={handleSelect(3)}>
                <ListItemText>マニュアルの非公開・削除</ListItemText>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item sm={8}>
          {selected === 0 && <Collaborators manual={manual}/>}
          {selected === 1 && <Operation manual={manual}/>}
          {selected === 2 && <Copy manual={manual}/>}
          {selected === 3 && <DeleteForm manual={manual}/>}
        </Grid>
      </Grid>
    </div>
  );
}
export default withStyles(styles)(ManualSettings);