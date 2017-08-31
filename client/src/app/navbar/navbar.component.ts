import {Component} from "@angular/core";

@Component({
    selector: "navbar",
    template: `
        <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
                        aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <a class="navbar-brand" routerLink="/topics">Kafka Visualizer</a>
                    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" routerLink="/topics" routerLinkActive="active">Topics</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" routerLink="/consumers" routerLinkActive="active">Consumers</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" routerLink="/brokers" routerLinkActive="active">Brokers</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `
})
export class NavbarComponent {
}