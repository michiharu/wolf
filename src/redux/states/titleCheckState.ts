import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { TitleCheckResult, titleCheckAction } from '../actions/titileCheckAction';

export interface TitleCheckState {
  preTitle: string;
  title: string;
  result: TitleCheckResult | null;
  seed: string | null;
}

const initialState: TitleCheckState = {
  preTitle: '',
  title: '',
  result: null,
  seed: null,
};

export const titleCheckReducer = reducerWithInitialState(initialState)
.case(
  titleCheckAction.set,
  (state, { preTitle, willGenerate }) => (
    {...state, preTitle, title: preTitle, result: null, seed: willGenerate !== undefined ? willGenerate : null}
  )
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
  titleCheckAction.done,
  (state, result) => ({...state, result, title: result.title})
)