import { KafkaTopic } from "../domain/KafkaTopic";
import { ApiService } from "../services/api.service";
import { TopicMessage } from "../domain/TopicMessage";
import { StringUtils } from "../utils/StringUtils";
import { Subscription } from "rxjs/Subscription";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "topic-data",
  template: `
        <div *ngIf="selectedTopic">
            <div class="pageHeaderContainer">
                <h6 class="pageHeader"
                    style="display: flex; align-items: center; justify-content: space-between; flex-direction: row">
                    <div>Showing messages on partition <span class="text-primary">{{selectedTopic.numPartitions}}</span>
                        of <span class="text-primary">{{selectedTopic.name}}</span></div>
                    <div style="align-self: flex-end">
                        <div style="padding-right: 10px; display: inline;">Partition:</div>
                        <select [(ngModel)]="selectedPartition" style="display: inline; width: 100px;"
                                class="form-control form-control-sm">
                            <option *ngFor="let partition of getPartitionsList()">{{partition}}</option>
                        </select>
                    </div>
                </h6>
            </div>

            <div style="margin-bottom: 10px; display: flex; flex-direction: row; margin-bottom: 10px;">
                <button (click)="onPublishButtonClicked.emit(selectedTopic)" class="btn btn-success btn-sm pointable"
                 style="margin-right: 10px;">Publish Message</button>
                <input (keyup.enter)="onSearch()" [(ngModel)]="searchTerm"
                class="form-control form-control-sm"
                placeholder="Search">
            </div>

            <ul *ngIf="!isLoading && filteredTopicMessages.length > 0" class="list-group"
                style="border-bottom: 1px solid rgba(0,0,0,.125);">
                <collapsible-item *ngFor="let message of filteredTopicMessages">
                    <div item-header>
                        <span class="text-primary" style="font-weight: bold">[{{message.offset}}]</span> - <span
                            class="text-success">{{message.timestamp | date:'dd MMM yyyy HH:mm'}}</span>
                        <div [innerHtml]="markSearchTermInString(message.value)" style="word-wrap: break-word"></div>
                    </div>
                    <div item-body>
                        <pre [innerHtml]="tryParseJson(message.value) | prettyjson:2"></pre>
                    </div>
                </collapsible-item>
            </ul>

            <div *ngIf="filteredTopicMessages.length == 0 && !isLoading" style="margin-top: 10px;">No messages found
            </div>
            <div *ngIf="isLoading" style="margin-top: 10px;">Loading...</div>
        </div>
        <div *ngIf="!selectedTopic" style="margin-top: 15px;">Please select a topic</div>
    `,
  styles: [
    `
    `
  ]
})
export class TopicsDataComponent {
  @Output() public onPublishButtonClicked = new EventEmitter<KafkaTopic>();
  public topicMessages: Array<TopicMessage> = [];
  public isLoading: boolean;
  public searchTerm: string;
  public filteredTopicMessages: Array<TopicMessage> = [];

  private _selectedTopic: KafkaTopic;
  private _selectedPartition: number;
  private _currentSubscription: Subscription;

  public constructor(private apiService: ApiService) {}

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

  public markSearchTermInString(inputString: string): string {
    return StringUtils.markSearchTermInString(inputString, this.searchTerm);
  }

  public onSearch(): void {
    // this clears the subscribtion so that we only subscribe to new messages containing the search term
    this.onTopicOrPartitionChanged();

    this.apiService
      .getTopicDataUnVersioned(
        this.selectedTopic,
        this.selectedPartition,
        this.searchTerm
      )
      .subscribe(this.onTopicMessagesChanged.bind(this));
  }

  private filterTopicMessages(): void {
    this.filteredTopicMessages.length = 0;

    if (!this.searchTerm || this.searchTerm.length === 0) {
      this.topicMessages.forEach(message =>
        this.filteredTopicMessages.push(message)
      );
      return;
    }

    this.topicMessages
      .filter(message =>
        message.value.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .forEach(message => this.filteredTopicMessages.push(message));
  }

  private onTopicOrPartitionChanged(): void {
    this.isLoading = true;
    this.topicMessages.length = 0;

    if (this._currentSubscription) {
      this._currentSubscription.unsubscribe();
    }

    this._currentSubscription = this.apiService
      .getTopicData(this.selectedTopic, this.selectedPartition, this.searchTerm)
      .subscribe(this.onTopicMessagesChanged.bind(this));
  }

  private onTopicMessagesChanged(newMessages: TopicMessage[]) {
    this.topicMessages.length = 0;
    newMessages.forEach(message => this.topicMessages.push(message));
    this.filteredTopicMessages = this.topicMessages;

    this.isLoading = false;
  }
}
