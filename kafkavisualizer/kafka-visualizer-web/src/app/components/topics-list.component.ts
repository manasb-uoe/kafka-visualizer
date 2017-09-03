import {Component, EventEmitter, Inject, OnInit, Output} from "@angular/core";
import {ApiService} from "../services/api.service";
import {KafkaTopic} from "../domain/KafkaTopic";
import {DOCUMENT} from "@angular/platform-browser";

@Component({
    selector: "topics-list",
    template: `
        <div class="card">
            <h6 class="card-header">
                <div>Topics</div>
                <input [ngModel]="searchTerm" (ngModelChange)="onSearchTermChanged($event)" class="form-control"
                       placeholder="Search" style="margin-top: 10px;">
            </h6>
            
            <ul class="list-group list-group-flush">
                <li *ngFor="let topic of filteredTopics" class="list-group-item pointable selectable"
                    [class.selected]="topic.isSelected" (click)="selectTopic(topic)">
                    <div [innerHtml]="getMarkedTopicName(topic.name)"></div>
                    <div class="text-primary">Partitions: {{topic.numPartitions}}</div>
                </li>
            </ul>
            
            <div class="card-body" *ngIf="filteredTopics.length === 0">No topics found</div>
        </div>
    `
})
export class TopicsListComponent implements OnInit {

    @Output() public onTopicSelected = new EventEmitter();
    public kafkaTopics: Array<KafkaTopic> = [];
    public searchTerm: string;
    public filteredTopics: Array<KafkaTopic> = [];

    public constructor(private apiService: ApiService, @Inject(DOCUMENT) private document: Document) {
    }

    public ngOnInit(): void {
        this.apiService.getTopics().subscribe(topics => {
            this.kafkaTopics.length = 0;
            topics.forEach(t => this.kafkaTopics.push(t));

            this.filterTopics();
        });
    }

    public selectTopic(topic: KafkaTopic): void {
        this.kafkaTopics.forEach(t => t.isSelected = false);
        topic.isSelected = true;

        this.onTopicSelected.emit(topic);

        this.scrollToTop();
    }

    public filterTopics(): void {
        this.filteredTopics.length = 0;

        if (!this.searchTerm || this.searchTerm.length === 0) {
            this.kafkaTopics.forEach(topic => this.filteredTopics.push(topic));
            return;
        }

        this.kafkaTopics
            .filter(topic => topic.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
            .forEach(topic => this.filteredTopics.push(topic));
    }

    public onSearchTermChanged(newValue: string): void {
        this.searchTerm = newValue;
        this.filterTopics();
    }

    public getMarkedTopicName(topicName: string): string {
        if (!this.searchTerm || this.searchTerm.length === 0) {
            return topicName;
        }

        let markedTopicName = "";

        const firstOccurrenceIndex = topicName.toLowerCase().indexOf(this.searchTerm.toLowerCase());

        for (let i=0; i<topicName.length; i++) {
            if (i === firstOccurrenceIndex) {
                markedTopicName += "<mark>";
            }

            if (i === firstOccurrenceIndex + this.searchTerm.length) {
                markedTopicName += "</mark>";
            }

            markedTopicName += topicName[i];
        }

        return markedTopicName;
    }

    private scrollToTop(): void {
        this.document.body.scrollTop = 0;
    }
}
