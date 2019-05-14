import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Grid, Theme, createStyles, WithStyles, withStyles
} from '@material-ui/core';
import { Tree } from '../../data-types/tree-node';

import ManualList from './manual-list';

const styles = (theme: Theme) => createStyles({

  container: {
    padding: theme.spacing.unit
  }

});

export interface DashboardProps {
  treeNodes: Tree[];
  commonNodes: Tree[];
  changeManuals: (node: Tree[]) => void;
  addCommonList: (node: Tree) => void;
  deleteCommonList: (node: Tree) => void;
}

interface Props extends DashboardProps, RouteComponentProps, WithStyles<typeof styles> {}

const Dashboard: React.FC<Props> = (props: Props) => {
  const {
    classes, ...otherProps
  } = props;
  
  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <div className={classes.container}>
          <ManualList {...otherProps}/>
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
      
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Dashboard);