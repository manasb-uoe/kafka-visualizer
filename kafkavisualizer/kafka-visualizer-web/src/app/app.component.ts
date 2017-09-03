import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
        <ng-progress></ng-progress>
        <navbar></navbar>
        <div class="container-fluid">
            <router-outlet></router-outlet>
        </div>
    `
})
export class AppComponent {}
