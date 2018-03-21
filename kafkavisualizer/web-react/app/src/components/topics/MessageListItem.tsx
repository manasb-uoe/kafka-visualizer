import * as React from 'react';
import TopicMessage from '../../domain/TopicMessage';
import * as vkbeautify from 'vkbeautify';
import StringUtils from '../../util/StringUtils';

export interface MessageListItemProps {
    message: TopicMessage;
    searchTerm: string;
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
            <div style={{marginBottom: '10px', borderBottom: '1px solid var(--borderColor)'}}>
                <div className="selectable pointable" onClick={() => this.onClick()}>
                    <span className="text-primary">({this.props.message.offset})</span> -
                <span className="text-success">{this.props.message.timestamp}</span> - <span className="text-danger">{this.props.message.key}</span>
                    <div dangerouslySetInnerHTML={{__html: StringUtils.markSearchTermInString(this.props.message.value, this.props.searchTerm)}} style={{ wordWrap: 'break-word' }}/>
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
