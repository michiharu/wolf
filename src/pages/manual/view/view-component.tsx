import * as React from 'react';
import {useState} from 'react';
import {
  makeStyles, Theme, Tabs, Tab, Typography, Divider, Button, IconButton, Modal, Box, Grid,
} from '@material-ui/core';
import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Manual } from '../../../data-types/tree';
import NodeViewer from './node-viewer/node-viewer-container';
import TextViewer from './text-editor/text-viewer-container';
import ManualSettings from './settings/settings';
import ViewSettingsContainer from '../../../components/view-settings/view-settings-container';
import AdapterLink from '../../../components/custom-mui/adapter-link';
import User from '../../../data-types/user';
import { Star, StarBorder, ThumbUp, ThumbUpAltOutlined } from '@material-ui/icons';
import { yellow, blue } from '@material-ui/core/colors';
import { Action } from 'typescript-fsa';

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
  favorite: {
    color: yellow[600],
    '&:hover': { opacity: 0.5 }
  },
  like: {
    color: blue[500],
    '&:hover': { opacity: 0.5 }
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
  replace: (manual: Manual) => Action<Manual>;
  set: (manual: Manual) => Action<Manual>;
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
  const isFavorite = manual.favoriteIds.find(fid => fid === user.id) !== undefined;
  const isLike = manual.likeIds.find(lid => lid === user.id) !== undefined;
  const updateManual = (manual: Manual) => {
    props.replace(manual);
    props.set(manual);
  }
  function uncheckFavorite() {
    const newManual: Manual = {...manual, favoriteIds: manual.favoriteIds.filter(fid => fid !== user.id)};
    updateManual(newManual);
  }
  function uncheckLike() {
    const newManual: Manual = {...manual, likeIds: manual.likeIds.filter(lid => lid !== user.id)};
    updateManual(newManual);
  }
  function checkFavorite() {
    const newManual: Manual = {...manual, favoriteIds: manual.favoriteIds.concat([user.id])};
    updateManual(newManual);
  }
  function checkLike() {
    const newManual: Manual = {...manual, likeIds: manual.likeIds.concat([user.id])};
    updateManual(newManual);
  }

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box mt={1} mx={2}>
        <Grid container justify="space-between" alignItems="center" spacing={2}>
          <Grid item><Typography variant="h4" noWrap>{manual.title}</Typography></Grid>
          <Grid item>
            <Box display="flex" flexDirection="row">
              <Box ml={2}>
                {isFavorite
                ? <Star className={classes.favorite} fontSize="large" onClick={uncheckFavorite}/>
                : <StarBorder className={classes.favorite} fontSize="large" onClick={checkFavorite}/>}
              </Box>
              <Box ml={2} mr={1}>
                {isLike
                ? <ThumbUp className={classes.like} fontSize="large" onClick={uncheckLike}/>
                : <ThumbUpAltOutlined className={classes.like} fontSize="large" onClick={checkLike}/>}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
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
        {tabIndex === 2 && <ManualSettings/>}
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