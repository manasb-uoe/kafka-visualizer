import { LoadTopicMessagesAction } from './../actions/topicActions';
import * as types from '../actions/actionTypes';
import initialState, { TopicMessagesState } from './initialState';
import { Action } from 'redux';

export default function topicMessagesReducer(state: TopicMessagesState = initialState.topicMessages, action: Action): TopicMessagesState {

    switch (action.type) {
        case types.LOAD_TOPIC_MESSAGES_STARTED:
            return { isLoading: true, items: [], error: undefined };

        case types.LOAD_TOPIC_MESSAGES_SUCCESS:
            return { isLoading: false, items: (action as LoadTopicMessagesAction).messages, error: undefined };

        case types.LOAD_TOPIC_MESSAGES_FAILURE:
            return { isLoading: false, items: [], error: (action as LoadTopicMessagesAction).error };

        default:
            return state;
    }
} 