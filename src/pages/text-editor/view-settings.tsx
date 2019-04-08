import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Paper, Typography,
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import KSize from '../../data-types/k-size';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'absolute',
    top: '75vh',
    left: '50vw',
    width: '90vw',
    maxHeight: '45vh',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing.unit * 2,
    outline: 'none',
  },
  scroll: {
    
  },
  longSetter: {
    width: 200,
  },
  shortSetter: {
    width: 100,
  },
  slider: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
  },
});

export interface ViewSettingProps {
  ks: KSize;
  changeKS: (ks: KSize) => void;
}

interface Props extends ViewSettingProps, WithStyles<typeof styles> {}


const ViewSettings: React.SFC<Props> = (props: Props) => {
  const { ks, changeKS, classes } = props;

  return (
    <Paper className={classes.root}>
      <Grid container justify="space-around" spacing={32}>
        <Grid item>
          <div className={classes.longSetter}>
            <Typography>表示の大きさ</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.unit}
              min={10}
              max={40}
              step={1}
              onChange={(_, value) => {
                const newKS = {...ks, unit: value};
                changeKS(newKS);
              }}
            />
          </div>
        </Grid>
        <Grid item>
          <div className={classes.longSetter}>
            <Typography>長方形の横幅</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.rect.w}
              min={12}
              max={40}
              step={1}
              onChange={(_, value) => {
                const newKS = {...ks, rect: {...ks.rect, w: value}};
                changeKS(newKS);
              }}
            />
          </div>
        </Grid>
        <Grid item>
          <div className={classes.shortSetter}>
            <Typography>長方形の縦幅</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.rect.h}
              min={2}
              max={5}
              step={1}
              onChange={(_, value) => {
                const newKS = {...ks, rect: {...ks.rect, h: value}};
                changeKS(newKS);
              }}
            />
          </div>
        </Grid>
        <Grid item>
          <div className={classes.shortSetter}>
            <Typography>インデント</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.indent}
              min={2}
              max={6}
              step={2}
              onChange={(_, value) => {
                const newKS = {...ks, indent: value};
                changeKS(newKS);
              }}
            />
          </div>
        </Grid>
        <Grid item>
          <div className={classes.shortSetter}>
            <Typography>縦の余白</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.margin.h}
              min={1}
              max={3}
              step={1}
              onChange={(_, value) => {
                const newKS = {...ks, margin: {...ks.margin, h: value}};
                changeKS(newKS);
              }}
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default withStyles(styles)(ViewSettings);