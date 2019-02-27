import React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';

import { List } from '@material-ui/core';
import FlowItem from '../components/flow-item';
import Crop from '@material-ui/icons/Crop169';
import Switch from '@material-ui/icons/Share';

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
