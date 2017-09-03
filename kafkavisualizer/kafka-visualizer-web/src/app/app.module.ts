import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserXhr, HttpModule} from "@angular/http";
import {Ng2BootstrapModule} from "ng-bootstrap";
import {NgProgressBrowserXhr, NgProgressModule} from "ngx-progressbar";
import {PrettyJsonModule, SafeJsonPipe} from "angular2-prettyjson";
import {AppComponent} from "./app.component";
import {NavbarComponent} from "./components/navbar.component";
import {AppBodyComponent} from "./components/app-body.component";
import {BrokersComponent} from "./components/brokers.component";
import {TopicsListComponent} from "./components/topics-list.component";
import {TopicsDataComponent} from "./components/topics-data.component";
import {TopicConsumersComponent} from "./components/topic-consumers.component";
import {CollapsibleItemComponent} from "./components/collapsible-item.component";
import {ApiService} from "./services/api.service";
import {JsonPipe} from "@angular/common";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        Ng2BootstrapModule.forRoot(),
        NgProgressModule,
        PrettyJsonModule
    ],
    declarations: [
        AppComponent,
        NavbarComponent,
        AppBodyComponent,
        BrokersComponent,
        TopicsListComponent,
        TopicsDataComponent,
        TopicConsumersComponent,
        CollapsibleItemComponent
    ],
    providers: [
        ApiService,
        { provide: BrowserXhr, useClass: NgProgressBrowserXhr },
        { provide: JsonPipe, useClass: SafeJsonPipe }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
