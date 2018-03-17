import { LoadTopicsAction, SelectTopicAction } from './../actions/topicActions';
import * as types from '../actions/actionTypes';
import initialState, { ITopicsState } from './initialState';
import { Action } from 'redux';

export default function topicReducer(state: ITopicsState = initialState.topics, action: Action): ITopicsState {

    switch (action.type) {
        case types.LOAD_ALL_TOPICS_STARTED:
            return { isLoading: true, items: [], error: undefined, selectedTopic: undefined };

        case types.LOAD_ALL_TOPICS_SUCCESS:
            return { isLoading: false, items: (action as LoadTopicsAction).topics, 
                error: undefined, selectedTopic: undefined };

        case types.LOAD_ALL_TOPICS_FAILURE:
            return { isLoading: false, items: [], error: (action as LoadTopicsAction).error, selectedTopic: undefined };

        case types.SELECT_TOPIC:
            return { ...state, selectedTopic: (action as SelectTopicAction).topic };

        default:
            return state;
    }
}