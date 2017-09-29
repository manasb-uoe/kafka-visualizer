import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
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
import {TopicPublisherComponent} from "./components/topic-publisher.component";
import {Tabs} from "./components/tabs.component";
import {JQ_TOKEN} from "./services/jquery.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
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
    CollapsibleItemComponent,
    TopicPublisherComponent,
    Tabs.TabsComponent,
    Tabs.TabComponent
  ],
  providers: [
    ApiService,
    { provide: JsonPipe, useClass: SafeJsonPipe },
    { provide: JQ_TOKEN, useValue: (window as any).jQuery }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

