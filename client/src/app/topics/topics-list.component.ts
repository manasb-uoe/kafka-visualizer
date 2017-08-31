import {Component, EventEmitter, Inject, OnInit, Output} from "@angular/core";
import {ApiService} from "./api.service";
import {KafkaTopic} from "../domain/KafkaTopic";
import {DOCUMENT} from "@angular/platform-browser";

@Component({
    selector: "topics-list",
    template: `
        <div class="card">
            <h6 class="card-header">Topics</h6>
            <ul class="list-group list-group-flush">
                <li *ngFor="let topic of kafkaTopics" class="list-group-item pointable selectable" 
                    [class.selected]="topic.isSelected" (click)="selectTopic(topic)">
                    <div>{{topic.name}}</div>
                    <div class="text-primary">Partitions: {{topic.numPartitions}}</div>
                </li>
            </ul>
        </div>
    `
})
export class TopicsListComponent implements OnInit {

    public kafkaTopics: Array<KafkaTopic> = [];
    @Output() public onTopicSelected = new EventEmitter();

    public constructor(private apiService: ApiService, @Inject(DOCUMENT) private document: Document) {}

    public ngOnInit(): void {
        this.apiService.getTopics().subscribe(topics => this.kafkaTopics = topics);
    }

    public selectTopic(topic: KafkaTopic): void {
        this.kafkaTopics.forEach(t => t.isSelected = false);
        topic.isSelected = true;

        this.onTopicSelected.emit(topic);

        this.document.body.scrollTop = 0;
    }

}