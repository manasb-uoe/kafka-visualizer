import { Action } from 'redux';
import Topic from '../domain/Topic';
import * as types from '../actions/actionTypes';
import api from '../api/Api';
import { Dispatch } from 'react-redux';

export interface ITopicAction extends Action {
    topics: Topic[];
    error: string;
}

export function loadAllTopicsStarted(): ITopicAction {
    return {type: types.LOAD_ALL_TOPICS_STARTED, topics: [], error: '', };
}

export function loadAllTopicsSuccess(topics: Array<Topic>): ITopicAction {
    return { type: types.LOAD_ALL_TOPICS_SUCCESS, topics: topics, error: '' };
}

export function loadAllTopicsFailure(error: string): ITopicAction {
    return { type: types.LOAD_ALL_TOPICS_FAILURE, topics: [], error: error };
}

export function loadAllTopics() {
    // tslint:disable-next-line:no-any
    return (dispatch: Dispatch<any>) => {
        dispatch(loadAllTopicsStarted());
        api.getTopics()
            .subscribe(
                topics => dispatch(loadAllTopicsSuccess(topics)),
                error => dispatch(loadAllTopicsFailure(error)));
    };
}