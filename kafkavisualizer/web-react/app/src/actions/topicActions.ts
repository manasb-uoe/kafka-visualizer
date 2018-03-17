import { Action } from 'redux';
import Topic from '../domain/Topic';
import * as types from '../actions/actionTypes';
import api from '../api/Api';
import { Dispatch } from 'react-redux';

export interface LoadTopicsAction extends Action {
    topics: Topic[];
    error: string;
}

export interface SelectTopicAction extends Action {
    topic: Topic;
}

export interface SelectPartitionAction extends Action {
    paritition: number;
}

export function loadAllTopicsStarted(): LoadTopicsAction {
    return { type: types.LOAD_ALL_TOPICS_STARTED, topics: [], error: '', };
}

export function loadAllTopicsSuccess(topics: Array<Topic>): LoadTopicsAction {
    return { type: types.LOAD_ALL_TOPICS_SUCCESS, topics: topics, error: '' };
}

export function loadAllTopicsFailure(error: string): LoadTopicsAction {
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

export function selectTopic(topic: Topic): SelectTopicAction {
    return { type: types.SELECT_TOPIC, topic: topic };
}

export function selectPartition(partition: number): SelectPartitionAction {
    return { type: types.SELECT_PARITITON, paritition: partition };
}