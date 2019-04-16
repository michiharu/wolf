import * as React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Grid, Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, FormGroup, Switch,
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import KSize from '../../../data-types/k-size';
import { FlowType, flowType } from './node-editor';
import { ks as defaultKS } from '../../../settings/layout';
import ReadingSetting from '../../../data-types/reading-settings';


const styles = (theme: Theme) => createStyles({
  root: {
    position: 'absolute',
    top: '75vh',
    left: '50vw',
    width: '90vw',
    maxHeight: '45vh',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    outline: 'none',
    overflow: 'scroll',
  },
  speechLabel: {
    marginTop: theme.spacing.unit * 3.8,
  },
  cardSettingLabel: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
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
  ft: FlowType;
  rs: ReadingSetting;
  changeKS: (ks: KSize) => void;
  changeFT: (flowType: FlowType) => void;
  changeRS: (rs: ReadingSetting) => void;
  reset: () => void;
}

interface Props extends ViewSettingProps, WithStyles<typeof styles> {}


const ViewSettings: React.SFC<Props> = (props: Props) => {
  const { ks, ft, rs, changeKS, changeFT, changeRS, reset, classes } = props;

  return (
    <Paper className={classes.root}>
      <Grid container spacing={32}>
        <Grid item xs={12} md={4}>
          <FormControl>
            <FormLabel>フローの表現</FormLabel>
            <RadioGroup
              value={ft}
              onChange={(e: any) => changeFT(e.target.value as FlowType)}
            >
              <FormControlLabel value={flowType.arrow} control={<Radio />} label="フローチャート" />
              <FormControlLabel value={flowType.rect}  control={<Radio />} label="包含関係図（オイラー図）" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md>
          <Grid container spacing={40}>
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
      <Grid container justify="space-between" spacing={32}>
        <Grid item xs={12} md={4}>
          <div className={classes.longSetter}>
            <Typography>表示の大きさ</Typography>
            <Slider
              classes={{ container: classes.slider }}
              value={ks.unit}
              min={10}
              max={24}
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
              min={14}
              max={30}
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

export default withStyles(styles)(ViewSettings);