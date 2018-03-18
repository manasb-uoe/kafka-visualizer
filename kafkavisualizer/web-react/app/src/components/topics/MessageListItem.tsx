import * as React from 'react';
import TopicMessage from '../../domain/TopicMessage';
import * as vkbeautify from 'vkbeautify';

export interface MessageListItemProps {
    message: TopicMessage;
}

export default function MessageListItem({ message }: MessageListItemProps) {
    return (
        <div className="selectable" style={{padding: '5px'}}>
            <span className="text-primary" style={{ fontWeight: 'bold' }}>[{message.offset}]</span> -
            <span className="text-success">{message.timestamp}</span> - <span className="text-danger">{message.key}</span>
            <pre style={{ wordWrap: 'break-word' }}>{prettifyMessage(message.value)}</pre>
        </div>
    );
}

function prettifyMessage(message: string) {
    if (isJson(message)) {
        return vkbeautify.json(message);
    } else if (isXml(message)) {
        return vkbeautify.xml(message);
    } else {
        return message;
    }
}

function isJson(text: string): boolean {
    try {
        JSON.parse(text);
        return true;
    } catch (e) {
        return false;
    }
}

function isXml(text: string): boolean {
    return text.startsWith('<') && text.endsWith('>');
}
