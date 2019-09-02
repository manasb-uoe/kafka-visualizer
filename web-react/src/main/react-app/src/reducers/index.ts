import { combineReducers } from 'redux';
import topicReducer from './topicReducer';
import brokersReducer from './brokersReducer';
import topicMessagesReducer from './topicMessagesReducer';
import topicConsumersReducer from './topicConsumersReducer';

export default combineReducers({
    topics: topicReducer,
    brokers: brokersReducer,
    topicMessages: topicMessagesReducer,
    consumers: topicConsumersReducer
}); 