import React, {useState, useRef} from 'react';
import {
  makeStyles, Theme, Tabs, Tab, Typography, Divider, Button, IconButton, Modal, Box, Grid, CircularProgress,
} from '@material-ui/core';
import ViewSettingsIcon from '@material-ui/icons/Settings';

import { Manual, TreeNode } from '../../../data-types/tree';
import NodeViewer from '../node/node-viewer/node-viewer-container';
import TextViewer from '../text/text-viewer/text-viewer-container';
import ManualSettings from '../settings/settings';
import ViewSettingsContainer from '../../../components/view-settings/view-settings-container';
import User from '../../../data-types/user';
import { Star, StarBorder, ThumbUp, ThumbUpAltOutlined, ZoomIn, ZoomOut } from '@material-ui/icons';
import { yellow, blue } from '@material-ui/core/colors';
import { Action } from 'typescript-fsa';
import NodeEditorContainer from '../node/node-editor/node-editor-frame-container';
import { drawerWidth } from '../../layout/layout-component';
import TextEditorContainer from '../text/text-editor/text-editor-container';
import { FavoritePostRequestParams, FavoriteDeleteRequestParams, LikePostRequestParams, LikeDeleteRequestParams } from '../../../api/definitions';
import KSize from '../../../data-types/k-size';

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
  progressContainer: {
    width: ``,
    height: `calc(100vh - ${drawerWidth}px)`,
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  viewSettingButton: {
    marginLeft: theme.spacing(1)
  }
}));

interface Props {
  user: User;
  manual: Manual;
  selectNode: TreeNode | null;
  isEditing: boolean;
  ks: KSize;
  replace: (manual: Manual) => Action<Manual>;
  postFavorite: (params: FavoritePostRequestParams) => Action<FavoritePostRequestParams>,
  deleteFavorite: (params: FavoriteDeleteRequestParams) => Action<FavoriteDeleteRequestParams>,
  postLike: (params: LikePostRequestParams) => Action<LikePostRequestParams>,
  deleteLike: (params: LikeDeleteRequestParams) => Action<LikeDeleteRequestParams>,
  editStart: () => Action<void>;
  zoomIn: () => Action<void>;
  zoomOut: () => Action<void>;
}

const LayoutComponent: React.FC<Props> = props => {
  const { user, manual, selectNode, isEditing, ks, zoomIn, zoomOut } =  props;

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

  function uncheckFavorite() {
    props.deleteFavorite({manualId: manual.id, userId: user.id});    
  }
  function uncheckLike() {
    props.deleteLike({manualId: manual.id, userId: user.id});
  }
  function checkFavorite() {
    props.postFavorite({manualId: manual.id, userId: user.id});
  }
  function checkLike() {
    props.postLike({manualId: manual.id, userId: user.id});
  }

  function onClickEditStart() { props.editStart(); }

  const modeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const classes = useStyles();
  const ShowTree = (
    <div className={classes.body}>
      {tabIndex === 0 && (!isEditing ? <NodeViewer/> : <NodeEditorContainer modeRef={modeRef} buttonRef={buttonRef}/>)}
      {tabIndex === 1 &&
      (!isEditing
        ? <TextViewer itemNumber={manual.title} />
        : <TextEditorContainer buttonRef={buttonRef}/>)}
      {tabIndex === 2 && <ManualSettings/>}
    </div>
  );

  const LoadingTree = (
    <div className={classes.progressContainer}>
      <CircularProgress className={classes.progress} size={60}/>
    </div>
  );

  
  return (
    <div className={classes.root}>
      <Box mt={1} mx={2}>
        <Grid container justify="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Box display="flex" flexDirection="row">
              <Typography variant="h5" color="textSecondary">{`${user.lastName} ${user.firstName} /`}</Typography>
              <Box ml={1}><Typography variant="h4">{manual.title}</Typography></Box>
            </Box>
          </Grid>
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
        <Box mt={0.7}>
          <Button color="primary" onClick={onClickEditStart}>編集する</Button>
        </Box>}
        <div ref={buttonRef}/>
        {tabIndex === 0 &&
        <IconButton className={classes.viewSettingButton} onClick={zoomIn} disabled={ks.unit === 30}>
          <ZoomIn/>
        </IconButton>}
        {tabIndex === 0 &&
        <IconButton className={classes.viewSettingButton} onClick={zoomOut} disabled={ks.unit === 8}>
          <ZoomOut/>
        </IconButton>}
        {tabIndex === 0 &&
        <IconButton className={classes.viewSettingButton} onClick={handleShowVS}><ViewSettingsIcon/></IconButton>}
      </div>
      <Divider/>
      {selectNode !== null ? ShowTree : LoadingTree}
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