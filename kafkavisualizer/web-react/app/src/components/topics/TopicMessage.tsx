import * as React from 'react';
import { IAppState, TopicMessagesState } from '../../reducers/initialState';
import Topic from '../../domain/Topic';
import { connect, Dispatch } from 'react-redux';
import { SelectPartitionAction, selectPartition, loadTopicMessages, LoadTopicMessagesAction } from '../../actions/topicActions';
import * as _ from 'lodash';
import MessageListItem from './MessageListItem';

interface TopicMessagesProps {
    messages: TopicMessagesState;
    selectedTopic: Topic;
    selectedPartition: number;
    selectPartition: (partition: number) => SelectPartitionAction;
    loadMessages: (topic: Topic, partition: number, query: string) => LoadTopicMessagesAction;
}

export class TopicMessages extends React.Component<TopicMessagesProps, {}> {

    private searchTerm: string = '';

    componentWillReceiveProps(nextProps: TopicMessagesProps) {
        if (nextProps.selectedTopic && nextProps.selectedPartition !== Number.MIN_VALUE &&
            (!_.isEqual(this.props.selectedTopic, nextProps.selectedTopic) || this.props.selectedPartition !== nextProps.selectedPartition)) {
            this.props.loadMessages(nextProps.selectedTopic, nextProps.selectedPartition, this.searchTerm);
        }
    }

    render() {
        const messages = this.props.messages.items.map((message, index) => <MessageListItem key={index} message={message} searchTerm={this.searchTerm} />);

        return (
            <div>
                {!this.props.selectedTopic && <div style={{ marginTop: '15px' }}>Not topic selected</div>}
                {this.props.selectedTopic && this.props.selectedPartition !== Number.MIN_VALUE && <div className="pageHeaderContainer">
                    <h6 className="pageHeader" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <div>Showing messages on partition <span className="text-primary">{this.props.selectedPartition} </span>
                            of <span className="text-primary">{this.props.selectedTopic.name}</span></div>
                        <div style={{ alignSelf: 'flex-end' }}>
                            <div style={{ paddingRight: '10px', display: 'inline' }}>Partition:</div>
                            <select onChange={(event) => this.onPartitionChanged(event)} style={{ display: 'inline', width: '100px' }} className="form-control form-control-sm">
                                {this.getPartitionOptionsList()}
                            </select>
                        </div>
                    </h6 >
                </div >}

                {this.props.selectedTopic &&
                    <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row' }}>
                        <button className="btn btn-success btn-sm pointable" style={{ marginRight: '10px' }}>Publish Message</button>
                        <input onChange={(event) => this.onSearchTermChanged(event.target.value)} onKeyPress={(event) => this.onKeyPressedInSearch(event)} className="form-control form-control-sm" placeholder="Search" />
                    </div>}

                {this.props.messages.isLoading && <div style={{ marginTop: '10px' }}>Loading...</div>}
                {this.props.selectedTopic && !this.props.messages.isLoading && this.props.messages.items.length === 0 && <div style={{ marginTop: '10px' }}>No messages found</div>}
                {this.props.messages.items.length !== 0 && <div className="list-group">{messages}</div>}
            </div >
        );
    }

    private onSearchTermChanged(searchTerm: string) {
        this.searchTerm = searchTerm;
    }

    private onKeyPressedInSearch(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            this.props.loadMessages(this.props.selectedTopic, this.props.selectedPartition, this.searchTerm);
        }
    }

    private onPartitionChanged(event: React.ChangeEvent<HTMLSelectElement>): void {
        this.props.selectPartition(+event.target.value);
    }

    private getPartitionOptionsList(): JSX.Element[] {
        if (!this.props.selectedTopic) {
            return [];
        }

        const partitions = [];
        for (let i = 0; i < this.props.selectedTopic.numPartitions; i++) {
            partitions.push((<option key={i}>{i}</option>));
        }

        return partitions;
    }

}

function mapStateToProps(state: IAppState) {
    return {
        messages: state.topicMessages,
        selectedTopic: state.topics.selectedTopic,
        selectedPartition: state.topics.selectedPartition
    };
}

// tslint:disable-next-line:no-any
function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        selectPartition: (partition: number) => dispatch(selectPartition(partition)),
        loadMessages: (topic: Topic, partition: number, query: string) => dispatch(loadTopicMessages(topic, partition, query))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicMessages);
