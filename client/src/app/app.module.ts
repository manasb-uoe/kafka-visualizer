import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {RouterModule} from "@angular/router";
import {TopicsComponent} from "./topics/topics.component";
import {ConsumersComponent} from "./consumers/consumers.component";
import {BrokersComponent} from "./brokers/brokers.component";
import {routes} from "./routes";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TopicsComponent,
    ConsumersComponent,
    BrokersComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
