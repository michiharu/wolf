import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, FormGroup, Switch,
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import KSize from '../../data-types/k-size';
import { KSState } from '../../redux/states/ksState';
import { RSState } from '../../redux/states/rsState';
import { ViewSettingsActions } from './view-settings-container';


const styles = (theme: Theme) => createStyles({
  root: {
    position: 'absolute',
    top: '75vh',
    left: '50vw',
    width: '90vw',
    maxHeight: '45vh',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    outline: 'none',
    overflow: 'scroll',
  },
  speechLabel: {
    marginTop: theme.spacing(3.8),
  },
  cardSettingLabel: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  longSetter: {
    width: 200,
  },
  shortSetter: {
    width: 100,
  },
  slider: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
});

interface Props extends KSState, RSState, ViewSettingsActions, WithStyles<typeof styles> {}


const ViewSettingsComponent: React.FC<Props> = (props: Props) => {
  const { ks, rs, changeKS, changeRS, resetKS, resetRS, classes } = props;
  const reset = () => {
    resetKS();
    resetRS();
  }

  return (
    <Paper className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FormControl>
            <FormLabel>フローの表現</FormLabel>
            <RadioGroup
              value={ks.hasArrow ? 'arrow' : 'rect'}
              onChange={(e: any) => {
                const newKS: KSize = {...ks, hasArrow: e.target.value === 'arrow'};
                changeKS(newKS);
              }}
            >
              <FormControlLabel value="arrow" control={<Radio />} label="フローチャート" />
              <FormControlLabel value="rect"  control={<Radio />} label="包含関係図（オイラー図）" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md>
          <Grid container spacing={5}>
            <Grid item>
              <FormControl>
                <FormLabel>音声読み上げ</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch checked={rs.playOnClick} onChange={(e: any) => changeRS({...rs, playOnClick: e.target.checked})}/>
                    }
                    label="カード選択時に読み上げ"
                    labelPlacement="start"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item>
              <Typography className={classes.speechLabel}>再生スピード</Typography>
              <div className={classes.shortSetter}>
                <Slider
                  classes={{ container: classes.slider }}
                  value={rs.rate}
                  min={0.1}
                  max={1.5}
                  step={0.1}
                  onChange={(_, value) => changeRS({...rs, rate: value})}
                />
              </div>
            </Grid>
            <Grid item>
              <Typography className={classes.speechLabel}>再生ピッチ</Typography>
              <div className={classes.shortSetter}>
                <Slider
                  classes={{ container: classes.slider }}
                  value={rs.pitch}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onChange={(_, value) => changeRS({...rs, pitch: value})}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <FormLabel className={classes.cardSettingLabel}>カード表示設定</FormLabel>
      <Grid container justify="space-between" spacing={4}>
        <Grid item xs={12} md={4}>
          <div className={classes.longSetter}>
            <Typography>表示の大きさ</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.unit}
              min={12}
              max={20}
              step={1}
              onChange={(_, value) => {
                const newKS = {...ks, unit: value};
                changeKS(newKS);
              }}
            />
          </div>
        </Grid>
        <Grid item xs={6} md={4}>
          <div className={classes.longSetter}>
            <Typography>長方形の横幅</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.rect.w}
              min={20}
              max={40}
              step={1}
              onChange={(_, value) => {
                const newKS = {...ks, rect: {...ks.rect, w: value}};
                changeKS(newKS);
              }}
            />
          </div>
        </Grid>
        <Grid item xs={6} md={4}>
          <div className={classes.shortSetter}>
            <Typography>長方形の縦幅</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.rect.h}
              min={2}
              max={4}
              step={1}
              onChange={(_, value) => {
                const newKS = {...ks, rect: {...ks.rect, h: value}};
                changeKS(newKS);
              }}
            />
          </div>
        </Grid>
        <Grid item xs={6} md={4}>
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
        <Grid item xs={6} md={4}>
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
        <Grid item xs={12} md={4}>
          <Button variant="contained" onClick={reset}>
            既定値へ戻す
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default withStyles(styles)(ViewSettingsComponent);