import {AppComponent} from "./app.component";
import {PrettyJsonModule, SafeJsonPipe} from "angular2-prettyjson";
import {JsonPipe} from "@angular/common";
import {BrowserXhr, HttpModule} from "@angular/http";
import {ApiService} from "./topics/api.service";
import {CollapsibleItemComponent} from "./topics/collapsible-item.component";
import {TopicConsumersComponent} from "./topics/topic-consumers.component";
import {TopicsDataComponent} from "./topics/topics-data.component";
import {TopicsListComponent} from "./topics/topics-list.component";
import {BrokersComponent} from "./brokers/brokers.component";
import {ConsumersComponent} from "./consumers/consumers.component";
import {TopicsComponent} from "./topics/topics.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {NgProgressBrowserXhr, NgProgressModule} from "ngx-progressbar";
import {Ng2BootstrapModule} from "ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {routes} from "./routes";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    Ng2BootstrapModule.forRoot(),
    NgProgressModule,
    PrettyJsonModule
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    TopicsComponent,
    ConsumersComponent,
    BrokersComponent,
    TopicsListComponent,
    TopicsDataComponent,
    TopicConsumersComponent,
    CollapsibleItemComponent
  ],
  providers: [
    ApiService,
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr  },
    { provide: JsonPipe, useClass: SafeJsonPipe }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
