export default interface TopicMessage {
    topic: string;
    offset: number;
    partition: number;
    timestamp: number;
    value: string;
    key: string;
}