import Topic  from '../domain/Topic';
import Broker from '../domain/Broker';
import TopicMessage from '../domain/TopicMessage';

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

export interface IAppState {
    topics: ITopicsState;
    brokers: BrokersState;
    topicMessages: TopicMessagesState;
}

const initialState: IAppState =  {
    topics: {
        isLoading: false,
        items: [],
        selectedPartition: 0
    },
    brokers: {
        isLoading: false,
        items: []
    },
    topicMessages: {
        isLoading: false,
        items: [],
    }
};

export default initialState;