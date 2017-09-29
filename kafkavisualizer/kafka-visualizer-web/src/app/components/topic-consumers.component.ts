import {Component, Input} from "@angular/core";
import {ApiService} from "../services/api.service";
import {Consumer} from "../domain/Consumer";
import {KafkaTopic} from "../domain/KafkaTopic";

@Component({
    selector: "topic-consumers",
    template: `
        <div *ngIf="selectedTopic">
            <div class="pageHeaderContainer">
                <h6 class="pageHeader"
                    style="display: flex; align-items: center; justify-content: space-between; flex-direction: row">
                    <div>Showing messages on partition <span class="text-primary">{{selectedTopic.numPartitions}}</span> of <span class="text-primary">{{selectedTopic.name}}</span></div>
                    <div style="align-self: flex-end">
                        <div style="padding-right: 10px; display: inline;">Partition:</div>
                        <select [(ngModel)]="selectedPartition" style="display: inline; width: 100px;"
                                class="form-control form-control-sm">
                            <option *ngFor="let partition of getPartitionsList()">{{partition}}</option>
                        </select>
                    </div>
                </h6>
            </div>

            <ul *ngIf="consumers.length > 0" class="list-group" style="border-bottom: 1px solid rgba(0,0,0,.125);">
                <div class="list-group-item customListGroupItem" *ngFor="let consumer of consumers">
                    <div>
                        <div><span class="text-danger">Consumer ID: </span> {{consumer.consumerId}}</div>
                        <div><span class="text-danger">Group ID: </span> {{consumer.groupId}}</div>
                    </div>
                    <div>
                        <div class="text-danger">Assignments:</div>
                        <div style="padding-left: 20px;"
                             *ngFor="let assignment of consumer.assignments">
                            <div><span class="text-success">Topic: </span> {{assignment.topic}}</div>
                            <div><span class="text-success">Partition: </span> {{assignment.partition}}</div>
                        </div>
                    </div>
                </div>
            </ul>

            <div *ngIf="selectedTopic && consumers.length == 0 && !isLoading" style="margin-top: 10px;">
                <div>No consumers found</div>
            </div>

            <div *ngIf="isLoading" style="margin-top: 10px;">
                <div>Loading...</div>
            </div>
        </div>

        <div *ngIf="!selectedTopic" style="margin-top: 15px;">Please select a topic</div>
    `
})
export class TopicConsumersComponent {

    public consumers: Array<Consumer> = [];
    public isLoading: boolean;
    private _selectedPartition: number;
    private _selectedTopic: KafkaTopic;

    public constructor(private apiService: ApiService) {
    }

    @Input()
    public set selectedTopic(topic: KafkaTopic) {
        this._selectedTopic = topic;
        this._selectedPartition = 0;
        this.consumers.length = 0;
        this.isLoading = true;

        this.onTopicOrPartitionChanged();
    }

    public get selectedTopic() {
        return this._selectedTopic;
    }

    public get selectedPartition(): number {
        return this._selectedPartition;
    }

    public set selectedPartition(value: number) {
        this._selectedPartition = value;

        this.onTopicOrPartitionChanged();
    }

    public getPartitionsList(): Array<number> {
        const partitions = [];
        for (let i = 0; i < this.selectedTopic.numPartitions; i++) {
            partitions.push(i);
        }

        return partitions;
    }

    private onTopicOrPartitionChanged(): void {
        this.isLoading = true;

        this.apiService.getTopicConsumers(this.selectedTopic, this.selectedPartition).subscribe(
          consumers => {
            consumers.forEach(consumer => this.consumers.push(consumer));

            this.isLoading = false;
        });
    }
}
