import { ITopicAction } from './../actions/topicActions';
import * as types from '../actions/actionTypes';
import initialState, { ITopicsState } from './initialState';

// tslint:disable-next-line:no-any
export default function topicReducer(state: ITopicsState = initialState.topics, action: ITopicAction): ITopicsState {
    switch (action.type) {
        case types.LOAD_ALL_TOPICS_STARTED:
            return { isLoading: true, items: [], error: undefined };

        case types.LOAD_ALL_TOPICS_SUCCESS:
            return { isLoading: false, items: action.topics, error: undefined };

        case types.LOAD_ALL_TOPICS_FAILURE:
            return { isLoading: false, items: [], error: action.error };

        default:
            return state;
    }
}