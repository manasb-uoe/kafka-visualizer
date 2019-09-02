import { LOAD_TOPIC_CONSUMERS_STARTED, LOAD_TOPIC_CONSUMERS_SUCCESS, LOAD_TOPIC_CONSUMERS_FAILURE } from './actionTypes';
import { Action } from 'redux';
import Topic from '../domain/Topic';
import * as types from '../actions/actionTypes';
import api from '../api/Api';
import { Dispatch } from 'react-redux';
import TopicMessage from '../domain/TopicMessage';
import { ISubscription } from 'rxjs/Subscription';
import { Consumer } from '../domain/Consumer';

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

export interface LoadTopicConsumersAction extends Action {
    consumers: Consumer[];
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

export function loadTopicConsumersStarted(): LoadTopicConsumersAction {
    return { type: LOAD_TOPIC_CONSUMERS_STARTED, consumers: [], error: '' };
}

export function loadTopicConsumersSuccess(consumers: Consumer[]) {
    return { type: LOAD_TOPIC_CONSUMERS_SUCCESS, consumers: consumers, error: '' };
}

export function loadTopicConsumersFailure(error: string) {
    return { type: LOAD_TOPIC_CONSUMERS_FAILURE, consumers: [], error: error };
}

export function loadTopicConsumers(topic: Topic, partition: number) {
    // tslint:disable-next-line:no-any
    return (dispatch: Dispatch<any>) => {
        dispatch(loadTopicConsumersStarted());
        api.getTopicConsumers(topic, partition)
            .subscribe(
                consumers => dispatch(loadTopicConsumersSuccess(consumers)),
                error => dispatch(loadTopicConsumersFailure(error))
            );
    };
}