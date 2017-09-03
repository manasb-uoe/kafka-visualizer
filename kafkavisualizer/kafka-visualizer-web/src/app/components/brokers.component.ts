import {Component, OnInit} from "@angular/core";
import {KafkaBroker} from "../domain/KafkaBroker";
import {ApiService} from "../services/api.service";

@Component({
    selector: "brokers",
    template: `
        <div class="card">
            <h6 class="card-header">Registered Brokers</h6>

            <ul ng-if="!isLoading" class="list-group list-group-flush">
                <li *ngFor="let broker of brokers" class="list-group-item">
                    <span><span class="text-danger">Hostname: </span> {{broker.hostname}} - <span class="text-danger">Port: </span> {{broker.port}}</span>
                </li>
            </ul>

            <div *ngIf="!isLoading && brokers.length === 0" class="card-body">No brokers found</div>

            <div *ngIf="isLoading" class="card-body">Loading...</div>
        </div>
    `
})
export class BrokersComponent implements OnInit {
    public readonly brokers: Array<KafkaBroker> = [];

    public isLoading: boolean;

    public constructor(private apiService: ApiService) {
    }

    public ngOnInit(): void {
        this.isLoading = true;

        this.apiService.getBrokers().subscribe(brokers => {
            this.isLoading = false;

            this.brokers.length = 0;
            brokers.forEach(broker => this.brokers.push(broker));
        });
    }
}
