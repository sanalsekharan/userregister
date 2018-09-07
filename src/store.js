import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducer/reducer';


const reducers = {
    reducer,
}
const reduce = combineReducers(reducers)

export default createStore(
    reduce,
    applyMiddleware(thunk))
