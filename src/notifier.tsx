import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { NotificationsState } from './redux/states/notificationsState';
import { notificationsAction } from './redux/actions/notificationsAction';
import { AppState } from './redux/store';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';
import closeSnackbarButton from './components/notistack';

interface Props extends NotificationsState {
  display: () => Action<void>;
  remove: (key: number) => Action<number>;
}

const Notifier: React.FC<Props> = ({queue, display, remove}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (queue) {
      enqueueSnackbar(queue.message, {
        variant: queue.variant,
        action: closeSnackbarButton(closeSnackbar),
        onExited: () => remove(queue.key)
      });
      display()
    }
    return;
  });
  
  return <></>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.notifications};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    display: () => dispatch(notificationsAction.display()),
    remove: (key: number) => dispatch(notificationsAction.remove(key)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifier);