import { IApi } from './Api';
import { Observable, Subject } from 'rxjs';
import Topic from '../domain/Topic';
import Broker from '../domain/Broker';
import TopicMessage from '../domain/TopicMessage';

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

    getTopicMessages(topic: Topic, partition: number, query: string): Observable<TopicMessage[]> {
        const subject = new Subject<TopicMessage[]>();

        var filter = (messages: TopicMessage[]) => {
            return query ?
                this.messages.filter(message => message.topic === topic.name && message.partition === partition && message.value.includes(query)) :
                this.messages.filter(message => message.topic === topic.name && message.partition === partition);
        };

        setTimeout(
            () => subject.next(filter(this.messages)),
            MockApi.DELAY);
            
        return subject.asObservable();
    }
}