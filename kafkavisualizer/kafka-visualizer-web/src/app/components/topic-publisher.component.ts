import {Component, Inject, Input} from "@angular/core";
import {ApiService} from "../services/api.service";
import {KafkaTopic} from "../domain/KafkaTopic";
import {RecordMetadata} from "../domain/RecordMetadata";
import {JQ_TOKEN} from "../services/jquery.service";

@Component({
    selector: "topic-publisher",
    template: `
        <div class="modal fade" id="publisherModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div *ngIf="selectedTopic" class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Publish data to <span class="text-primary">{{selectedTopic.name}}</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form #form="ngForm" (ngSubmit)="onFormSubmit(form.value)">
                            <div class="form-group">
                                <input [(ngModel)]="key" name="key" placeholder="Key"
                                       class="form-control form-control-sm"
                                       required>
                            </div>
                            <div class="form-group">
            <textarea rows="8" [(ngModel)]="value" name="value" placeholder="Value" class="form-control form-control-sm"
                      required></textarea>
                            </div>
                            <div style="text-align: right">
                                <button type="button" class="btn  btn-primary btn-sm" (click)="clearForm();">Clear
                                </button>
                                <button [disabled]="form.invalid || isLoading" class="btn btn-success btn-sm">Publish
                                </button>
                            </div>
                            <div *ngIf="publishedRecordMetadata" class="text-success" style="margin-top: 10px;">Message
                                successfully posted to partition
                                <strong>[{{publishedRecordMetadata.partition}}]</strong> at offset
                                <strong>[{{publishedRecordMetadata.offset}}]</strong>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TopicPublisherComponent {

    public isLoading = false;
    public key: string;
    public value: string;
    public publishedRecordMetadata: RecordMetadata;
    @Input() private _selectedTopic: KafkaTopic;

    public constructor(private apiService: ApiService, @Inject(JQ_TOKEN) private $: any) {}

    public get selectedTopic(): KafkaTopic {
        return this._selectedTopic;
    }

    public set selectedTopic(value: KafkaTopic) {
        this._selectedTopic = value;
        this.clearForm();
    }

    public onFormSubmit(formData: any): void {
        this.isLoading = true;

        this.apiService.publishTopicMessage(this._selectedTopic, formData.key, formData.value).subscribe(recordMetadata => {
            this.publishedRecordMetadata = recordMetadata;
            this.isLoading = false;
        });
    }

    public showModal() {
        this.$("#publisherModal").modal("show");
    }

    public clearForm(): void {
        this.key = "";
        this.value = "";
        this.publishedRecordMetadata = null;
    }
}
