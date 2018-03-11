import { combineReducers } from 'redux';
import topicReducer from './topicReducer';
import brokersReducer from './brokersReducer';

export default combineReducers({
    topics: topicReducer,
    brokers: brokersReducer
});