import * as React from 'react';
import { mount } from 'enzyme';
import { BrokerList } from './BrokerList';
import { BrokersState } from '../../reducers/initialState';
import Broker from '../../domain/Broker';
import BrokerListItem from './BrokerListItem';

describe('<BrokerList />', () => {

    // tslint:disable-next-line:no-any
    let loadAllBrokers: any;

    beforeEach(() => {
        loadAllBrokers = jest.fn();
    });

    it('should load brokers on mount', () => {
        const brokersState: BrokersState = { isLoading: false, items: [], error: '' };

        mount(<BrokerList brokers={brokersState} loadAllBrokers={loadAllBrokers} />);

        expect(loadAllBrokers.mock.calls.length).toBe(1);
    });

    it('should show loading text when loading topics', () => {
        const brokersState: BrokersState = { isLoading: true, items: [], error: '' };

        const wrapper = mount(<BrokerList brokers={brokersState} loadAllBrokers={loadAllBrokers} />);

        const listItems = wrapper.find('.sidebarListItem');
        expect(listItems.length).toBe(1);
        expect(listItems.get(0).props.children).toEqual('Loading...');
    });

    it('should not show any brokers if none exist', () => {
        const brokersState: BrokersState = { isLoading: false, items: [], error: '' };

        const wrapper = mount(<BrokerList brokers={brokersState} loadAllBrokers={loadAllBrokers} />);

        const listItems = wrapper.find('.sidebarListItem');
        expect(listItems.length).toBe(1);
        expect(listItems.get(0).props.children).toEqual('No brokers found');
    });

    it('should show list of brokers', () => {
        const brokerItems: Broker[] = [
            { hostname: 'hostname1', id: 1, port: 1234 },
            { hostname: 'hostname2', id: 2, port: 4321 }
        ];
        const brokersState: BrokersState = { isLoading: false, items: brokerItems, error: '' };

        const wrapper = mount(<BrokerList brokers={brokersState} loadAllBrokers={loadAllBrokers} />);

        const listItems = wrapper.find(BrokerListItem);
        expect(listItems.length).toBe(2);
        expect(listItems.at(0).find('span').at(0).text()).toEqual(brokerItems[0].hostname + ':' + brokerItems[0].port);
        expect(listItems.at(1).find('span').at(0).text()).toEqual(brokerItems[1].hostname + ':' + brokerItems[1].port);
    });
});