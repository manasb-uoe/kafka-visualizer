import {Component, EventEmitter, Input, Output} from "@angular/core";
import {KafkaTopic} from "../domain/KafkaTopic";
import {ApiService} from "../services/api.service";
import {TopicMessage} from "../domain/TopicMessage";
import {TopicPartition} from "../domain/TopicPartition";
import {StringUtils} from "../utils/StringUtils";

@Component({
  selector: "topic-data",
  template: `
    <div class="card">
      <div *ngIf="selectedTopic" class="card-header">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-direction: row">
          <div class="card-header-title" style="margin-bottom: 0;">
            Showing messages for <span class="text-primary">{{selectedTopic.name}}</span>
          </div>
          <div style="align-self: flex-end">
            <div style="padding-right: 10px; display: inline;">Partition:</div>
            <select [(ngModel)]="selectedPartition" style="display: inline; width: 100px;"
                    class="form-control form-control-sm">
              <option *ngFor="let partition of getPartitionsList()">{{partition}}</option>
            </select>
          </div>
        </div>
        <input [ngModel]="searchTerm" (ngModelChange)="onSearchTermChanged($event)" class="form-control form-control-sm"
               placeholder="Search" style="margin-top: 10px;">
      </div>
      <div *ngIf="!selectedTopic" class="card-header card-header-title">No Topic Selected</div>
      <ul *ngIf="filteredTopicMessages.length > 0" class="list-group list-group-flush">
        <collapsible-item *ngFor="let message of filteredTopicMessages">
          <div item-header>
            <span class="text-primary" style="font-weight: bold">[{{message.offset}}]</span> - <span
            class="text-success">{{message.timestamp | date:'dd MMM yyyy HH:mm'}}</span>
            <div [innerHtml]="markSearchTermInString(message.value)"></div>
          </div>
          <div item-body>
            <pre [innerHtml]="tryParseJson(message.value) | prettyjson:2"></pre>
          </div>
        </collapsible-item>
      </ul>
      <div *ngIf="selectedTopic && filteredTopicMessages.length == 0 && !isLoading" class="card-body">
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

  @Output() public onTopicPartitionSelected = new EventEmitter();
  public topicMessages: Array<TopicMessage> = [];
  public isLoading: boolean;
  public searchTerm: string;
  public filteredTopicMessages: Array<TopicMessage> = [];

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

  public onSearchTermChanged(newValue: string): void {
    this.searchTerm = newValue;
    this.filterTopicMessages();
  }

  public markSearchTermInString(inputString: string): string {
    return StringUtils.markSearchTermInString(inputString, this.searchTerm);
  }

  private filterTopicMessages(): void {
    this.filteredTopicMessages.length = 0;

    if (!this.searchTerm || this.searchTerm.length === 0) {
      this.topicMessages.forEach(message => this.filteredTopicMessages.push(message));
      return;
    }

    this.topicMessages
      .filter(message => message.value.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .forEach(message => this.filteredTopicMessages.push(message));
  }

  private onTopicOrPartitionChanged(): void {
    this.isLoading = true;
    this.topicMessages.length = 0;

    this.onTopicPartitionSelected.emit(new TopicPartition(this.selectedTopic, this.selectedPartition));

    this.apiService.getTopicData(this.selectedTopic, this.selectedPartition).subscribe(topicMessages => {
      topicMessages.forEach(message => this.topicMessages.push(message));
      this.filterTopicMessages();

      this.isLoading = false;
    });
  }
}
