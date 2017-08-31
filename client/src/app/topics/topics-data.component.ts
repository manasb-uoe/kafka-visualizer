import {Component, EventEmitter, Input, Output} from "@angular/core";
import {KafkaTopic} from "../domain/KafkaTopic";
import {ApiService} from "./api.service";
import {TopicMessage} from "../domain/TopicMessage";
import {TopicPartition} from "../domain/TopicPartition";

@Component({
    selector: "topic-data",
    template: `
        <div class="card">
            <div *ngIf="selectedTopic" class="card-header">
                <h6>
                    Showing messages for <span class="text-primary">{{selectedTopic.name}}</span>
                </h6>
                <select class="form-control float-right">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
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
                        <pre [innerHtml]="tryParseJson(message.value) | prettyjson:3"></pre>
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

    public selectedPartition = 0;
    public topicMessages: Array<TopicMessage> = [];
    public isLoading: boolean;
    @Output() public onTopicPartitionSelected = new EventEmitter();

    private _selectedTopic: KafkaTopic;

    public constructor(private apiService: ApiService) {
    }

    @Input()
    public set selectedTopic(topic: KafkaTopic) {
        this._selectedTopic = topic;
        this.selectedPartition = 0;
        this.topicMessages.length = 0;
        this.isLoading = true;

        this.onTopicPartitionSelected.emit(new TopicPartition(topic, this.selectedPartition));

        this.apiService.getTopicData(this._selectedTopic, this.selectedPartition).subscribe(topicMessages => {
            topicMessages.forEach(message => this.topicMessages.push(message));
            this.isLoading = false;
        });
    }

    public get selectedTopic() {
        return this._selectedTopic;
    }

    public tryParseJson(content: string) {
        try {
            return JSON.parse(content);
        } catch (e) {
            return content;
        }
    }

}