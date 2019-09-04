import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { SelectPartitionAction, selectPartition } from '../../actions/topicActions';
import Topic from '../../domain/Topic';
import { IAppState } from '../../reducers/initialState';

interface SelectedTopicPartitionInfoProps {
    selectedTopic: Topic;
    selectedPartition: number;
    selectPartition: (partition: number) => SelectPartitionAction;
}

export class SelectedTopicPartitionInfo extends React.Component<SelectedTopicPartitionInfoProps, {}> {

    render() {
        return (
            <div>
                {this.props.selectedTopic && this.props.selectedPartition !== Number.MIN_VALUE && <div className="pageHeaderContainer">
                    <h6 className="pageHeader" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <div>Showing messages on partition <span className="text-primary">{this.props.selectedPartition} </span>
                            of <span className="text-primary">{this.props.selectedTopic.name}</span></div>
                        <div style={{ alignSelf: 'flex-end' }}>
                            <div style={{ paddingRight: '10px', display: 'inline' }}>Partition:</div>
                            <select onChange={(event) => this.onPartitionChanged(event)} style={{ display: 'inline', width: '100px' }} className="form-control form-control-sm">
                                {this.getPartitionOptionsList()}
                            </select>
                        </div>
                    </h6 >
                </div >}
            </div>
        );
    }

    private onPartitionChanged(event: React.ChangeEvent<HTMLSelectElement>): void {
        this.props.selectPartition(+event.target.value);
    }

    private getPartitionOptionsList(): JSX.Element[] {
        if (!this.props.selectedTopic) {
            return [];
        }

        const partitions = [];
        for (let i = 0; i < this.props.selectedTopic.numPartitions; i++) {
            partitions.push((<option key={i}>{i}</option>));
        }

        return partitions;
    }
}

function mapStateToProps(state: IAppState) {
    return {
        selectedTopic: state.topics.selectedTopic,
        selectedPartition: state.topics.selectedPartition
    };
}

// tslint:disable-next-line:no-any
function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        selectPartition: (partition: number) => dispatch(selectPartition(partition)),        
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedTopicPartitionInfo);