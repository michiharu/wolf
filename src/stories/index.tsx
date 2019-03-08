import React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';

import { List } from '@material-ui/core';
import FlowItem from '../components/flow-item';
import Crop from '@material-ui/icons/Crop169';
import Switch from '@material-ui/icons/Share';
import { Stage, Layer } from 'react-konva';
import CheckBox from '../components/konva-node/check-box';
import IconWithBadge from '../components/konva-node/icon-with-badge';
import task from '../resource/svg-icon/task';

storiesOf('Material-UI', module)
.addDecorator(muiTheme())
.add('FlowItem Example', () => (
  <div style={{width: 360}}>
    <List>
      <FlowItem label="ToDo"><Crop/></FlowItem>
      <FlowItem label="Switch"><Switch style={{transform: 'rotate(90deg)'}}/></FlowItem>
    </List>
  </div>
));

storiesOf('Konva', module)
.add('CheckBox - checked', () => (
  <Stage width={400} height={400}>
    <Layer>
      <CheckBox x={20} y={20} checked={true}/>
    </Layer>
  </Stage>
))
.add('CheckBox - blank', () => (
  <Stage width={400} height={400}>
    <Layer>
      <CheckBox x={20} y={20} checked={false}/>
    </Layer>
  </Stage>
))
.add('Icon with badge', () => (
  <Stage width={400} height={400}>
    <Layer>
      <IconWithBadge x={20} y={20} svg={task} badgeContent="3"/>
      <IconWithBadge x={80} y={40} svg={task} badgeContent="33"/>
      <IconWithBadge x={140} y={60} svg={task} badgeContent="333"/>
      <IconWithBadge x={200} y={80} svg={task} badgeContent="3333"/>
    </Layer>
  </Stage>
))