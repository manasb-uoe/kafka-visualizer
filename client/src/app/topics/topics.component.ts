import {Component} from "@angular/core";

@Component({
    selector: "topics",
    template: `
        <div class="row" style="margin-top: 30px">
            <div class="col-md-3">
                <topics-list (onTopicSelected)="topicDataComponent.selectedTopic = $event"></topics-list> 
            </div>
            <div class="col-md-6">
                <topic-data #topicDataComponent (onTopicPartitionSelected)="topicConsumersComponent.selectedTopicPartition = $event"></topic-data>
            </div>
            <div class="col-md-3">
                <topic-consumers #topicConsumersComponent></topic-consumers>
            </div>
        </div>

    `
})
export class TopicsComponent {
}