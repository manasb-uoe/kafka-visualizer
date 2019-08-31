import * as React from 'react';
import Topic from '../../domain/Topic';
import * as $ from 'jquery';
import RecordMetadata from '../../domain/RecordMetadata';
import api from '../../api/Api';

interface MessagePublisherProps {
    topic: Topic;
    partition: number;
}

interface MessagePublisherState {
    key: string;
    value: string;
    recordMetadata?: RecordMetadata;
    error?: string;
    isLoading: boolean;
}

export class MessagePublisher extends React.Component<MessagePublisherProps, MessagePublisherState> {

    // tslint:disable-next-line:no-any
    constructor(props: MessagePublisherProps, context: any) {
        super(props, context);
        this.state = {
            key: '',
            value: '',
            isLoading: false
        };
    }

    public show(): void {
        $('#publisherModal').modal({ show: true });
        $('#publisherModal').on('hidden.bs.modal', () => {
            this.clearForm();
        });
    }

    render() {
        if (this.props.topic && this.props.partition !== Number.MIN_VALUE) {
            return (
                <div className="modal fade" id="publisherModal" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Publish data to <span className="text-primary">{this.props.topic.name}</span>
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(event) => this.publishMessage(event)}>
                                    <div className="form-group">
                                        <input value={this.state.key} onChange={(event) => this.setState({ ...this.state, key: event.target.value })} name="key" placeholder="Key" className="form-control form-control-sm" required={true} />
                                    </div>
                                    <div className="form-group">
                                        <textarea value={this.state.value} onChange={(event) => this.setState({ ...this.state, value: event.target.value })} rows={8} name="value" placeholder="Value" className="form-control form-control-sm" required={true} />
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <button onClick={() => this.clearForm()} type="button" className="btn btn-primary btn-sm">Clear</button>
                                        <input disabled={this.state.isLoading} type="submit" style={{ marginLeft: '5px' }} className="btn btn-success btn-sm" value="Publish" />
                                    </div>
                                    {this.state.recordMetadata && (
                                        <div className="text-success" style={{ marginTop: '10px' }}>Message successfully posted to partition
                                        <strong> [{this.state.recordMetadata.partition}]</strong> at offset
                                        <strong> [{this.state.recordMetadata.offset}]</strong>
                                        </div>
                                    )}
                                    {this.state.error && (
                                        <div className="text-danger" style={{ marginTop: '10px' }}>{this.state.error}</div>
                                    )}
                                </form>
                            </div >
                        </div >
                    </div >
                </div >
            );
        } else {
            return null;
        }
    }

    private clearForm(): void {
        this.setState({
            ...this.state,
            key: '',
            value: '',
            recordMetadata: undefined,
            error: undefined
        });
    }

    private publishMessage(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        this.setState({...this.state, isLoading: true});
        api.publishTopicMessage(this.props.topic, this.state.key, this.state.value).subscribe(
            metadata => this.setState({ ...this.state, recordMetadata: metadata, isLoading: false }),
            error => this.setState({ ...this.state, error: error, isLoading: false })
        );
    }

}