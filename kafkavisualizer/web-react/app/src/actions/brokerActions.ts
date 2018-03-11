import { Action } from 'redux';
import { BrokerAction } from './brokerActions';
import api from '../api/Api';
import * as types from '../actions/actionTypes';
import Broker from '../domain/Broker';
import { Dispatch } from 'react-redux';

export interface BrokerAction extends Action {
    brokers: Broker[];
    error: string;
}

export function loadAllBrokersStarted(): BrokerAction {
    return { type: types.LOAD_ALL_BROKERS_STARTED, brokers: [], error: '' };
}

export function loadAllBrokersSuccess(brokers: Broker[]): BrokerAction {
    return { type: types.LOAD_ALL_BROKERS_SUCCESS, brokers: brokers, error: '' };
}

export function loadAllBrokerFailure(error: string): BrokerAction {
    return { type: types.LOAD_ALL_BROKERS_FAILURE, brokers: [], error: error };
}

export function loadAllBrokers() {
    // tslint:disable-next-line:no-any
    return (dispatch: Dispatch<any>) => {
        dispatch(loadAllBrokersStarted());
        api.getBrokers().subscribe(
            brokers => dispatch(loadAllBrokersSuccess(brokers)),
            error => dispatch(loadAllBrokerFailure(error))
        );
    };
}