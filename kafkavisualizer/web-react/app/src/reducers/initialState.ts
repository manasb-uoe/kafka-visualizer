import Topic  from '../domain/Topic';
import Broker from '../domain/Broker';
import TopicMessage from '../domain/TopicMessage';
import { Consumer } from '../domain/Consumer';

export interface ITopicsState {
    isLoading: boolean;
    items: Topic[];
    error?: string;
    selectedTopic?: Topic;
    selectedPartition?: number;
}

export interface TopicMessagesState {
    isLoading: boolean;
    items: TopicMessage[];
    error?: string;
}

export interface BrokersState {
    isLoading: boolean;
    items: Broker[];
    error?: string;
}

export interface ConsumersState {
    isLoading: boolean;
    items: Consumer[];
    error?: string;
}

export interface IAppState {
    topics: ITopicsState;
    brokers: BrokersState;
    topicMessages: TopicMessagesState;
    consumers: ConsumersState;
}

const initialState: IAppState =  {
    topics: {
        isLoading: false,
        items: []
    },
    brokers: {
        isLoading: false,
        items: []
    },
    topicMessages: {
        isLoading: false,
        items: [],
    },
    consumers: {
        isLoading: false,
        items: []
    }
};

export default initialState;