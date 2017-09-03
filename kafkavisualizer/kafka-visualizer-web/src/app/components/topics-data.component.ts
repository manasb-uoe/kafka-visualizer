import {Component, EventEmitter, Input, Output} from "@angular/core";
import {KafkaTopic} from "../domain/KafkaTopic";
import {ApiService} from "../services/api.service";
import {TopicMessage} from "../domain/TopicMessage";
import {TopicPartition} from "../domain/TopicPartition";

@Component({
    selector: "topic-data",
    template: `
        <div class="card">
            <div *ngIf="selectedTopic" class="card-header"
                 style="display: flex; align-items: center; justify-content: space-between; flex-direction: row">
                <h6 style="margin-bottom: 0;">
                    Showing messages for <span class="text-primary">{{selectedTopic.name}}</span>
                </h6>
                <div style="align-self: flex-end">
                    <div style="padding-right: 10px; display: inline;">Partition:</div>
                    <select [(ngModel)]="selectedPartition" style="display: inline; width: 100px;"
                            class="form-control">
                        <option *ngFor="let partition of getPartitionsList()">{{partition}}</option>
                    </select>
                </div>
            </div>
            <h6 *ngIf="!selectedTopic" class="card-header">No Topic Selected</h6>
            <ul *ngIf="topicMessages.length > 0" class="list-group list-group-flush">
                <collapsible-item *ngFor="let message of topicMessages">
                    <div item-header>
                        <span class="text-primary" style="font-weight: bold">[{{message.offset}}]</span> - <span
                            class="text-success">{{message.timestamp | date:'dd MMM yyyy HH:mm'}}</span>
                        <div>{{message.value}}</div>
                    </div>
                    <div item-body>
                        <pre [innerHtml]="tryParseJson(message.value) | prettyjson:2"></pre>
                    </div>
                </collapsible-item>
            </ul>
            <div *ngIf="selectedTopic && topicMessages.length == 0 && !isLoading" class="card-body">
                <div>No messages found</div>
            </div>
            <div *ngIf="isLoading" class="card-body">
                <div>Loading...</div>
            </div>
        </div>
    `,
    styles: [`
    `]
})
export class TopicsDataComponent {

    public topicMessages: Array<TopicMessage> = [];
    public isLoading: boolean;
    @Output() public onTopicPartitionSelected = new EventEmitter();

    private _selectedTopic: KafkaTopic;
    private _selectedPartition: number;

    public constructor(private apiService: ApiService) {
    }

    @Input()
    public set selectedTopic(topic: KafkaTopic) {
        this._selectedTopic = topic;
        this._selectedPartition = 0;

        this.onTopicOrPartitionChanged();
    }

    public get selectedTopic() {
        return this._selectedTopic;
    }

    public set selectedPartition(partition: number) {
        this._selectedPartition = partition;

        this.onTopicOrPartitionChanged();
    }

    public get selectedPartition() {
        return this._selectedPartition;
    }

    public tryParseJson(content: string) {
        try {
            return JSON.parse(content);
        } catch (e) {
            return content;
        }
    }

    public getPartitionsList(): Array<number> {
        const partitions = [];
        for (let i = 0; i < this.selectedTopic.numPartitions; i++) {
            partitions.push(i);
        }

        return partitions;
    }

    private onTopicOrPartitionChanged() {
        this.isLoading = true;
        this.topicMessages.length = 0;

        this.onTopicPartitionSelected.emit(new TopicPartition(this.selectedTopic, this.selectedPartition));

        this.apiService.getTopicData(this.selectedTopic, this.selectedPartition).subscribe(topicMessages => {
            topicMessages.forEach(message => this.topicMessages.push(message));
            this.isLoading = false;
        });
    }

}
