import {Routes} from "@angular/router";
import {TopicsComponent} from "./topics/topics.component";
import {ConsumersComponent} from "./consumers/consumers.component";
import {BrokersComponent} from "./brokers/brokers.component";

export const routes: Routes = [
  {path: "topics", component: TopicsComponent},
  {path: "consumers", component: ConsumersComponent},
  {path: "brokers", component: BrokersComponent},
  {path: "", redirectTo: "/topics", pathMatch: "full"},
];
