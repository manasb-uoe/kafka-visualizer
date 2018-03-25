import * as React from 'react';
import { IAppState, TopicMessagesState } from '../../reducers/initialState';
import Topic from '../../domain/Topic';
import { connect, Dispatch } from 'react-redux';
import { loadTopicMessages, LoadTopicMessagesAction } from '../../actions/topicActions';
import * as _ from 'lodash';
import MessageListItem from './MessageListItem';
import { MessagePublisher } from './MessagePublisher';
import SelectedTopicPartitionInfo from './SelectedTopicPartitionInfo';

interface TopicMessagesProps {
    messages: TopicMessagesState;
    selectedTopic: Topic;
    selectedPartition: number;
    loadMessages: (topic: Topic, partition: number, query: string) => LoadTopicMessagesAction;
}

export class TopicMessages extends React.Component<TopicMessagesProps, {}> {

    private searchTerm: string = '';
    private messagePublisher: MessagePublisher | null;

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
                <SelectedTopicPartitionInfo />

                {this.props.selectedTopic &&
                    <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row' }}>
                        <button onClick={(event) => this.messagePublisher && this.messagePublisher.show()} className="btn btn-success btn-sm pointable" style={{ marginRight: '10px' }}>Publish Message</button>
                        <input onChange={(event) => this.onSearchTermChanged(event.target.value)} onKeyPress={(event) => this.onKeyPressedInSearch(event)} className="form-control form-control-sm" placeholder="Search" />
                    </div>}

                {this.props.messages.isLoading && <div style={{ marginTop: '10px' }}>Loading...</div>}
                {this.props.selectedTopic && !this.props.messages.isLoading && this.props.messages.items.length === 0 && <div style={{ marginTop: '10px' }}>No messages found</div>}
                {this.props.messages.items.length !== 0 && <div className="list-group">{messages}</div>}

                <MessagePublisher ref={(ref) => this.messagePublisher = ref} topic={this.props.selectedTopic} partition={this.props.selectedPartition} />
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
        loadMessages: (topic: Topic, partition: number, query: string) => dispatch(loadTopicMessages(topic, partition, query))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicMessages);
