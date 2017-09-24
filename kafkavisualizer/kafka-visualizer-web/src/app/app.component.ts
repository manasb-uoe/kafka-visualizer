import { Component } from "@angular/core";

@Component({
    selector: "app-root",
    template: `
        <navbar></navbar>
        <div class="container-fluid">
            <app-body></app-body>
        </div>
    `
})
export class AppComponent {}
