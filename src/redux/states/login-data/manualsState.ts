import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { manualsAction } from '../../actions/login-data/manualsAction';
import { Manual } from '../../../data-types/tree';

export interface ManualsState {
  manuals: Manual[];
  dataBeforeSaving: Manual[];
}

const initialState: ManualsState = {
  manuals: [],
  dataBeforeSaving: [],
};

export const manualsReducer = reducerWithInitialState(initialState)
.case(
  manualsAction.set,
  (state, manuals) => ({...state, manuals})
)
// POST
.case(
  manualsAction.post,
  (state, manual) => ({
    ...state,
    manuals: state.manuals.concat([manual]),
    dataBeforeSaving: state.dataBeforeSaving.concat([manual])
  })
)
.case(
  manualsAction.postSuccess,
  (state, {beforeId, manual}) => ({
    ...state,
    manuals: state.manuals.map(m => m.id === beforeId ? manual : m),
    dataBeforeSaving: state.dataBeforeSaving.filter(m => m.id !== beforeId)
  })
)
.case(
  manualsAction.postError,
  (state, beforeId) => ({
      ...state,
    manuals: state.manuals.filter(m => m.id === beforeId),
    dataBeforeSaving: state.dataBeforeSaving.filter(m => m.id !== beforeId)
  })
)
//PUT
.case(
  manualsAction.put,
  (state, manual) => ({
    ...state,
    manuals: state.manuals.map(m => m.id === manual.id ? manual : m),
    dataBeforeSaving: state.dataBeforeSaving.concat([manual])
  })
)
.case(
  manualsAction.putSuccess,
  (state, {beforeId, manual}) => ({
    ...state,
    manuals: state.manuals.map(m => m.id === beforeId ? manual : m),
    dataBeforeSaving: state.dataBeforeSaving.filter(m => m.id !== manual.id)
  })
)
.case(
  manualsAction.putError,
  (state, beforeId) => {
    const before = state.dataBeforeSaving.find(m => m.id === beforeId)!
    return {
      ...state,
      manuals: state.manuals.map(m => m.id === beforeId ? before : m),
      dataBeforeSaving: state.dataBeforeSaving.filter(m => m.id !== beforeId)
    };
  }
)
// DELETE
.case(
  manualsAction.delete,
  (state, manual) => ({
    ...state,
    manuals: state.manuals.filter(m => m.id !== manual.id),
    dataBeforeSaving: state.dataBeforeSaving.concat([manual])
  })
)
.case(
  manualsAction.deleteSuccess,
  (state, beforeId) => ({
    ...state,
    dataBeforeSaving: state.dataBeforeSaving.filter(m => m.id !== beforeId)
  })
)
.case(
  manualsAction.deleteError,
  (state, beforeId) => {
    const before = state.dataBeforeSaving.find(m => m.id === beforeId)!
    return {
      ...state,
      manuals: state.manuals.concat([before]),
      dataBeforeSaving: state.dataBeforeSaving.filter(m => m.id !== beforeId)
    };
  }
)