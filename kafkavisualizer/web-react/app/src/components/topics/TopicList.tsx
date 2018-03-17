import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { IAppState, ITopicsState } from '../../reducers/initialState';
import * as topicActions from '../../actions/topicActions';
import TopicListItem from './TopicListItem';
import Topic from '../../domain/Topic';
import * as _ from 'lodash';

interface ITopicListProps {
    topics: ITopicsState;
    loadAllTopics: () => void;
    selectTopic: (topic: Topic) => topicActions.SelectTopicAction;
}

export class TopicList extends React.Component<ITopicListProps, {}> {

    componentDidMount() {
        this.props.loadAllTopics();
    }

    render() {
        const topicsList = this.props.topics.items.map((topic, index) => {
            return (
                <TopicListItem
                    key={index}
                    topic={topic}
                    isSelected={_.isEqual(topic, this.props.topics.selectedTopic)}
                    onClick={() => {this.props.selectTopic(topic); }}
                />
            );
        });

        return (
            <div>
                <div className="sidebarHeader">Topics</div>
                {this.props.topics.isLoading && <div className="sidebarListItem">Loading...</div>}
                {!this.props.topics.isLoading && this.props.topics.items.length === 0
                    && <div className="sidebarListItem">No topics found</div>}
                <div>{topicsList}</div>
            </div>
        );
    }
}

function mapStateToProps(state: IAppState) {
    return {
        topics: state.topics
    };
}

// tslint:disable-next-line:no-any
function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        loadAllTopics: () => dispatch(topicActions.loadAllTopics()),
        selectTopic: (topic: Topic) => dispatch(topicActions.selectTopic(topic))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicList);