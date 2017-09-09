import {Component, Input} from "@angular/core";
import {ApiService} from "../services/api.service";
import {KafkaTopic} from "../domain/KafkaTopic";
import {RecordMetadata} from "../domain/RecordMetadata";

@Component({
  selector: "topic-publisher",
  template: `
    <div class="card">
      <div *ngIf="selectedTopic" class="card-header card-header-title">Publish data to <span
        class="text-primary">{{selectedTopic.name}}</span>
      </div>

      <div *ngIf="!selectedTopic" class="card-header card-header-title">No Topic Selected</div>

      <div *ngIf="selectedTopic" class="card-body">
        <form #form="ngForm" (ngSubmit)="onFormSubmit(form.value)">
          <div class="form-group">
            <input [(ngModel)]="key" name="key" placeholder="Key" class="form-control form-control-sm" required>
          </div>
          <div class="form-group">
            <textarea rows="8" [(ngModel)]="value" name="value" placeholder="Value" class="form-control form-control-sm"
                      required></textarea>
          </div>
          <div style="text-align: right">
            <button type="button" class="btn btn-primary btn-sm" (click)="clearForm();">Clear</button>
            <button [disabled]="form.invalid || isLoading" class="btn btn-success btn-sm">Publish</button>
          </div>
          <div *ngIf="publishedRecordMetadata" class="text-success" style="margin-top: 10px;">Message successfully posted to partition
            <strong>[{{publishedRecordMetadata.partition}}]</strong> at offset <strong>[{{publishedRecordMetadata.offset}}]</strong>
          </div>
        </form>
      </div>

    </div>

  `
})
export class TopicPublisherComponent {

  @Input() public selectedTopic: KafkaTopic;
  public isLoading = false;
  public key: string;
  public value: string;
  public publishedRecordMetadata: RecordMetadata;

  public constructor(private apiService: ApiService) {
  }

  public onFormSubmit(formData: any): void {
    this.isLoading = true;

    this.apiService.publishTopicMessage(this.selectedTopic, formData.key, formData.value).subscribe(recordMetadata => {
      this.publishedRecordMetadata = recordMetadata;
      this.isLoading = false;
    });
  }

  public clearForm(): void {
    this.key = "";
    this.value = "";
    this.publishedRecordMetadata = null;
  }
}
