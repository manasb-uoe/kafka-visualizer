import { BrokerAction } from './../actions/brokerActions';
import * as types from '../actions/actionTypes';
import initialState, { BrokersState } from './initialState';

// tslint:disable-next-line:no-any
export default function brokersReducer(state: BrokersState = initialState.brokers, action: BrokerAction): BrokersState {
    switch (action.type) {
        case types.LOAD_ALL_BROKERS_STARTED:
            return { isLoading: true, items: [], error: undefined };

        case types.LOAD_ALL_BROKERS_SUCCESS:
            return { isLoading: false, items: action.brokers, error: undefined };

        case types.LOAD_ALL_BROKERS_FAILURE:
            return { isLoading: false, items: [], error: action.error };

        default:
            return state;
    }
}