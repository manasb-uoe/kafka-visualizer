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

interface TopicListState {
    searchTerm: string;
}

export class TopicList extends React.Component<ITopicListProps, TopicListState> {

    // tslint:disable-next-line:no-any
    constructor(props: ITopicListProps, context: any) {
        super(props, context);
        this.state = {
            searchTerm: '',
        };
    }

    componentDidMount() {
        this.props.loadAllTopics();
    }

    render() {
        const filteredTopics = this.state.searchTerm.length > 0
            ? this.props.topics.items.filter(topic => topic.name.toLowerCase().trim().includes(this.state.searchTerm))
            : this.props.topics.items;

        const topicsList = filteredTopics.map((topic, index) => {
            return (
                <TopicListItem
                    key={index}
                    topic={topic}
                    searchTerm={this.state.searchTerm}
                    isSelected={_.isEqual(topic, this.props.topics.selectedTopic)}
                    onClick={() => { this.props.selectTopic(topic); }}
                />
            );
        });

        return (
            <div>
                <div className="sidebarHeader">Topics</div>
                <input
                    onChange={(event) => this.onSearchTermChanged(event.target.value)}
                    placeholder="Search"
                    className="form-control form-control-sm"
                    style={{paddingLeft: '15px', paddingRight: '15px'}}
                />
                {this.props.topics.isLoading && <div className="sidebarListItem">Loading...</div>}
                {!this.props.topics.isLoading && filteredTopics.length === 0
                    && <div className="sidebarListItem">No topics found</div>}
                <div>{topicsList}</div>
            </div>
        );
    }

    private onSearchTermChanged(searchTerm: string) {
        this.setState({
            ...this.state,
            searchTerm: searchTerm.toLowerCase().trim()
        });
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