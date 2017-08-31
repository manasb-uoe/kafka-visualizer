import {KafkaTopic} from "./KafkaTopic";

export class TopicPartition {
    public readonly topic: KafkaTopic;
    public readonly partition: number;

    public constructor(topic: KafkaTopic, partition: number) {
        this.topic = topic;
        this.partition = partition;
    }
}