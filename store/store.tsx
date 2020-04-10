import { combineReducers, createStore, applyMiddleware } from 'redux';
import RouteReducer from '../reducers/RouteReducer';
import SampleReducer, { SampleReducerInterface } from '../reducers/SampleReducer';
import thunkMiddleware from 'redux-thunk'

export interface AppStateInterface {
    user: any,
    sample: SampleReducerInterface
}

const reducers = combineReducers<AppStateInterface>({
    user: RouteReducer,
    sample: SampleReducer
})
  
export default createStore(reducers, applyMiddleware(thunkMiddleware))