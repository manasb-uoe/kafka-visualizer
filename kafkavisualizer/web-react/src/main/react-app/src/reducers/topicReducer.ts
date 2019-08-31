import { LoadTopicsAction, SelectTopicAction, SelectPartitionAction } from './../actions/topicActions';
import * as types from '../actions/actionTypes';
import initialState, { ITopicsState } from './initialState';
import { Action } from 'redux';

export default function topicReducer(state: ITopicsState = initialState.topics, action: Action): ITopicsState {

    switch (action.type) {
        case types.LOAD_ALL_TOPICS_STARTED:
            return { isLoading: true, items: [], error: undefined, selectedTopic: undefined, selectedPartition: Number.MIN_VALUE };

        case types.LOAD_ALL_TOPICS_SUCCESS:
            return {
                ...state, isLoading: false, items: (action as LoadTopicsAction).topics, error: undefined, selectedPartition: 0
            };

        case types.LOAD_ALL_TOPICS_FAILURE:
            return { isLoading: false, items: [], error: (action as LoadTopicsAction).error, selectedTopic: undefined, selectedPartition: Number.MIN_VALUE };

        case types.SELECT_TOPIC:
            return { ...state, selectedTopic: (action as SelectTopicAction).topic, selectedPartition: 0 };

        case types.SELECT_PARITITON:
            return { ...state, selectedPartition: (action as SelectPartitionAction).paritition };

        default:
            return state;
    }
}