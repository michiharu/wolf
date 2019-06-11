import React, {useState, useRef} from 'react';
import {
  makeStyles, Theme, Tabs, Tab, Typography, Divider, Button, IconButton, Modal, Box, Grid,
} from '@material-ui/core';
import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Manual } from '../../../data-types/tree';
import NodeViewer from '../node/node-viewer/node-viewer-container';
import TextViewer from '../text/text-viewer/text-viewer-container';
import ManualSettings from '../settings/settings';
import ViewSettingsContainer from '../../../components/view-settings/view-settings-container';
import User from '../../../data-types/user';
import { Star, StarBorder, ThumbUp, ThumbUpAltOutlined } from '@material-ui/icons';
import { yellow, blue } from '@material-ui/core/colors';
import { Action } from 'typescript-fsa';
import NodeEditorContainer from '../node/node-editor/node-editor-frame-container';
import { drawerWidth } from '../../layout/layout-component';
import TextEditorContainer from '../text/text-editor/text-editor-container';

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
    width: `calc(100vw - ${drawerWidth}px)`,
  },
  viewSettingButton: {
    marginLeft: theme.spacing(1)
  }
}));

interface Props {
  user: User;
  manual: Manual;
  isEditing: boolean;
  replace: (manual: Manual) => Action<Manual>;
  set: (manual: Manual) => Action<Manual>;
  editStart: () => Action<void>;
}

const LayoutComponent: React.FC<Props> = props => {
  const { user, manual, isEditing } =  props;

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

  function onClickEditStart() { props.editStart(); }

  const modeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

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
          <Tab label="設定" disabled={isEditing}/>
        </Tabs>
        <div style={{flexGrow: 1}} />
        <div ref={modeRef}/>
        {(tabIndex === 0 || tabIndex === 1) && isCommiter && !isEditing &&
        <Button color="primary" onClick={onClickEditStart}>編集する</Button>}
        <div ref={buttonRef}/>

        {tabIndex === 0 &&
        <IconButton className={classes.viewSettingButton} onClick={handleShowVS}><ViewSettingsIcon/></IconButton>}
      </div>
      <Divider/>
      <div className={classes.body}>
        {tabIndex === 0 && (!isEditing ? <NodeViewer/> : <NodeEditorContainer modeRef={modeRef} buttonRef={buttonRef}/>)}
        {tabIndex === 1 &&
        (!isEditing
          ? <TextViewer itemNumber={manual.title} />
          : <TextEditorContainer buttonRef={buttonRef}/>)}
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

export default LayoutComponent;