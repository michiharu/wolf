import * as React from 'react';
import {useState} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
  Tabs, Tab, Typography, Divider, Button, IconButton, Modal,
} from '@material-ui/core';
import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Link } from 'react-router-dom';
import { Manual } from '../../../data-types/tree';
import NodeViewer from './node-viewer/node-viewer-container';
import TextViewer from './text-editor/text-viewer-container';
import ManualSettings from './settings/settings';
import RequestList from './request-list';
import ViewSettings, { ViewSettingProps } from '../../../components/view-settings';
import { ks as defaultKS } from '../../../settings/layout';
import { FlowType } from '../edit/node-editor/node-editor';
import { rs as defaultRS } from '../../../settings/reading';
import KSize from '../../../data-types/k-size';
import ReadingSetting from '../../../data-types/reading-settings';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing.unit * 2,
  },
  header: {
    maxWidth: theme.breakpoints.width('md'),
    margin: 'auto',
  },
  body: {
    maxWidth: theme.breakpoints.width('md'),
    margin: 'auto',
    textAlign: 'right',
  },
  toolbar: theme.mixins.toolbar,
  convergent: {
    transform: 'scale(1, -1)',
  },
  close: {
    padding: theme.spacing.unit * 0.5,
  },
  viewSettingModal: {
    backgroundColor: '#0002',
  },
  viewSettingPaper: {
    position: 'absolute',
    top: '75vh',
    left: '50vw',
    width: '90vw',
    maxHeight: '45vh',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing.unit * 2,
    outline: 'none',
  },
});

interface Props extends WithStyles<typeof styles> {
  manual: Manual;
}

const ViewComponent: React.FC<Props> = props => {
  const { manual, classes } =  props;

  const [tabIndex, setTabIndex] = useState(0);
  const [showVS, setShowVS] = useState(false);

  const [ks, setKS] = useState(defaultKS);
  const [ft, setFT] = useState<FlowType>('arrow');
  const [rs, setRS] = useState(defaultRS);
  if (tabIndex !== 0 && showVS) { setShowVS(false); }

  const handleChangeTab = (_: any, i: number) => setTabIndex(i);
  const handleShowVS = () => setShowVS(!showVS);
  const handleCloseVS = () => setShowVS(false);
  const LinkEdit = (le: any) => <Link to={`/manual/${manual.id}/edit`} {...le}/>;

  const changeKS = (ks: KSize) => setKS(ks);

  const changeFT = (ft: FlowType) => setFT(ft);

  const changeRS = (rs: ReadingSetting) => setRS(rs);

  const reset = () => {
    setKS(defaultKS);
    setFT('arrow');
    setRS(rs);
  }

  const viewSettingProps: ViewSettingProps = {
    ks, ft, rs,
    changeKS, changeFT, changeRS, reset
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div style={{display: 'flex', height: 48}}>
          <Typography variant="h4">{manual.label}</Typography>
          <div style={{flexGrow: 1}} />
          {(tabIndex === 0 || tabIndex === 1) &&
          <Button component={LinkEdit} variant="contained" color="primary" size="small" style={{height: 48}}>編集する</Button>}
        </div>
        <div>
          <Tabs value={tabIndex} onChange={handleChangeTab}>
            <Tab label="ツリー表示"/>
            <Tab label="テキスト表示"/>
            <Tab label="リクエスト"/>
            <Tab label="設定"/>
          </Tabs>
          <div style={{flexGrow: 1}} />
          <IconButton onClick={handleShowVS}><ViewSettingsIcon/></IconButton>
        </div>
      </div>
      <Divider/>
      <div>
        {tabIndex === 0 && <NodeViewer/>}
        {tabIndex === 1 && <TextViewer itemNumber={manual.label} />}
        {tabIndex === 2 && <RequestList manual={manual}/>}
        {tabIndex === 3 && <ManualSettings manual={manual}/>}
      </div>
      <Modal
        open={showVS}
        onClose={handleCloseVS}
        BackdropProps={{className: classes.viewSettingModal}}
        disableAutoFocus
      >
        <ViewSettings {...viewSettingProps}/>
      </Modal>
    </div>
  );
}

export default withStyles(styles)(ViewComponent);