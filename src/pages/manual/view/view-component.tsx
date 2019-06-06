import * as React from 'react';
import {useState} from 'react';
import {
  makeStyles, Theme, Tabs, Tab, Typography, Divider, Button, IconButton, Modal,
} from '@material-ui/core';
import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Manual } from '../../../data-types/tree';
import NodeViewer from './node-viewer/node-viewer-container';
import TextViewer from './text-editor/text-viewer-container';
import ManualSettings from './settings/settings';
import ViewSettingsContainer from '../../../components/view-settings/view-settings-container';
import AdapterLink from '../../../components/custom-mui/adapter-link';
import User from '../../../data-types/user';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(1),
  },
  header: {
    display: 'flex',
    paddingTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  body: {
    maxWidth: theme.breakpoints.width('md'),
    margin: 'auto',
    textAlign: 'right',
  },
  viewSettingButton: {
    marginLeft: theme.spacing(1)
  }
}));

interface Props {
  user: User;
  manual: Manual;
}

const ViewComponent: React.FC<Props> = props => {
  const { user, manual } =  props;

  const [tabIndex, setTabIndex] = useState(0);
  const [showVS, setShowVS] = useState(false);

  const handleChangeTab = (_: any, i: number) => {
    setTabIndex(i);
  }

  const handleShowVS = () => setShowVS(!showVS);
  const handleCloseVS = () => setShowVS(false);

  const isCommiter = manual.ownerId === user.id || manual.collaboratorIds.find(cid => cid === user.id) !== undefined;

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4">{manual.title}</Typography>
      </div>
      <div className={classes.header}>
        <Tabs value={tabIndex} onChange={handleChangeTab}>
          <Tab label="ツリー表示"/>
          <Tab label="テキスト表示"/>
          <Tab label="設定"/>
        </Tabs>
        <div style={{flexGrow: 1}} />
        {(tabIndex === 0 || tabIndex === 1) && (isCommiter ?
        <Button to={`/manual/${manual.id}/edit`} component={AdapterLink} color="primary">編集する</Button> :
        <Button to={`/manual/${manual.id}/create-request`} component={AdapterLink} color="primary">リクエストの作成</Button>)}

        {tabIndex === 0 &&
        <IconButton className={classes.viewSettingButton} onClick={handleShowVS}><ViewSettingsIcon/></IconButton>}
      </div>
      <Divider/>
      <div>
        {tabIndex === 0 && <NodeViewer/>}
        {tabIndex === 1 && <TextViewer itemNumber={manual.title} />}
        {tabIndex === 2 && <ManualSettings manual={manual}/>}
      </div>
      <Modal
        open={showVS}
        onClose={handleCloseVS}
        keepMounted
      >
        <div>
          <ViewSettingsContainer/>
        </div>
      </Modal>
    </div>
  );
}

export default ViewComponent;