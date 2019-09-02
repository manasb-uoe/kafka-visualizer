import { IAppState } from './../reducers/initialState';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';

export default function configureStore(initialState?: IAppState) {
    return createStore(rootReducer, initialState, applyMiddleware(thunk));
}