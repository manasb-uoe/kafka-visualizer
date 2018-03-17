import * as React from 'react';
import Topic from '../../domain/Topic';
import StringUtils from '../../util/StringUtils';

interface ITopicListItemProps {
    topic: Topic;
    searchTerm: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function TopicListItem({ topic, isSelected, searchTerm, onClick }: ITopicListItemProps) {
    return (
        <div onClick={onClick} className={'sidebarListItem pointable selectable ' + (isSelected ? 'selected' : '')}>
            <div>
                <i className="fa fa-rss" aria-hidden="true" />
                <span style={{ paddingLeft: '10px' }} dangerouslySetInnerHTML={{__html: StringUtils.markSearchTermInString(topic.name, searchTerm)}} />
            </div>
            <div className="text-primary" style={{ alignSelf: 'flex-end' }}>{topic.numPartitions}</div>
        </div>
    );
}