import * as React from 'react';
import TopicMessage from '../../domain/TopicMessage';
import * as vkbeautify from 'vkbeautify';

export interface MessageListItemProps {
    message: TopicMessage;
}

interface MessageListItemState {
    isCollapsed: boolean;
}

export default class MessageListItem extends React.Component<MessageListItemProps, MessageListItemState> {

    // tslint:disable-next-line:no-any
    constructor(props: MessageListItemProps, context: any) {
        super(props, context);
        this.state = { isCollapsed: true };
    }

    render() {
        return (
            <div style={{marginBottom: '10px'}}>
                <div className="pointable" style={{ padding: '5px' }} onClick={() => this.onClick()}>
                    <span className="text-primary" style={{ fontWeight: 'bold' }}>[{this.props.message.offset}]</span> -
                <span className="text-success">{this.props.message.timestamp}</span> - <span className="text-danger">{this.props.message.key}</span>
                    <div style={{ wordWrap: 'break-word' }}>{this.props.message.value}</div>
                </div>
                <div>
                    {!this.state.isCollapsed && <pre>{prettifyMessage(this.props.message.value)}</pre>}
                </div>
            </div>
        );
    }

    private onClick() {
        this.setState((prevState, props) => {
            return { isCollapsed: !prevState.isCollapsed };
        });
    }
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
