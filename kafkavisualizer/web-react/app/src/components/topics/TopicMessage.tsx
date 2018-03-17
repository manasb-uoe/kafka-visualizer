import * as React from 'react';
import { IAppState, TopicMessagesState } from '../../reducers/initialState';
import Topic from '../../domain/Topic';
import { connect } from 'react-redux';

interface TopicMessagesProps {
    messages: TopicMessagesState;
    selectedTopic?: Topic;
    selectedPartition?: number;
}

export class TopicMessages extends React.Component<TopicMessagesProps, {}> {

    render() {
        return (
            <div>
                <p>{!this.props.selectedTopic && 'No topic selected'}</p>
                <p>{this.props.selectedTopic && this.props.selectedTopic.name}</p>
            </div>
        );
    }

}

function mapStateToProps(state: IAppState): TopicMessagesProps {
    return {
        messages: state.topicMessages,
        selectedTopic: state.topics.selectedTopic,
        selectedPartition: state.topics.selectedPartition
    };
}

export default connect(mapStateToProps)(TopicMessages);
