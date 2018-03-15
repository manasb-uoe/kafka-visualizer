import Topic  from '../domain/Topic';
import Broker from '../domain/Broker';

export interface ITopicsState {
    isLoading: boolean;
    items: Topic[];
    error?: string;
    selected?: Topic;
}

export interface BrokersState {
    isLoading: boolean;
    items: Broker[];
    error?: string;
}

export interface IAppState {
    topics: ITopicsState;
    brokers: BrokersState;
}

const initialState: IAppState =  {
    topics: {
        isLoading: false,
        items: []
    },
    brokers: {
        isLoading: false,
        items: []
    }
};

export default initialState;