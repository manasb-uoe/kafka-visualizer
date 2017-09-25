import {Component, OnInit} from "@angular/core";
import {KafkaBroker} from "../domain/KafkaBroker";
import {ApiService} from "../services/api.service";

@Component({
  selector: "brokers",
  template: `
    <div class="sidebarHeader">Brokers</div>
    
    <div *ngIf="!isLoading">
      <div *ngFor="let broker of brokers" class="sidebarListItem">
        <div>
          <i class="fa fa-server" aria-hidden="true"></i>
          <span style="padding-left: 10px;">{{broker.hostname}}<span style="padding-left: 3px; padding-right: 3px;">:</span><span class="text-danger">{{broker.port}}</span></span>
        </div>
        <div class="text-primary" style="align-self: flex-end">{{broker.id}}</div>
      </div>
    </div>

    <div *ngIf="!isLoading && brokers.length === 0" class="sidebarListItem">No brokers found</div>
    <div *ngIf="isLoading" class="sidebarListItem">Loading...</div>
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
