import { IApi } from './Api';
import { Observable, Subject } from 'rxjs';
import Topic from '../domain/Topic';
import Broker from '../domain/Broker';
import TopicMessage from '../domain/TopicMessage';
import RecordMetadata from '../domain/RecordMetadata';

export class MockApi implements IApi {

    private static readonly DELAY = 200;

    private readonly messages: TopicMessage[] = [
        { topic: 'TopicOne', offset: 0, partition: 0, timestamp: Date.now(), value: '{ "name":"John", "age":31, "city":"New York" }', key: 'this is a key' },
        { topic: 'TopicOne', offset: 1, partition: 0, timestamp: Date.now(), value: '<person><name>Mr Mate</name><age>12</age></person>', key: 'key2' },
        { topic: 'TopicTwo', offset: 0, partition: 0, timestamp: Date.now(), value: '{ "name":"John", "age":31, "city":"New York" }', key: 'key3' },
        { topic: 'TopicTwo', offset: 1, partition: 0, timestamp: Date.now(), value: '{ "name":"John", "age":31, "city":"New York" }', key: 'bla' },
        { topic: 'TopicTwo', offset: 3, partition: 0, timestamp: Date.now(), value: '{ "name":"John", "age":31, "city":"New York" }', key: 'heueu' },
        { topic: 'TopicFour', offset: 2, partition: 3, timestamp: Date.now(), value: '{ "name":"John", "age":31, "city":"New York" }', key: 'key' },
        { topic: 'TopicThree', offset: 0, partition: 0, timestamp: Date.now(), value: '{ "name":"John", "age":31, "city":"New York" }', key: 'key' }
    ];
    private messagesSubject: Subject<TopicMessage[]>;

    public publishTopicMessage(topic: Topic, key: string, value: string): Observable<RecordMetadata> {
        this.messages.push({
            topic: topic.name,
            offset: 0,
            partition: 0,
            timestamp: Date.now(),
            value: value,
            key: key
        });
        this.messagesSubject.next(this.messages);

        const subject = new Subject<RecordMetadata>();
        setTimeout(() => subject.next(<RecordMetadata> { offset: 0, partition: 0 }), MockApi.DELAY);

        return subject.asObservable();
    }

    public getTopics(): Observable<Topic[]> {
        const subject = new Subject<Topic[]>();
        const topics: Topic[] = [
            { name: 'TopicOne', numPartitions: 1 },
            { name: 'TopicTwo', numPartitions: 1 },
            { name: 'TopicThree', numPartitions: 2 },
            { name: 'TopicFour', numPartitions: 4 },
        ];

        setTimeout(() => subject.next(topics), MockApi.DELAY);
        setTimeout(() => subject.next(topics.concat({ name: 'AnotherTopicThatGotAddedLater', numPartitions: 1 })), 6000);
        return subject.asObservable();
    }

    public getBrokers(): Observable<Broker[]> {
        const subject = new Subject<Broker[]>();
        const brokers: Broker[] = [
            { id: 1, hostname: 'localhost', port: 3001 },
            { id: 2, hostname: 'localhost', port: 3002 },
            { id: 3, hostname: 'localhost', port: 3003 }
        ];

        setTimeout(() => subject.next(brokers), MockApi.DELAY);

        return subject.asObservable();
    }

    public getTopicMessages(topic: Topic, partition: number, query: string): Observable<TopicMessage[]> {
        this.messagesSubject = new Subject<TopicMessage[]>();
        var filter = (messages: TopicMessage[]) => {
            return query ?
                this.messages.filter(message => message.topic === topic.name && message.partition === partition && message.value.toLowerCase().trim().includes(query.toLowerCase().trim())) :
                this.messages.filter(message => message.topic === topic.name && message.partition === partition);
        };

        setTimeout(
            () => this.messagesSubject.next(filter(this.messages)),
            MockApi.DELAY);

        return this.messagesSubject.asObservable();
    }
}