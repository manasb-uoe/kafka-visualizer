import * as React from 'react';
import Broker from '../../domain/Broker';

interface BrokerListItemProps {
    broker: Broker;
}

export default function BrokerListItem({ broker }: BrokerListItemProps) {
    return (
        <div className="sidebarListItem selectable">
            <div>
                <i className="fa fa-server" aria-hidden="true" />
                <span style={{ paddingLeft: '10px' }}>{broker.hostname}
                    <span style={{ paddingLeft: '3px', paddingRight: '3px' }}>:</span>
                    <span className="text-danger">{broker.port}</span></span>
            </div>
            <div className="text-primary" style={{ alignSelf: 'flex-end' }}>{broker.id}</div>
        </div>
    );
}