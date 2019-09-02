import { LoadTopicConsumersAction } from './../actions/topicActions';
import { LOAD_TOPIC_CONSUMERS_STARTED, LOAD_TOPIC_CONSUMERS_SUCCESS, LOAD_TOPIC_CONSUMERS_FAILURE } from './../actions/actionTypes';
import initialState, { ConsumersState } from './initialState';
import { Action } from 'redux';

export default function topicMessagesReducer(state: ConsumersState = initialState.consumers, action: Action): ConsumersState {

    switch (action.type) {
        case LOAD_TOPIC_CONSUMERS_STARTED:
            return { isLoading: true, items: [], error: undefined };

        case LOAD_TOPIC_CONSUMERS_SUCCESS:
            return { isLoading: false, items: (action as LoadTopicConsumersAction).consumers, error: undefined };

        case LOAD_TOPIC_CONSUMERS_FAILURE:
            return { isLoading: false, items: [], error: (action as LoadTopicConsumersAction).error };

        default:
            return state;
    }
}
