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
                <div class="collapse navbar-collapse">
                    <a class="navbar-brand" href="#">Kafka Visualizer</a>
                </div>
            </div>
        </nav>
    `
})
export class NavbarComponent {
}
