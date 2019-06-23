import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { TitleCheckResult, titleCheckAction } from '../actions/titileCheckAction';

export interface TitleCheckState {
  preTitle: string;
  title: string;
  result: TitleCheckResult | null;
  willGenerate: boolean;
}

const initialState: TitleCheckState = {
  preTitle: '',
  title: '',
  result: null,
  willGenerate: false,
};

export const titleCheckReducer = reducerWithInitialState(initialState)
.case(
  titleCheckAction.set,
  (state, preTitle) => ({...state, preTitle, title: preTitle})
)
.case(
  titleCheckAction.enqueue,
  (state, titleSet) => ({...state, ...titleSet})
)
.case(
  titleCheckAction.get,
  (state, result) => ({...state, result})
)
.case(
  titleCheckAction.reset,
  (state) => ({...state, preTitle: '', title: '', result: null})
)