import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Portal } from '@material-ui/core';
import { toolbarHeight, toolbarMinHeight, drawerWidth } from '../../settings/layout';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'absolute',
    overflow: 'visible',
    top: toolbarHeight,
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight,
    },
    left: -theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    width: `100vw`,
    height: 10,
  }
});

interface Props extends WithStyles<typeof styles> {
  containerRef: HTMLDivElement;
  children: React.ReactElement;
}

const ToolContainer: React.SFC<Props> = (props: Props) => {

  const { containerRef, children, classes } = props;

  return (
    <Portal container={containerRef}>
      <div className={classes.root}>{children}</div>
    </Portal>
  );
};

export default withStyles(styles)(ToolContainer);