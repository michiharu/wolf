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
  dismiss: () => Action<void>;
  remove: (key: number) => Action<number>;
}

const Notifier: React.FC<Props> = ({enqueue, display, dequeue, dismiss, remove}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (enqueue) {
      enqueueSnackbar(enqueue.message, {
        key: enqueue.key,
        variant: enqueue.variant,
        action: closeSnackbarButton(closeSnackbar),
        onExited: () => remove(enqueue.key)
      });
      display()
    }
    if (dequeue) {
      closeSnackbar(dequeue.key);
      dismiss();
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
    dismiss: () => dispatch(notificationsAction.dismiss()),
    remove: (key: number) => dispatch(notificationsAction.remove(key)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifier);