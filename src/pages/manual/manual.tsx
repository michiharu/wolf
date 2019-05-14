import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import View from './view/view';
import EditorStateManager, { EditorStateManagerProps } from './edit/editor-state-manager';

export interface ManualProps extends EditorStateManagerProps {

}

const Manual: React.FC<ManualProps> = props => {
  const { manuals, commons, memos, changeManuals, changeMemo } = props;
  const editorProps: EditorStateManagerProps = {
    manuals, commons, memos, changeManuals, changeMemo,
  };
  return (
    <Switch>
      <Route
        path={'/manual/:id/edit'}
        render={routerProps => (
          <EditorStateManager {...routerProps} {...editorProps} />
        )}
      />
      <Route
        path={'/manual/:id'}
        render={routerProps => (
          <View {...routerProps} manuals={props.manuals} />
        )}
      />
      
    </Switch>
  );
}

export default Manual;