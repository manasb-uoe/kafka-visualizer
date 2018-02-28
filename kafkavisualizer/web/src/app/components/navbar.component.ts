import {Component, OnInit} from "@angular/core";
import {ApiService} from "../services/api.service";

@Component({
    selector: "navbar",
    template: `
        <nav class="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
            <a class="navbar-brand" href="#">Kafka Visualizer</a>
            <div class="text-white ml-auto">Environment: <span class="font-weight-bold">{{environment}}</span></div>
        </nav>
    `
})
export class NavbarComponent implements OnInit {

    public environment: string;

    public constructor(private apiService: ApiService) {}

    public ngOnInit(): void {
        this.apiService.getEnvironment().subscribe(environment => this.environment = environment);
    }
}
