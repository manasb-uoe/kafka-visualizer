import * as React from 'react';
import Topic from '../../domain/Topic';

interface ITopicListItemProps {
    topic: Topic;
    isSelected: boolean;
    onClick: () => void;
}

export default function TopicListItem({ topic, isSelected, onClick }: ITopicListItemProps) {
    return (
        <div onClick={onClick} className={'sidebarListItem pointable selectable ' + (isSelected ? 'selected' : '')}>
            <div>
                <i className="fa fa-rss" aria-hidden="true" />
                <span style={{ paddingLeft: '10px' }}>{topic.name}</span>
            </div>
            <div className="text-primary" style={{ alignSelf: 'flex-end' }}>{topic.numPartitions}</div>
        </div>
    );
}