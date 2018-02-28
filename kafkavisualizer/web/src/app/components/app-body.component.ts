import {Component} from "@angular/core";

@Component({
    selector: "app-body",
    template: `
        <div class="row">
            <div class="col-3 sidebar">
                <brokers></brokers>
                <topics-list (onTopicSelected)="topicDataComponent.selectedTopic = $event;
                topicConsumersComponent.selectedTopic = $event; topicPublisherComponent.selectedTopic = $event;"></topics-list>
            </div>

            <div class="col-9 ml-auto" style="margin-top: 15px;">
                <tabs>
                    <tab title="Messages">
                        <topic-data #topicDataComponent
                          (onPublishButtonClicked)="topicPublisherComponent.showModal()"></topic-data>
                    </tab>
                    <tab title="Consumers">
                        <topic-consumers #topicConsumersComponent></topic-consumers>
                    </tab>
                </tabs>
            </div>
        </div>

        <topic-publisher #topicPublisherComponent></topic-publisher>
    `
})
export class AppBodyComponent {
}
