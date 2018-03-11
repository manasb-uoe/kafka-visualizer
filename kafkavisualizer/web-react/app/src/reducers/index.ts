import { combineReducers } from 'redux';
import topicReducer from './topicReducer';

export default combineReducers({
    topics: topicReducer
});