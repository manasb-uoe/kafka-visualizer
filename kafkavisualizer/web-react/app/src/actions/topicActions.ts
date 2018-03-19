import { Action } from 'redux';
import Topic from '../domain/Topic';
import * as types from '../actions/actionTypes';
import api from '../api/Api';
import { Dispatch } from 'react-redux';
import TopicMessage from '../domain/TopicMessage';
import { ISubscription } from 'rxjs/Subscription';

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

export interface LoadTopicMessagesAction extends Action {
    messages: TopicMessage[];
    error: string;
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

export function loadTopicMessagesSuccess(messages: TopicMessage[]): LoadTopicMessagesAction {
    return { type: types.LOAD_TOPIC_MESSAGES_SUCCESS, messages: messages, error: '' };
}

export function loadTopicMessagesFailure(error: string): LoadTopicMessagesAction {
    return { type: types.LOAD_TOPIC_MESSAGES_FAILURE, error: error, messages: [] };
}

export function loadTopicMessagesStarted(): LoadTopicMessagesAction {
    return { type: types.LOAD_TOPIC_MESSAGES_STARTED, messages: [], error: '' };
}

let subscription: ISubscription;

export function loadTopicMessages(topic: Topic, partition: number, query: string) {
    // tslint:disable-next-line:no-any
    return (dispatch: Dispatch<any>) => {
        dispatch(loadTopicMessagesStarted());
        if (subscription) {
            subscription.unsubscribe();
        }

        subscription = api.getTopicMessages(topic, partition, query)
            .subscribe(
                messages => dispatch(loadTopicMessagesSuccess(messages)),
                error => dispatch(loadTopicMessagesFailure(error))
            );
    };
}