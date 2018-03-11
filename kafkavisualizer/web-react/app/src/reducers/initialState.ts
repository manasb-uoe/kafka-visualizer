import Topic  from '../domain/Topic';
import Broker from '../domain/Broker';

export interface ITopicsState {
    isLoading: boolean;
    items: Topic[];
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
}

const initialState: IAppState =  {
    topics: {
        isLoading: false,
        items: [],
        error: ''
    },
    brokers: {
        isLoading: false,
        items: [],
        error: ''
    }
};

export default initialState;