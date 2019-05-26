import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  Theme, createStyles, WithStyles, withStyles,
  Tabs, Tab, Typography, Divider, Button, IconButton, Modal,
} from '@material-ui/core';
import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Link } from 'react-router-dom';
import { Manual, PullRequest } from '../../../data-types/tree';
import NodeViewer from './node-viewer/node-viewer-container';
import TextViewer from './text-editor/text-viewer-container';
import ManualSettings from './settings/settings';
import ViewSettingsContainer from '../../../components/view-settings/view-settings-container';
import RequestContainer from '../request/request-container';
import RequestListContainer from './request-list/request-list-container';
import { Action } from 'typescript-fsa';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing(2),
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
    padding: theme.spacing(0.5),
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
    padding: theme.spacing(2),
    outline: 'none',
  },
  viewSettingButton: {
    marginLeft: theme.spacing(1)
  }
});

interface Props extends WithStyles<typeof styles> {
  manual: Manual;
  request: PullRequest | null;
  clearRequest: () => Action<void>;
  clearManual: () => void;
}

const ViewComponent: React.FC<Props> = props => {
  const { manual, request, clearManual, clearRequest, classes } =  props;

  useEffect(() => {
    return () => clearManual();
  }, [])

  const [tabIndex, setTabIndex] = useState(0);
  const [showVS, setShowVS] = useState(false);

  const handleChangeTab = (_: any, i: number) => {
    setTabIndex(i);
    clearRequest();
  }

  const handleShowVS = () => setShowVS(!showVS);
  const handleCloseVS = () => setShowVS(false);
  const LinkEdit = (le: any) => <Link to={`/manual/${manual.id}/edit`} {...le}/>;

  const Request = request === null ? <RequestListContainer/> : <RequestContainer/>;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div style={{display: 'flex', height: 48}}>
          <Typography variant="h4">{manual.label}</Typography>
        </div>
        <div style={{display: 'flex', height: 48}}>
          <Tabs value={tabIndex} onChange={handleChangeTab}>
            <Tab label="ツリー表示"/>
            <Tab label="テキスト表示"/>
            <Tab label="リクエスト"/>
            <Tab label="設定"/>
          </Tabs>
          <div style={{flexGrow: 1}} />
          {(tabIndex === 0 || tabIndex === 1) &&
          <Button component={LinkEdit} color="primary">編集する</Button>}

          {tabIndex === 2 && request !== null && <>
            <Button  color="primary">採用</Button>
            <Button color="primary">却下</Button>
            <Button>キャンセル</Button>
          </>}
          {(tabIndex === 0 || (tabIndex === 2 && request !== null)) &&
          <IconButton className={classes.viewSettingButton} onClick={handleShowVS}><ViewSettingsIcon/></IconButton>}
        </div>
      </div>
      <Divider/>
      <div>
        {tabIndex === 0 && <NodeViewer/>}
        {tabIndex === 1 && <TextViewer itemNumber={manual.label} />}
        {tabIndex === 2 && Request}
        {tabIndex === 3 && <ManualSettings manual={manual}/>}
      </div>
      <Modal
        open={showVS}
        onClose={handleCloseVS}
        BackdropProps={{className: classes.viewSettingModal}}
        disableAutoFocus
      >
        <ViewSettingsContainer/>
      </Modal>
    </div>
  );
}

export default withStyles(styles)(ViewComponent);