import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { IAppState, BrokersState } from '../../reducers/initialState';
import * as brokerActions from '../../actions/brokerActions';
import BrokerListItem from './BrokerListItem';

interface BrokerListProps {
    brokers: BrokersState;
    // tslint:disable-next-line:no-any
    loadAllBrokers: any;
}

export class BrokerList extends React.Component<BrokerListProps, {}> {

    componentDidMount() {
        this.props.loadAllBrokers();
    }

    render() {
        const brokerList = this.props.brokers.items.map((broker, index) => {
            return (
                <BrokerListItem key={index} broker={broker} />
            );
        });

        return (
            <div>
                <div className="sidebarHeader">Brokers</div>
                {this.props.brokers.isLoading && <div className="sidebarListItem">Loading...</div>}
                {!this.props.brokers.isLoading && this.props.brokers.items.length === 0 
                    && <div className="sidebarListItem">No brokers found</div>}
                <div>{brokerList}</div>
            </div>
        );
    }
}

function mapStateToProps(state: IAppState) {
    return {
        brokers: state.brokers
    };
}

// tslint:disable-next-line:no-any
function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        loadAllBrokers: () => dispatch(brokerActions.loadAllBrokers())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokerList);