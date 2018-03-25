import * as React from 'react';
import { IAppState, ConsumersState } from '../../reducers/initialState';
import Topic from '../../domain/Topic';
import { connect, Dispatch } from 'react-redux';
import { LoadTopicConsumersAction, loadTopicConsumers } from '../../actions/topicActions';
import SelectedTopicPartitionInfo from './SelectedTopicPartitionInfo';
import * as _ from 'lodash';

interface TopicConsumersProps {
    consumers: ConsumersState;
    selectedTopic: Topic;
    selectedPartition: number;
    loadConsumers: (topic: Topic, partition: number) => LoadTopicConsumersAction;
}

export class TopicConsumers extends React.Component<TopicConsumersProps, {}> {

    componentWillReceiveProps(nextProps: TopicConsumersProps) {
        if (nextProps.selectedTopic && nextProps.selectedPartition !== Number.MIN_VALUE &&
            (!_.isEqual(this.props.selectedTopic, nextProps.selectedTopic) || this.props.selectedPartition !== nextProps.selectedPartition)) {
            this.props.loadConsumers(nextProps.selectedTopic, nextProps.selectedPartition);
        }
    }

    render() {
        const consumers = this.props.consumers.items.map((consumer, consumerIndex) => {
            return (
                <div key={consumerIndex} className="list-group-item">
                    <div>
                        <div><span className="text-danger">Consumer ID: </span> {consumer.consumerId}</div>
                        <div><span className="text-danger">Group ID: </span> {consumer.groupId}</div>
                    </div>
                    <div>
                        <div className="text-danger">Assignments:</div>
                        {consumer.assignments.map((assignment, assignmentIndex) => {
                            return (
                                <div key={assignmentIndex} style={{ paddingLeft: '20px' }}>
                                    <div><span className="text-success">Topic: </span> {assignment.topic}</div>
                                    <div><span className="text-success">Partition: </span> {assignment.partition}</div>
                                </div>
                            );  
                        })}
                    </div >
                </div>
            );
        });

        return (
            <div>
                <SelectedTopicPartitionInfo />
                {!this.props.selectedTopic && <div style={{ marginTop: '15px' }}>Not topic selected</div>}
                {this.props.consumers.isLoading && <div style={{ marginTop: '10px' }}>Loading...</div>}
                {!this.props.consumers.error && this.props.selectedTopic && !this.props.consumers.isLoading && this.props.consumers.items.length === 0 && <div style={{ marginTop: '10px' }}>No consumers found</div>}
                {this.props.consumers.items.length !== 0 && <div className="list-group" style={{ borderBottom: '1px solid rgba(0,0,0,.125)', }}>{consumers}</div>}
                {this.props.consumers.error && <div className="text-danger" style={{ marginTop: '10px' }}><strong>Error: </strong>{this.props.consumers.error}</div>}
            </div >
        );
    }
}

function mapStateToProps(state: IAppState) {
    return {
        consumers: state.consumers,
        selectedTopic: state.topics.selectedTopic,
        selectedPartition: state.topics.selectedPartition
    };
}

// tslint:disable-next-line:no-any
function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        loadConsumers: (topic: Topic, partition: number) => dispatch(loadTopicConsumers(topic, partition))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicConsumers);