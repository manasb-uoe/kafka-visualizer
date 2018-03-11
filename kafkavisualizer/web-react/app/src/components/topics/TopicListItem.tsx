import * as React from 'react';
import Topic from '../../domain/Topic';

interface ITopicListItemProps {
    topic: Topic;
}

export default function TopicListItem({ topic }: ITopicListItemProps) {
    return (
        <div className="sidebarListItem pointable selectable">
            <div>
                <i className="fa fa-rss" aria-hidden="true" />
                <span style={{ paddingLeft: '10px' }}>{topic.name}</span>
            </div>
            <div className="text-primary" style={{ alignSelf: 'flex-end' }}>{topic.numPartitions}</div>
        </div>
    );
}