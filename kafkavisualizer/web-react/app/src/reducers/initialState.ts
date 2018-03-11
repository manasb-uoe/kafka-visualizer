import Topic  from '../domain/Topic';

export interface ITopicsState {
    isLoading: boolean;
    items: Topic[];
    error?: string;    
}

export interface IAppState {
    topics: ITopicsState;
}

const initialState: IAppState =  {
    topics: {
        isLoading: false,
        items: [],
        error: ''
    }
};

export default initialState;