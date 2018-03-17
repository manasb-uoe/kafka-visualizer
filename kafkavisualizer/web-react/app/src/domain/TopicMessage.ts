export default interface TopicMessage {
    topic: string;
    partition: number;
    timestamp: number;
    value: string;
    key: string;
}