import {Component} from "@angular/core";

@Component({
  selector: "navbar",
  template: `
    <nav class="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
      <a class="navbar-brand" href="#">Kafka Visualizer</a>
      <a class="nav-link ml-auto" href="https://github.com/enthusiast94/kafka-visualizer">View source on Github
        <span class="sr-only">(current)</span></a>
    </nav>
  `
})
export class NavbarComponent {
}
