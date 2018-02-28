import {Component, EventEmitter, Inject, OnInit, Output} from "@angular/core";
import {ApiService} from "../services/api.service";
import {KafkaTopic} from "../domain/KafkaTopic";
import {DOCUMENT} from "@angular/platform-browser";
import {StringUtils} from "../utils/StringUtils";

@Component({
  selector: "topics-list",
  template: `
    <div class="sidebarHeader">Topics</div>
    <input [ngModel]="searchTerm" (ngModelChange)="onSearchTermChanged($event)" class="form-control form-control-sm"
           placeholder="Search" style="padding: 7px 15px; border-left: none; border-right: none; 
           border-top: 1px solid var(--borderColor); border-bottom: 1px solid var(--borderColor)">

    <div *ngIf="!isLoading">
      <div *ngFor="let topic of filteredTopics" [class.selected]="topic.isSelected" (click)="selectTopic(topic)"
           class="sidebarListItem pointable selectable">
        <div>
          <i class="fa fa-rss" aria-hidden="true"></i>
          <span style="padding-left: 10px;" [innerHtml]="markSearchTermInString(topic.name)"></span>
        </div>
        <div class="text-primary" style="align-self: flex-end">{{topic.numPartitions}}</div>
      </div>
    </div>

    <div class="sidebarListItem" *ngIf="filteredTopics.length === 0">No topics found</div>
    <div *ngIf="isLoading" class="sidebarListItem">Loading...</div>
  `
})
export class TopicsListComponent implements OnInit {

  @Output() public onTopicSelected = new EventEmitter();
  public kafkaTopics: Array<KafkaTopic> = [];
  public searchTerm: string;
  public filteredTopics: Array<KafkaTopic> = [];
  public isLoading: boolean;

  public constructor(private apiService: ApiService, @Inject(DOCUMENT) private document: Document) {
  }

  public ngOnInit(): void {
    this.isLoading = true;

    this.apiService.getTopics().subscribe(topics => {
      this.isLoading = false;
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

  public markSearchTermInString(inputString: string): string {
    return StringUtils.markSearchTermInString(inputString, this.searchTerm);
  }

  private scrollToTop(): void {
    this.document.body.scrollTop = 0;
  }
}
